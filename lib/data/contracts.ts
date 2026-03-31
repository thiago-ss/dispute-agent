export interface ContractTerms {
  fuelSurchargeCapPercent: number;
  freeDetentionWindowHours: number;
  detentionRatePerHour: number;
  liftgateRate: number;
  residentialDeliveryRate: number;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface Contract {
  id: string;
  customerId: string;
  terms: ContractTerms;
}

export const contracts: Contract[] = [
  {
    id: "contract-001",
    customerId: "cust-001",
    terms: {
      fuelSurchargeCapPercent: 20,
      freeDetentionWindowHours: 2,
      detentionRatePerHour: 75,
      liftgateRate: 85,
      residentialDeliveryRate: 60,
      effectiveFrom: "2025-01-01",
      effectiveTo: "2025-12-31",
    },
  },
  {
    id: "contract-002",
    customerId: "cust-002",
    terms: {
      fuelSurchargeCapPercent: 18,
      freeDetentionWindowHours: 3,
      detentionRatePerHour: 65,
      liftgateRate: 95,
      residentialDeliveryRate: 55,
      effectiveFrom: "2025-01-01",
      effectiveTo: "2025-12-31",
    },
  },
  {
    id: "contract-003",
    customerId: "cust-003",
    terms: {
      fuelSurchargeCapPercent: 22,
      freeDetentionWindowHours: 2,
      detentionRatePerHour: 80,
      liftgateRate: 90,
      residentialDeliveryRate: 65,
      effectiveFrom: "2025-01-01",
      effectiveTo: "2025-12-31",
    },
  },
];

export function getContractByCustomerId(customerId: string) {
  return contracts.find((c) => c.customerId === customerId) ?? null;
}
