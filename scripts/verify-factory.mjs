import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const RPC_URL = process.env.NEXT_PUBLIC_OG_RPC_URL;
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS;

function fail(message) {
  console.error(`\n[verify:factory] ${message}`);
  process.exit(1);
}

async function main() {
  if (!RPC_URL) fail("Missing NEXT_PUBLIC_OG_RPC_URL");
  if (!FACTORY_ADDRESS) fail("Missing NEXT_PUBLIC_POOL_FACTORY_ADDRESS");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const code = await provider.getCode(FACTORY_ADDRESS);

  if (!code || code === "0x") {
    fail(`No contract bytecode found at ${FACTORY_ADDRESS}`);
  }

  console.log("[verify:factory] Contract detected at", FACTORY_ADDRESS);
  console.log("[verify:factory] Bytecode length:", code.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
