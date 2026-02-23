import { ethers } from "ethers";
import { backendConfig } from "@/lib/backend/config";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const FACTORY_ABI = [
  "function createPool((uint8 poolType,string name,string category,uint256 targetAmount,uint256 contributionPerPerson,uint64 startAt,uint64 deadline,address admin,bytes32 metadataHash) cfg) returns (address pool)",
  "event PoolCreated(address indexed pool,address indexed admin,uint8 indexed poolType,bytes32 metadataHash)"
];

const GOAL_POOL_ABI = [
  "function contribute() payable",
  "function config() view returns ((uint8 poolType,string name,string category,uint256 targetAmount,uint256 contributionPerPerson,uint64 startAt,uint64 deadline,address admin,bytes32 metadataHash))"
];

function getInjectedProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet found. Install MetaMask or another EVM wallet.");
  }
  return window.ethereum;
}

async function getSigner() {
  const injected = getInjectedProvider();
  await injected.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(injected as ethers.Eip1193Provider);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== backendConfig.chain.chainId) {
    throw new Error(
      `Wrong network. Switch wallet to chain ${backendConfig.chain.chainId}.`
    );
  }

  return signer;
}

export type CreatePoolInput = {
  name: string;
  category: string;
  targetAmount: bigint;
  contributionPerPerson: bigint;
  startAt: number;
  deadline: number;
  metadataText: string;
};

export async function createGoalPoolOnChain(input: CreatePoolInput) {
  if (!backendConfig.chain.poolFactoryAddress) {
    throw new Error("Missing NEXT_PUBLIC_POOL_FACTORY_ADDRESS.");
  }

  const signer = await getSigner();
  const admin = await signer.getAddress();
  const factory = new ethers.Contract(
    backendConfig.chain.poolFactoryAddress,
    FACTORY_ABI,
    signer
  );

  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(input.metadataText));
  const cfg = {
    poolType: 0,
    name: input.name,
    category: input.category,
    targetAmount: input.targetAmount,
    contributionPerPerson: input.contributionPerPerson,
    startAt: input.startAt,
    deadline: input.deadline,
    admin,
    metadataHash
  };

  let gasLimit: bigint | undefined;
  try {
    const estimated = (await factory.createPool.estimateGas(cfg)) as bigint;
    gasLimit = (estimated * BigInt(120)) / BigInt(100);
  } catch {
    gasLimit = undefined;
  }

  const tx = await factory.createPool(cfg, gasLimit ? { gasLimit } : {});
  const receipt = await tx.wait();

  const iface = new ethers.Interface(FACTORY_ABI);
  let poolAddress = "";

  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "PoolCreated") {
        poolAddress = String(parsed.args.pool);
        break;
      }
    } catch {
      // ignore non-factory logs
    }
  }

  if (!poolAddress) {
    throw new Error("Pool deployed but address was not found in logs.");
  }

  return { txHash: tx.hash as string, poolAddress };
}

export async function contributeToPoolOnChain(poolAddress: string) {
  const signer = await getSigner();
  const pool = new ethers.Contract(poolAddress, GOAL_POOL_ABI, signer);
  const cfg = await pool.config();
  const amount = BigInt(cfg.contributionPerPerson.toString());

  let gasLimit: bigint | undefined;
  try {
    const estimated = (await pool.contribute.estimateGas({ value: amount })) as bigint;
    gasLimit = (estimated * BigInt(120)) / BigInt(100);
  } catch {
    gasLimit = undefined;
  }

  const tx = await pool.contribute(gasLimit ? { value: amount, gasLimit } : { value: amount });
  const receipt = await tx.wait();

  return { txHash: tx.hash as string, blockNumber: Number(receipt.blockNumber) };
}
