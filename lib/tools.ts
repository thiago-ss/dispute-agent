import { tool } from "ai";
import { z } from "zod";
import { getInvoiceById, getInvoicesByCustomerId } from "./data/invoices";
import { getShipmentById, getShipmentByInvoiceId } from "./data/shipments";
import { getContractByCustomerId } from "./data/contracts";
import { getCustomerByName, getCustomerById } from "./data/customers";
import { getCaseByInvoiceId, updateCase } from "./data/cases";

export const lookupInvoice = tool({
  description:
    "Look up invoice details by invoice ID or by customer name. Returns the invoice with all line items.",
  inputSchema: z.object({
    invoiceId: z.string().optional().describe("The invoice ID (e.g. inv-001)"),
    customerName: z
      .string()
      .optional()
      .describe("Customer name to find all their invoices"),
  }),
  execute: async ({ invoiceId, customerName }) => {
    if (invoiceId) {
      const invoice = getInvoiceById(invoiceId);
      if (!invoice) return { error: `Invoice ${invoiceId} not found` };
      return { invoice };
    }
    if (customerName) {
      const customer = getCustomerByName(customerName);
      if (!customer)
        return { error: `No customer found matching "${customerName}"` };
      const invoices = getInvoicesByCustomerId(customer.id);
      return { customer, invoices };
    }
    return { error: "Provide either invoiceId or customerName" };
  },
});

export const getShipmentTimeline = tool({
  description:
    "Retrieve the shipment timeline and events for a given shipment ID or invoice ID. Use this to verify detention wait times.",
  inputSchema: z.object({
    shipmentId: z.string().optional().describe("The shipment ID (e.g. ship-001)"),
    invoiceId: z
      .string()
      .optional()
      .describe("Look up shipment by invoice ID"),
  }),
  execute: async ({ shipmentId, invoiceId }) => {
    const shipment = shipmentId
      ? getShipmentById(shipmentId)
      : invoiceId
      ? getShipmentByInvoiceId(invoiceId)
      : null;

    if (!shipment) return { error: "Shipment not found" };
    return { shipment };
  },
});

export const checkContractTerms = tool({
  description:
    "Retrieve the active contract terms for a customer, including fuel surcharge caps, detention free window, and accessorial rates.",
  inputSchema: z.object({
    customerId: z
      .string()
      .optional()
      .describe("Customer ID (e.g. cust-001)"),
    customerName: z
      .string()
      .optional()
      .describe("Customer name to look up contract"),
  }),
  execute: async ({ customerId, customerName }) => {
    let id = customerId;
    if (!id && customerName) {
      const customer = getCustomerByName(customerName);
      if (!customer)
        return { error: `No customer found matching "${customerName}"` };
      id = customer.id;
    }
    if (!id) return { error: "Provide customerId or customerName" };
    const contract = getContractByCustomerId(id);
    const customer = getCustomerById(id);
    if (!contract) return { error: `No contract found for customer ${id}` };
    return { customer, contract };
  },
});

export const validateCharge = tool({
  description:
    "Validate whether a specific charge on an invoice is correct given the shipment data and contract terms. Returns whether the charge is valid, expected amount, and reasoning.",
  inputSchema: z.object({
    chargeType: z
      .enum([
        "detention",
        "fuel-surcharge",
        "liftgate",
        "residential-delivery",
        "accessorial",
        "freight",
      ])
      .describe("The type of charge to validate"),
    invoiceId: z.string().describe("The invoice ID containing the charge"),
    billedAmount: z.number().describe("The amount billed on the invoice"),
    notes: z
      .string()
      .optional()
      .describe("Additional context from the invoice or dispute"),
  }),
  execute: async ({ chargeType, invoiceId, billedAmount, notes }) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return { error: `Invoice ${invoiceId} not found` };

    const shipment = getShipmentByInvoiceId(invoiceId);
    const contract = getContractByCustomerId(invoice.customerId);
    if (!contract) return { error: "No contract found for this customer" };

    const terms = contract.terms;

    if (chargeType === "detention") {
      if (!shipment) return { error: "No shipment data to validate detention" };
      const events = shipment.events;

      const arrived = events.find(
        (e) =>
          e.event.toLowerCase().includes("arrived") ||
          e.event.toLowerCase().includes("checked in")
      );
      const loadingStart = events.find(
        (e) =>
          e.event.toLowerCase().includes("loading commenced") ||
          e.event.toLowerCase().includes("loading started")
      );

      if (!arrived || !loadingStart) {
        return {
          valid: null,
          reason:
            "Cannot determine detention wait time — missing arrival or loading-start event",
        };
      }

      const arrivedTime = new Date(arrived.timestamp).getTime();
      const loadingTime = new Date(loadingStart.timestamp).getTime();
      const waitHours = (loadingTime - arrivedTime) / 1000 / 60 / 60;
      const billableHours = Math.max(
        0,
        waitHours - terms.freeDetentionWindowHours
      );
      const expectedAmount =
        Math.round(billableHours) * terms.detentionRatePerHour;

      if (billableHours <= 0) {
        return {
          valid: false,
          billedAmount,
          expectedAmount: 0,
          overcharge: billedAmount,
          reason: `Driver waited ${waitHours.toFixed(2)} hours. Contract allows ${terms.freeDetentionWindowHours}-hour free window. No billable detention applies.`,
          waitHours: parseFloat(waitHours.toFixed(2)),
          freeWindowHours: terms.freeDetentionWindowHours,
          billableHours: 0,
        };
      }

      const isValid =
        Math.abs(billedAmount - expectedAmount) < 1;

      return {
        valid: isValid,
        billedAmount,
        expectedAmount,
        overcharge: isValid ? 0 : billedAmount - expectedAmount,
        reason: isValid
          ? `Detention is valid. Driver waited ${waitHours.toFixed(2)} hours. After ${terms.freeDetentionWindowHours}-hour free window, ${billableHours.toFixed(2)} billable hours × $${terms.detentionRatePerHour}/hr = $${expectedAmount}.`
          : `Detention overcharged. Driver waited ${waitHours.toFixed(2)} hours, ${billableHours.toFixed(2)} billable hours × $${terms.detentionRatePerHour}/hr = $${expectedAmount}, but billed $${billedAmount}.`,
        waitHours: parseFloat(waitHours.toFixed(2)),
        freeWindowHours: terms.freeDetentionWindowHours,
        billableHours: parseFloat(billableHours.toFixed(2)),
      };
    }

    if (chargeType === "fuel-surcharge") {
      const freightItem = invoice.items.find((i) => i.type === "freight");
      if (!freightItem) return { error: "No freight line item found" };

      const maxAllowed =
        freightItem.total * (terms.fuelSurchargeCapPercent / 100);
      const isValid = billedAmount <= maxAllowed + 0.01;

      return {
        valid: isValid,
        billedAmount,
        expectedAmount: parseFloat(maxAllowed.toFixed(2)),
        overcharge: isValid
          ? 0
          : parseFloat((billedAmount - maxAllowed).toFixed(2)),
        reason: isValid
          ? `Fuel surcharge is within the contracted cap of ${terms.fuelSurchargeCapPercent}% on $${freightItem.total} freight = $${maxAllowed.toFixed(2)}.`
          : `Fuel surcharge exceeds contracted cap. Contract allows max ${terms.fuelSurchargeCapPercent}% on $${freightItem.total} freight = $${maxAllowed.toFixed(2)}, but billed $${billedAmount}.`,
        contractedCapPercent: terms.fuelSurchargeCapPercent,
        freightBase: freightItem.total,
        maxAllowed: parseFloat(maxAllowed.toFixed(2)),
      };
    }

    if (chargeType === "liftgate") {
      const expectedAmount = terms.liftgateRate;
      const isValid = Math.abs(billedAmount - expectedAmount) < 1;
      return {
        valid: isValid,
        billedAmount,
        expectedAmount,
        overcharge: isValid ? 0 : billedAmount - expectedAmount,
        reason: isValid
          ? `Liftgate charge of $${billedAmount} matches contracted rate of $${expectedAmount}.`
          : `Liftgate charge of $${billedAmount} does not match contracted rate of $${expectedAmount}.`,
      };
    }

    if (chargeType === "residential-delivery") {
      const expectedAmount = terms.residentialDeliveryRate;
      const isValid = Math.abs(billedAmount - expectedAmount) < 1;
      return {
        valid: isValid,
        billedAmount,
        expectedAmount,
        overcharge: isValid ? 0 : billedAmount - expectedAmount,
        reason: isValid
          ? `Residential delivery fee of $${billedAmount} matches contracted rate of $${expectedAmount}.`
          : `Residential delivery fee of $${billedAmount} does not match contracted rate of $${expectedAmount}.`,
      };
    }

    return {
      valid: null,
      reason: `Charge type "${chargeType}" validation not implemented — requires manual review`,
    };
  },
});

export const draftResponseEmail = tool({
  description:
    "Draft a professional dispute resolution response e-mail to send to the customer.",
  inputSchema: z.object({
    invoiceId: z.string().describe("The invoice being responded to"),
    customerName: z.string().describe("Customer name for salutation"),
    contactPerson: z.string().describe("Customer contact person name"),
    findings: z
      .array(
        z.object({
          chargeType: z.string(),
          valid: z.boolean().nullable(),
          billedAmount: z.number(),
          expectedAmount: z.number().optional(),
          overcharge: z.number().optional(),
          summary: z.string(),
        })
      )
      .describe("Array of charge validation findings"),
    totalOvercharge: z
      .number()
      .describe("Total amount to be credited back, 0 if no overcharge"),
  }),
  execute: async ({
    invoiceId,
    customerName,
    contactPerson,
    findings,
    totalOvercharge,
  }) => {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const findingsText = findings
      .map((f) => {
        const status =
          f.valid === true
            ? "VALID"
            : f.valid === false
            ? "DISPUTE UPHELD"
            : "REQUIRES REVIEW";
        const amountNote =
          f.valid === false && f.overcharge
            ? ` (overcharge: $${f.overcharge.toFixed(2)})`
            : "";
        return `  • ${f.chargeType.toUpperCase()} — ${status}${amountNote}: ${f.summary}`;
      })
      .join("\n");

    const resolution =
      totalOvercharge > 0
        ? `Based on our review, we will issue a credit of $${totalOvercharge.toFixed(2)} to your account within 3-5 business days.`
        : `Based on our review, all charges on invoice ${invoiceId} are consistent with your contracted rates and the shipment data on file. We are unable to issue a credit at this time.`;

    const email = `Subject: Re: Invoice ${invoiceId} — Dispute Resolution

Dear ${contactPerson},

Thank you for contacting us regarding invoice ${invoiceId}. We have completed our review of your dispute.

FINDINGS SUMMARY:

${findingsText}

RESOLUTION:

${resolution}

${
  totalOvercharge > 0
    ? `A revised invoice will be issued reflecting the adjusted amount. If you have any questions, please don't hesitate to reach out.\n`
    : `We have attached the shipment timeline and contract terms for your reference. If you believe this determination is in error, please reply with any additional documentation and we will re-examine your case.\n`
}
We value your partnership with us and appreciate your business.

Best regards,
Dispute Resolution Team
AdoptAI Logistics Solutions

Date: ${date}
Reference: ${invoiceId}`;

    return { email, subject: `Re: Invoice ${invoiceId} — Dispute Resolution` };
  },
});

export const updateCrmCase = tool({
  description:
    "Update the CRM case status and add a resolution note after the dispute has been investigated.",
  inputSchema: z.object({
    invoiceId: z
      .string()
      .optional()
      .describe("Invoice ID to find the associated case"),
    caseId: z.string().optional().describe("Direct case ID to update"),
    status: z
      .enum(["open", "in-progress", "resolved", "closed"])
      .describe("New status for the case"),
    resolution: z
      .string()
      .describe("Summary of the resolution and findings"),
  }),
  execute: async ({ invoiceId, caseId, status, resolution }) => {
    let id = caseId;
    if (!id && invoiceId) {
      const c = getCaseByInvoiceId(invoiceId);
      if (c) id = c.id;
    }
    if (!id) return { error: "Could not find a case for this invoice" };

    const updated = updateCase(id, {
      status,
      note: resolution,
      author: "DisputeAI Agent",
    });

    if (!updated) return { error: `Case ${id} not found` };

    return {
      success: true,
      caseId: updated.id,
      newStatus: updated.status,
      message: `Case ${updated.id} updated to "${status}". Resolution note added.`,
    };
  },
});

export const agentTools = {
  lookupInvoice,
  getShipmentTimeline,
  checkContractTerms,
  validateCharge,
  draftResponseEmail,
  updateCrmCase,
};
