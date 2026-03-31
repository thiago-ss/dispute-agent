export interface ShipmentEvent {
  timestamp: string;
  event: string;
  location?: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  invoiceId: string;
  origin: string;
  destination: string;
  carrier: string;
  containerId: string;
  events: ShipmentEvent[];
}

export const shipments: Shipment[] = [
  {
    // Scenario 1: Valid detention — driver waited 4hrs, 2hr free window → 2hrs billable
    id: "ship-001",
    invoiceId: "inv-001",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    carrier: "Southwest Express",
    containerId: "CONT-44821",
    events: [
      { timestamp: "2025-03-10T08:00:00Z", event: "Arrived at facility", location: "Phoenix Distribution Center" },
      { timestamp: "2025-03-10T08:15:00Z", event: "Driver checked in", location: "Gate 3" },
      { timestamp: "2025-03-10T12:30:00Z", event: "Loading commenced", notes: "Forklift finally available" },
      { timestamp: "2025-03-10T13:45:00Z", event: "Loading complete" },
      { timestamp: "2025-03-10T14:00:00Z", event: "Departed facility" },
    ],
  },
  {
    // Scenario 2: Invalid fuel surcharge — invoice shows 24%, contract caps at 20%
    id: "ship-002",
    invoiceId: "inv-002",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    carrier: "Great Lakes Transport",
    containerId: "CONT-78234",
    events: [
      { timestamp: "2025-03-15T07:00:00Z", event: "Picked up at origin", location: "Chicago Warehouse" },
      { timestamp: "2025-03-15T09:30:00Z", event: "Arrived at destination", location: "Detroit Facility" },
      { timestamp: "2025-03-15T10:00:00Z", event: "Delivery confirmed", notes: "POD signed" },
    ],
  },
  {
    // Scenario 3: Mixed — detention invalid (only 45min wait), but liftgate charge is valid
    id: "ship-003",
    invoiceId: "inv-003",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    carrier: "Pacific Cascade Freight",
    containerId: "CONT-91045",
    events: [
      { timestamp: "2025-03-20T10:00:00Z", event: "Arrived at facility", location: "Portland Warehouse" },
      { timestamp: "2025-03-20T10:15:00Z", event: "Driver checked in" },
      { timestamp: "2025-03-20T10:45:00Z", event: "Loading commenced" },
      { timestamp: "2025-03-20T11:30:00Z", event: "Loading complete" },
      { timestamp: "2025-03-20T11:45:00Z", event: "Departed facility" },
      { timestamp: "2025-03-20T11:45:00Z", event: "Liftgate used for unloading", notes: "Residential delivery, liftgate required" },
    ],
  },
];

export function getShipmentById(id: string) {
  return shipments.find((s) => s.id === id) ?? null;
}

export function getShipmentByInvoiceId(invoiceId: string) {
  return shipments.find((s) => s.invoiceId === invoiceId) ?? null;
}
