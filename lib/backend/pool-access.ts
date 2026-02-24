import fs from "node:fs";
import path from "node:path";
import type { RequestSession } from "@/lib/auth/request-session";

export type AccessPoolType = "GOAL" | "IMPACT";
export type AccessVisibility = "PRIVATE" | "PUBLIC";
export type AccessPoolSource = "ONCHAIN" | "OFFCHAIN";

export type AccessPool = {
  id: string;
  type: AccessPoolType;
  visibility: AccessVisibility;
  source: AccessPoolSource;
  name: string;
  category: string;
  address?: string;
  adminUserId?: string;
  invited: string[];
  joinedUserIds: string[];
  raised: number;
  target: number;
  contributionPerPerson: number;
  createdAtISO: string;
  updatedAtISO: string;
};

type AccessDb = {
  pools: AccessPool[];
  updatedAtISO: string;
};

const IMPACT_SEED: AccessPool[] = [
  {
    id: "impact-oguta-water",
    type: "IMPACT",
    visibility: "PUBLIC",
    source: "OFFCHAIN",
    name: "Clean Water for Oguta Community, Imo State",
    category: "Water and Sanitation",
    invited: [],
    joinedUserIds: [],
    raised: 670000,
    target: 1000000,
    contributionPerPerson: 1000,
    createdAtISO: new Date("2026-02-01T00:00:00.000Z").toISOString(),
    updatedAtISO: new Date("2026-02-01T00:00:00.000Z").toISOString()
  },
  {
    id: "impact-uniben-scholarship",
    type: "IMPACT",
    visibility: "PUBLIC",
    source: "OFFCHAIN",
    name: "Scholarship Fund for Indigent UNIBEN Students",
    category: "Education",
    invited: [],
    joinedUserIds: [],
    raised: 270000,
    target: 500000,
    contributionPerPerson: 5000,
    createdAtISO: new Date("2026-02-04T00:00:00.000Z").toISOString(),
    updatedAtISO: new Date("2026-02-04T00:00:00.000Z").toISOString()
  },
  {
    id: "impact-rural-clinic",
    type: "IMPACT",
    visibility: "PUBLIC",
    source: "OFFCHAIN",
    name: "Rural Clinic Solar Power Initiative",
    category: "Health",
    invited: [],
    joinedUserIds: [],
    raised: 180000,
    target: 700000,
    contributionPerPerson: 2500,
    createdAtISO: new Date("2026-02-06T00:00:00.000Z").toISOString(),
    updatedAtISO: new Date("2026-02-06T00:00:00.000Z").toISOString()
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

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function emptyDb(): AccessDb {
  return {
    pools: [...IMPACT_SEED],
    updatedAtISO: new Date().toISOString()
  };
}

export function loadAccessDb(): AccessDb {
  ensureDataDir();
  if (!fs.existsSync(dbPath)) {
    const db = emptyDb();
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return db;
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  const parsed = JSON.parse(raw) as AccessDb;
  if (!Array.isArray(parsed.pools)) {
    const db = emptyDb();
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return db;
  }
  return parsed;
}

function saveAccessDb(db: AccessDb) {
  ensureDataDir();
  db.updatedAtISO = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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

  if (pool.type === "GOAL") {
    return canAccessPool(pool, session);
  }

  // Impact pools are public but only appear on home after the user joins.
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

export function registerGoalPool(params: {
  session: RequestSession;
  address: string;
  name: string;
  category: string;
  target: number;
  contributionPerPerson: number;
  invitedMembers: string[];
}) {
  const db = loadAccessDb();
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
    updatedAtISO: now
  };

  if (existing) {
    Object.assign(existing, next);
  } else {
    db.pools.push(next);
  }

  saveAccessDb(db);
  return next;
}

export function joinImpactPool(poolId: string, session: RequestSession) {
  const db = loadAccessDb();
  const pool = db.pools.find(
    (item) => normalize(item.id) === normalize(poolId) && item.type === "IMPACT"
  );
  if (!pool) return null;

  if (!pool.joinedUserIds.includes(session.sub)) {
    pool.joinedUserIds.push(session.sub);
  }
  pool.updatedAtISO = new Date().toISOString();
  saveAccessDb(db);
  return pool;
}

