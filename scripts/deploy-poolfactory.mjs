import fs from "node:fs";
import path from "node:path";
import solc from "solc";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const RPC_URL = process.env.NEXT_PUBLIC_OG_RPC_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_OG_CHAIN_ID || 16602);
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

function fail(message) {
  console.error(`\n[deploy:poolfactory] ${message}`);
  process.exit(1);
}

function readContractSources(rootDir) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readContractSources(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".sol")) {
      files.push(fullPath);
    }
  }

  return files;
}

function compilePoolFactory() {
  const contractsRoot = path.join(process.cwd(), "backend", "contracts", "src");
  const files = readContractSources(contractsRoot);

  const sources = {};
  for (const file of files) {
    const relativeFromSrc = path
      .relative(contractsRoot, file)
      .replace(/\\/g, "/");
    sources[relativeFromSrc] = { content: fs.readFileSync(file, "utf8") };
  }

  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const fatal = output.errors.filter((err) => err.severity === "error");
    for (const err of output.errors) {
      console.log(err.formattedMessage);
    }
    if (fatal.length > 0) {
      fail("Solidity compilation failed");
    }
  }

  const artifact = output.contracts?.["PoolFactory.sol"]?.PoolFactory;
  if (!artifact?.abi || !artifact?.evm?.bytecode?.object) {
    fail("Unable to find PoolFactory artifact");
  }

  return artifact;
}

async function main() {
  if (!RPC_URL) fail("Missing NEXT_PUBLIC_OG_RPC_URL in env");
  if (!PRIVATE_KEY) fail("Missing DEPLOYER_PRIVATE_KEY in .env.local or .env");

  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const artifact = compilePoolFactory();

  console.log("[deploy:poolfactory] deploying with wallet:", wallet.address);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.evm.bytecode.object, wallet);
  const contract = await factory.deploy();
  const txHash = contract.deploymentTransaction()?.hash;

  console.log("[deploy:poolfactory] tx:", txHash || "pending");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("[deploy:poolfactory] deployed at:", address);

  const deploymentsDir = path.join(process.cwd(), "backend", "contracts", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  const outputPath = path.join(deploymentsDir, `${CHAIN_ID}.json`);
  const payload = {
    chainId: CHAIN_ID,
    rpcUrl: RPC_URL,
    poolFactoryAddress: address,
    txHash,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

  console.log("\nSet this in your env:");
  console.log(`NEXT_PUBLIC_POOL_FACTORY_ADDRESS=${address}`);
  console.log(`\nSaved deployment: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
