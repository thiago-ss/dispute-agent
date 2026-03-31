export interface CaseHistoryEntry {
  timestamp: string;
  author: string;
  note: string;
}

export interface Case {
  id: string;
  customerId: string;
  invoiceId: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  history: CaseHistoryEntry[];
}

export const cases: Case[] = [
  {
    id: "case-001",
    customerId: "cust-001",
    invoiceId: "inv-001",
    subject: "Dispute: Invoice INV-001 — Detention charges",
    status: "open",
    priority: "medium",
    createdAt: "2025-03-14T09:00:00Z",
    history: [
      {
        timestamp: "2025-03-14T09:00:00Z",
        author: "Maria Chen (FastFreight)",
        note: "Customer submitted dispute via email. Claims detention charges are invalid.",
      },
    ],
  },
  {
    id: "case-002",
    customerId: "cust-001",
    invoiceId: "inv-002",
    subject: "Dispute: Invoice INV-002 — Fuel surcharge overcharge",
    status: "open",
    priority: "high",
    createdAt: "2025-03-19T11:30:00Z",
    history: [
      {
        timestamp: "2025-03-19T11:30:00Z",
        author: "Maria Chen (FastFreight)",
        note: "Customer disputes fuel surcharge rate of 24%, states contract caps at 20%.",
      },
    ],
  },
  {
    id: "case-003",
    customerId: "cust-002",
    invoiceId: "inv-003",
    subject: "Dispute: Invoice inv-003 — Detention and accessorial charges",
    status: "open",
    priority: "medium",
    createdAt: "2025-03-24T14:00:00Z",
    history: [
      {
        timestamp: "2025-03-24T14:00:00Z",
        author: "James Okafor (Pacific Container Lines)",
        note: "Customer disputes detention, liftgate, and residential delivery fees.",
      },
    ],
  },
];

export const casesStore: Case[] = cases.map((c) => ({ ...c }));

export function getCaseById(id: string) {
  return casesStore.find((c) => c.id === id) ?? null;
}

export function getCaseByInvoiceId(invoiceId: string) {
  return casesStore.find((c) => c.invoiceId === invoiceId) ?? null;
}

export function updateCase(
  id: string,
  updates: Partial<Pick<Case, "status" | "priority">> & { note?: string; author?: string }
) {
  const c = casesStore.find((c) => c.id === id);
  if (!c) return null;
  if (updates.status) c.status = updates.status;
  if (updates.priority) c.priority = updates.priority;
  if (updates.note) {
    c.history.push({
      timestamp: new Date().toISOString(),
      author: updates.author ?? "DisputeAI Agent",
      note: updates.note,
    });
  }
  return c;
}
