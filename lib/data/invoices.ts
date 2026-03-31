export interface LineItem {
  type: "detention" | "fuel-surcharge" | "accessorial" | "freight" | "liftgate" | "residential-delivery";
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  shipmentId: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  total: number;
  status: "open" | "disputed" | "paid" | "resolved";
}

export const invoices: Invoice[] = [
  {
    // Scenario 1: Valid detention — driver waited 4h15m (arrival 08:00, loading start 12:30)
    // Free window: 2hrs → 2h15m billable = 2.25hrs × $75 = $168.75 (rounded to 2hrs → $150)
    id: "inv-001",
    customerId: "cust-001",
    shipmentId: "ship-001",
    date: "2025-03-12",
    dueDate: "2025-04-12",
    items: [
      {
        type: "freight",
        description: "LA to PHX freight base rate",
        quantity: 1,
        unitPrice: 1200.0,
        total: 1200.0,
      },
      {
        type: "fuel-surcharge",
        description: "Fuel surcharge (18%)",
        quantity: 1,
        unitPrice: 216.0,
        total: 216.0,
      },
      {
        type: "detention",
        description: "Detention – 2 billable hours @ $75/hr (4h15m wait minus 2hr free window)",
        quantity: 2,
        unitPrice: 75.0,
        total: 150.0,
      },
    ],
    total: 1566.0,
    status: "disputed",
  },
  {
    // Scenario 2: Invalid fuel surcharge — billed 24%, contract caps at 20%
    // Base freight: $2,500 → 24% = $600 billed, 20% cap = $500 correct → overcharge: $100
    id: "inv-002",
    customerId: "cust-001",
    shipmentId: "ship-002",
    date: "2025-03-17",
    dueDate: "2025-04-17",
    items: [
      {
        type: "freight",
        description: "Chicago to Detroit freight base rate",
        quantity: 1,
        unitPrice: 2500.0,
        total: 2500.0,
      },
      {
        type: "fuel-surcharge",
        description: "Fuel surcharge (24%)",
        quantity: 1,
        unitPrice: 600.0,
        total: 600.0,
      },
    ],
    total: 3100.0,
    status: "disputed",
  },
  {
    // Scenario 3: Mixed — invalid detention (only 45min wait, under 2hr free window)
    // but valid liftgate charge ($95 per contract) and valid residential delivery ($55)
    id: "inv-003",
    customerId: "cust-002",
    shipmentId: "ship-003",
    date: "2025-03-22",
    dueDate: "2025-04-22",
    items: [
      {
        type: "freight",
        description: "Seattle to Portland freight base rate",
        quantity: 1,
        unitPrice: 850.0,
        total: 850.0,
      },
      {
        type: "fuel-surcharge",
        description: "Fuel surcharge (16%)",
        quantity: 1,
        unitPrice: 136.0,
        total: 136.0,
      },
      {
        type: "detention",
        description: "Detention – 1 hour @ $65/hr",
        quantity: 1,
        unitPrice: 65.0,
        total: 65.0,
      },
      {
        type: "liftgate",
        description: "Liftgate service",
        quantity: 1,
        unitPrice: 95.0,
        total: 95.0,
      },
      {
        type: "residential-delivery",
        description: "Residential delivery fee",
        quantity: 1,
        unitPrice: 55.0,
        total: 55.0,
      },
    ],
    total: 1201.0,
    status: "disputed",
  },
];

export function getInvoiceById(id: string) {
  return invoices.find((inv) => inv.id === id) ?? null;
}

export function getInvoicesByCustomerId(customerId: string) {
  return invoices.filter((inv) => inv.customerId === customerId);
}
