import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import type { RequestSession } from "@/lib/auth/request-session";

export type AccessPoolType = "GOAL" | "IMPACT";
export type AccessVisibility = "PRIVATE" | "PUBLIC";
export type AccessPoolSource = "ONCHAIN" | "OFFCHAIN";
export type ImpactWithdrawalStatus = "PENDING" | "APPROVED" | "RELEASED" | "REJECTED";

export type ImpactUpdate = {
  id: string;
  title: string;
  details: string;
  referenceLink?: string;
  createdAtISO: string;
};

export type ImpactWithdrawal = {
  id: string;
  amount: number;
  purpose: string;
  vendor: string;
  stage: string;
  approvals: number;
  requiredApprovals: number;
  status: ImpactWithdrawalStatus;
  createdAtISO: string;
};

export type AccessPool = {
  id: string;
  type: AccessPoolType;
  visibility: AccessVisibility;
  source: AccessPoolSource;
  name: string;
  category: string;
  address?: string;
  adminUserId?: string;
  description?: string;
  invited: string[];
  joinedUserIds: string[];
  raised: number;
  target: number;
  contributionPerPerson: number;
  createdAtISO: string;
  updatedAtISO: string;
  impactUpdates?: ImpactUpdate[];
  impactWithdrawals?: ImpactWithdrawal[];
};

type AccessDb = {
  pools: AccessPool[];
  updatedAtISO: string;
  last0gRootHash?: string;
};

const IMPACT_SEED: AccessPool[] = [
  {
    id: "impact-oguta-water",
    type: "IMPACT",
    visibility: "PUBLIC",
    source: "OFFCHAIN",
    name: "Clean Water for Oguta Community, Imo State",
    category: "Water and Sanitation",
    description: "Community-governed impact pool for water access.",
    invited: [],
    joinedUserIds: [],
    raised: 670000,
    target: 1000000,
    contributionPerPerson: 1000,
    createdAtISO: new Date("2026-02-01T00:00:00.000Z").toISOString(),
    updatedAtISO: new Date("2026-02-01T00:00:00.000Z").toISOString(),
    impactUpdates: [],
    impactWithdrawals: [
      {
        id: "REQ-002",
        amount: 150000,
        purpose: "Drilling contractor first milestone",
        vendor: "AquaTech NG Ltd",
        stage: "Phase 1",
        approvals: 3,
        requiredApprovals: 3,
        status: "APPROVED",
        createdAtISO: new Date("2026-02-10T09:00:00.000Z").toISOString()
      },
      {
        id: "REQ-003",
        amount: 300000,
        purpose: "Pump installation and logistics",
        vendor: "AquaTech NG Ltd",
        stage: "Phase 2",
        approvals: 2,
        requiredApprovals: 3,
        status: "PENDING",
        createdAtISO: new Date("2026-02-18T11:15:00.000Z").toISOString()
      }
    ]
  }
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function resolveDataDir() {
  if (process.env.POOL_ACCESS_DB_DIR) return process.env.POOL_ACCESS_DB_DIR;
  if (process.env.VERCEL) return "/tmp/poolfi-data";
  return path.join(process.cwd(), ".data");
}

const dataDir = resolveDataDir();
const dbPath = path.join(dataDir, "pool-access-db.json");
const rootPath = path.join(dataDir, "pool-access-db-root.txt");
const downloadPath = path.join(dataDir, "pool-access-db-download.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function getStorageConfig() {
  const rpcUrl = process.env.NEXT_PUBLIC_OG_STORAGE_RPC_URL || process.env.NEXT_PUBLIC_OG_RPC_URL;
  const indexerUrl = process.env.NEXT_PUBLIC_OG_STORAGE_INDEXER_URL;
  const privateKey = process.env.OG_STORAGE_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
  return { rpcUrl, indexerUrl, privateKey };
}

function emptyDb(): AccessDb {
  return {
    pools: [...IMPACT_SEED],
    updatedAtISO: new Date().toISOString()
  };
}

function hydratePool(pool: AccessPool): AccessPool {
  return {
    ...pool,
    impactUpdates: Array.isArray(pool.impactUpdates) ? pool.impactUpdates : [],
    impactWithdrawals: Array.isArray(pool.impactWithdrawals) ? pool.impactWithdrawals : []
  };
}

async function downloadDbFrom0gIfPossible() {
  const { indexerUrl } = getStorageConfig();
  if (!indexerUrl) return null;
  if (!fs.existsSync(rootPath)) return null;

  const rootHash = fs.readFileSync(rootPath, "utf8").trim();
  if (!rootHash) return null;

  const indexer = new Indexer(indexerUrl);
  const err = await indexer.download(rootHash, downloadPath, false);
  if (err !== null) return null;

  const raw = fs.readFileSync(downloadPath, "utf8");
  return JSON.parse(raw) as AccessDb;
}

async function uploadDbTo0g(db: AccessDb) {
  const { rpcUrl, indexerUrl, privateKey } = getStorageConfig();
  if (!rpcUrl || !indexerUrl || !privateKey) return null;

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const indexer = new Indexer(indexerUrl);

  const file = await ZgFile.fromFilePath(dbPath);
  const [tree, treeErr] = await file.merkleTree();
  if (treeErr !== null || !tree) {
    await file.close();
    return null;
  }

  const rootHash = tree.rootHash();
  if (!rootHash) {
    await file.close();
    return null;
  }

  const [tx, uploadErr] = await indexer.upload(file, rpcUrl, signer as never);
  await file.close();
  if (uploadErr !== null || !tx) return null;

  fs.writeFileSync(rootPath, rootHash);
  return rootHash;
}

export async function loadAccessDb(): Promise<AccessDb> {
  ensureDataDir();

  if (fs.existsSync(dbPath)) {
    const raw = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(raw) as AccessDb;
    if (!Array.isArray(parsed.pools)) {
      const db = emptyDb();
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return db;
    }
    return {
      ...parsed,
      pools: parsed.pools.map(hydratePool)
    };
  }

  const downloaded = await downloadDbFrom0gIfPossible();
  if (downloaded) {
    const hydrated = { ...downloaded, pools: downloaded.pools.map(hydratePool) };
    fs.writeFileSync(dbPath, JSON.stringify(hydrated, null, 2));
    return hydrated;
  }

  const db = emptyDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  return db;
}

async function saveAccessDb(db: AccessDb) {
  ensureDataDir();
  db.updatedAtISO = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  const root = await uploadDbTo0g(db);
  if (root) {
    db.last0gRootHash = root;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }

  return db;
}

function userKeys(session: RequestSession | null) {
  if (!session) return [];
  const keys = [session.sub];
  if (session.email) keys.push(normalize(session.email));
  if (session.pseudonym) keys.push(normalize(session.pseudonym));
  return keys;
}

export function canAccessPool(pool: AccessPool, session: RequestSession | null) {
  if (!session) return false;
  if (pool.visibility === "PUBLIC") return true;

  const keys = userKeys(session);
  if (pool.adminUserId && pool.adminUserId === session.sub) return true;
  if (pool.joinedUserIds.includes(session.sub)) return true;
  return pool.invited.some((entry) => keys.includes(entry));
}

export function isPoolVisibleOnHome(pool: AccessPool, session: RequestSession | null) {
  if (!session) return false;

  if (pool.type === "GOAL") return canAccessPool(pool, session);

  return pool.joinedUserIds.includes(session.sub) || pool.adminUserId === session.sub;
}

export function isPoolVisibleOnMyPools(pool: AccessPool, session: RequestSession | null) {
  if (!session) return false;
  if (pool.adminUserId === session.sub) return true;
  if (pool.joinedUserIds.includes(session.sub)) return true;

  if (pool.type === "GOAL") {
    const keys = userKeys(session);
    return pool.invited.some((entry) => keys.includes(entry));
  }

  return false;
}

export async function registerGoalPool(params: {
  session: RequestSession;
  address: string;
  name: string;
  category: string;
  target: number;
  contributionPerPerson: number;
  invitedMembers: string[];
}) {
  const db = await loadAccessDb();
  const now = new Date().toISOString();
  const id = normalize(params.address);
  const existing = db.pools.find((pool) => normalize(pool.id) === id);
  const invited = params.invitedMembers.map(normalize).filter(Boolean);

  const next: AccessPool = {
    id,
    type: "GOAL",
    visibility: "PRIVATE",
    source: "ONCHAIN",
    name: params.name,
    category: params.category,
    address: params.address,
    adminUserId: params.session.sub,
    invited,
    joinedUserIds: [params.session.sub],
    raised: 0,
    target: Number.isFinite(params.target) ? params.target : 0,
    contributionPerPerson: Number.isFinite(params.contributionPerPerson)
      ? params.contributionPerPerson
      : 0,
    createdAtISO: existing?.createdAtISO ?? now,
    updatedAtISO: now,
    impactUpdates: [],
    impactWithdrawals: []
  };

  if (existing) Object.assign(existing, next);
  else db.pools.push(next);

  await saveAccessDb(db);
  return next;
}

export async function registerImpactPool(params: {
  session: RequestSession;
  name: string;
  category: string;
  description?: string;
  target: number;
  contributionPerPerson: number;
}) {
  const db = await loadAccessDb();
  const now = new Date().toISOString();
  const slug = `${normalize(params.name).replace(/[^a-z0-9]+/g, "-")}`.replace(/^-+|-+$/g, "");
  const id = slug ? `impact-${slug}-${randomUUID().slice(0, 8)}` : `impact-${randomUUID().slice(0, 8)}`;

  const pool: AccessPool = {
    id,
    type: "IMPACT",
    visibility: "PUBLIC",
    source: "OFFCHAIN",
    name: params.name,
    category: params.category || "General",
    description: params.description,
    adminUserId: params.session.sub,
    invited: [],
    joinedUserIds: [params.session.sub],
    raised: 0,
    target: Number.isFinite(params.target) ? params.target : 0,
    contributionPerPerson: Number.isFinite(params.contributionPerPerson)
      ? params.contributionPerPerson
      : 0,
    createdAtISO: now,
    updatedAtISO: now,
    impactUpdates: [],
    impactWithdrawals: []
  };

  db.pools.unshift(pool);
  await saveAccessDb(db);
  return pool;
}

export async function joinImpactPool(poolId: string, session: RequestSession) {
  const db = await loadAccessDb();
  const pool = db.pools.find(
    (item) => normalize(item.id) === normalize(poolId) && item.type === "IMPACT"
  );
  if (!pool) return null;

  if (!pool.joinedUserIds.includes(session.sub)) pool.joinedUserIds.push(session.sub);
  pool.updatedAtISO = new Date().toISOString();
  await saveAccessDb(db);
  return pool;
}

function findCreatorImpactPool(db: AccessDb, poolId: string, session: RequestSession) {
  return db.pools.find(
    (item) =>
      item.type === "IMPACT" &&
      normalize(item.id) === normalize(poolId) &&
      item.adminUserId === session.sub
  );
}

export async function listCreatorImpactPools(session: RequestSession) {
  const db = await loadAccessDb();
  return db.pools
    .filter((pool) => pool.type === "IMPACT" && pool.adminUserId === session.sub)
    .map(hydratePool);
}

export async function addImpactUpdate(params: {
  poolId: string;
  session: RequestSession;
  title: string;
  details: string;
  referenceLink?: string;
}) {
  const db = await loadAccessDb();
  const pool = findCreatorImpactPool(db, params.poolId, params.session);
  if (!pool) return null;

  const next: ImpactUpdate = {
    id: randomUUID(),
    title: params.title.trim(),
    details: params.details.trim(),
    referenceLink: params.referenceLink?.trim() || undefined,
    createdAtISO: new Date().toISOString()
  };

  pool.impactUpdates = [next, ...(pool.impactUpdates ?? [])];
  pool.updatedAtISO = new Date().toISOString();
  await saveAccessDb(db);
  return next;
}

export async function listImpactUpdates(poolId: string, session: RequestSession) {
  const db = await loadAccessDb();
  const pool = findCreatorImpactPool(db, poolId, session);
  if (!pool) return null;
  return [...(pool.impactUpdates ?? [])];
}

export async function addImpactWithdrawal(params: {
  poolId: string;
  session: RequestSession;
  amount: number;
  purpose: string;
  vendor: string;
  stage: string;
}) {
  const db = await loadAccessDb();
  const pool = findCreatorImpactPool(db, params.poolId, params.session);
  if (!pool) return null;

  const count = (pool.impactWithdrawals?.length ?? 0) + 1;
  const next: ImpactWithdrawal = {
    id: `REQ-${String(count).padStart(3, "0")}`,
    amount: Number.isFinite(params.amount) ? params.amount : 0,
    purpose: params.purpose.trim(),
    vendor: params.vendor.trim(),
    stage: params.stage.trim(),
    approvals: 0,
    requiredApprovals: 3,
    status: "PENDING",
    createdAtISO: new Date().toISOString()
  };

  pool.impactWithdrawals = [next, ...(pool.impactWithdrawals ?? [])];
  pool.updatedAtISO = new Date().toISOString();
  await saveAccessDb(db);
  return next;
}

export async function listImpactWithdrawals(poolId: string, session: RequestSession) {
  const db = await loadAccessDb();
  const pool = findCreatorImpactPool(db, poolId, session);
  if (!pool) return null;
  return [...(pool.impactWithdrawals ?? [])];
}
