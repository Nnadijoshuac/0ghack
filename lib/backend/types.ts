export type PoolStatus = "ACTIVE" | "CLOSED" | "CANCELLED";

export type PoolType = "GOAL" | "IMPACT";

export type PoolRecord = {
  id: string;
  type: PoolType;
  name: string;
  category: string;
  target: number;
  raised: number;
  contributionPerPerson: number;
  contributorsPaid: number;
  contributorsTotal: number;
  deadlineISO: string;
  status: PoolStatus;
  adminAddress: string;
  metadataHash?: string;
};

export type MemberRecord = {
  wallet: string;
  name?: string;
  matric?: string;
  paid: boolean;
  contributed: number;
  joinedAtISO: string;
};

export type ContributionRecord = {
  txHash: string;
  poolId: string;
  contributor: string;
  amount: number;
  blockNumber: number;
  createdAtISO: string;
};
