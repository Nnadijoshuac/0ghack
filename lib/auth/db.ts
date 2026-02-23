import fs from "node:fs";
import path from "node:path";
import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import type { AuthDb } from "@/lib/auth/types";

const dataDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "auth-db.json");
const rootPath = path.join(dataDir, "auth-db-root.txt");
const downloadPath = path.join(dataDir, "auth-db-download.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function getStorageConfig() {
  const rpcUrl = process.env.NEXT_PUBLIC_OG_STORAGE_RPC_URL || process.env.NEXT_PUBLIC_OG_RPC_URL;
  const indexerUrl = process.env.NEXT_PUBLIC_OG_STORAGE_INDEXER_URL;
  const privateKey = process.env.OG_STORAGE_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
  return { rpcUrl, indexerUrl, privateKey };
}

function emptyDb(): AuthDb {
  return { users: [], updatedAtISO: new Date().toISOString() };
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
  return JSON.parse(raw) as AuthDb;
}

export async function loadAuthDb() {
  ensureDataDir();

  if (fs.existsSync(dbPath)) {
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw) as AuthDb;
  }

  const downloaded = await downloadDbFrom0gIfPossible();
  if (downloaded) {
    fs.writeFileSync(dbPath, JSON.stringify(downloaded, null, 2));
    return downloaded;
  }

  const db = emptyDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  return db;
}

async function uploadDbTo0g(db: AuthDb) {
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

export async function saveAuthDb(db: AuthDb) {
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
