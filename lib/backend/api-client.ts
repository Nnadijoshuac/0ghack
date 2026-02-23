import type { MemberRecord, PoolRecord } from "./types";

export type DashboardResponse = {
  viewer: { name: string; handle: string; initials: string };
  balance: { total: number; available: number; locked: number };
  pools: PoolRecord[];
  recentActivity: Array<{
    icon: string;
    title: string;
    time: string;
    amount: string;
    positive: boolean | null;
  }>;
};

export async function fetchHealth() {
  const res = await fetch("/api/v1/health", { cache: "no-store" });
  return res.json() as Promise<{ ok: boolean; service: string; version: string }>;
}

export async function fetchDashboard() {
  const res = await fetch("/api/v1/dashboard", { cache: "no-store" });
  return res.json() as Promise<DashboardResponse>;
}

export async function fetchPools() {
  const res = await fetch("/api/v1/pools", { cache: "no-store" });
  const data = (await res.json()) as { pools: PoolRecord[] };
  return data.pools;
}

export async function fetchPoolMembers(poolId: string) {
  const res = await fetch(`/api/v1/pools/${poolId}/members`, { cache: "no-store" });
  return res.json() as Promise<{ pool: PoolRecord; members: MemberRecord[] }>;
}
