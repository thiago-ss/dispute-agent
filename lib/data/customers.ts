export interface Customer {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone: string;
}

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "FastFreight Logistics",
    email: "ar@fastfreight.com",
    contactPerson: "Maria Chen",
    phone: "415-555-0192",
  },
  {
    id: "cust-002",
    name: "Pacific Container Lines",
    email: "billing@paccontainer.com",
    contactPerson: "James Okafor",
    phone: "310-555-0847",
  },
  {
    id: "cust-003",
    name: "MidWest Haulers",
    email: "disputes@midwesthaulers.com",
    contactPerson: "Sarah Novak",
    phone: "312-555-0334",
  },
];

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id) ?? null;
}

export function getCustomerByName(name: string) {
  return (
    customers.find((c) => c.name.toLowerCase().includes(name.toLowerCase())) ??
    null
  );
}
