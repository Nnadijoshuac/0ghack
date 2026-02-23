import { ethers } from "ethers";
import { backendConfig } from "@/lib/backend/config";
import type { MemberRecord, PoolRecord } from "@/lib/backend/types";

const FACTORY_ABI = ["function allPools() view returns (address[])"];

const GOAL_POOL_ABI = [
  "function config() view returns ((uint8 poolType,string name,string category,uint256 targetAmount,uint256 contributionPerPerson,uint64 startAt,uint64 deadline,address admin,bytes32 metadataHash))",
  "function status() view returns (uint8)",
  "function totalRaised() view returns (uint256)",
  "function contributorsPaid() view returns (uint256)",
  "event PoolJoined(address indexed account, uint256 timestamp)",
  "event ContributionMade(address indexed account, uint256 amount, uint256 totalRaised)"
];

function getProvider() {
  if (!backendConfig.chain.rpcUrl) {
    throw new Error("Missing NEXT_PUBLIC_OG_RPC_URL");
  }
  return new ethers.JsonRpcProvider(backendConfig.chain.rpcUrl, backendConfig.chain.chainId);
}

function normalizeStatus(value: number): PoolRecord["status"] {
  if (value === 1) return "CLOSED";
  if (value === 2) return "CANCELLED";
  return "ACTIVE";
}

export async function fetchAllPoolAddresses() {
  if (!backendConfig.chain.poolFactoryAddress) return [];

  const provider = getProvider();
  const factory = new ethers.Contract(backendConfig.chain.poolFactoryAddress, FACTORY_ABI, provider);
  const addresses = (await factory.allPools()) as string[];
  return addresses;
}

export async function fetchPoolRecord(poolAddress: string): Promise<PoolRecord> {
  const provider = getProvider();
  const pool = new ethers.Contract(poolAddress, GOAL_POOL_ABI, provider);

  const [cfg, statusRaw, totalRaisedRaw, contributorsPaidRaw] = await Promise.all([
    pool.config(),
    pool.status(),
    pool.totalRaised(),
    pool.contributorsPaid()
  ]);

  const target = Number(cfg.targetAmount.toString());
  const raised = Number(totalRaisedRaw.toString());
  const contributorsPaid = Number(contributorsPaidRaw.toString());

  return {
    id: poolAddress.toLowerCase(),
    address: poolAddress,
    type: Number(cfg.poolType) === 1 ? "IMPACT" : "GOAL",
    name: cfg.name,
    category: cfg.category,
    target,
    raised,
    contributionPerPerson: Number(cfg.contributionPerPerson.toString()),
    contributorsPaid,
    contributorsTotal: contributorsPaid,
    startAtISO: new Date(Number(cfg.startAt) * 1000).toISOString(),
    deadlineISO: new Date(Number(cfg.deadline) * 1000).toISOString(),
    status: normalizeStatus(Number(statusRaw)),
    adminAddress: cfg.admin,
    metadataHash: cfg.metadataHash
  };
}

export async function fetchPools(): Promise<PoolRecord[]> {
  const addresses = await fetchAllPoolAddresses();
  if (addresses.length === 0) return [];

  const records = await Promise.all(addresses.map((address) => fetchPoolRecord(address)));
  return records;
}

export async function fetchLatestPool(): Promise<PoolRecord | null> {
  const addresses = await fetchAllPoolAddresses();
  if (addresses.length === 0) return null;

  const latestAddress = addresses[addresses.length - 1];
  return fetchPoolRecord(latestAddress);
}

export async function fetchPoolMembers(poolAddress: string): Promise<MemberRecord[]> {
  const provider = getProvider();
  const pool = new ethers.Contract(poolAddress, GOAL_POOL_ABI, provider);

  const joinedTopic = ethers.id("PoolJoined(address,uint256)");
  const logs = await provider.getLogs({
    address: poolAddress,
    fromBlock: 0,
    toBlock: "latest",
    topics: [joinedTopic]
  });

  const seen = new Map<string, MemberRecord>();

  for (const log of logs) {
    const parsed = pool.interface.parseLog(log);
    const account = String(parsed?.args?.account ?? "").toLowerCase();
    if (!account) continue;

    const block = await provider.getBlock(log.blockNumber);
    seen.set(account, {
      wallet: account,
      paid: true,
      contributed: 0,
      joinedAtISO: new Date((block?.timestamp ?? 0) * 1000).toISOString()
    });
  }

  return Array.from(seen.values());
}
