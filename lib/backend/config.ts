export type ChainConfig = {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  poolFactoryAddress?: string;
};

export type StorageConfig = {
  rpcUrl: string;
  indexerUrl: string;
};

export type BackendConfig = {
  chain: ChainConfig;
  storage: StorageConfig;
};

export const backendConfig: BackendConfig = {
  chain: {
    name: "0G Galileo Testnet",
    chainId: Number(process.env.NEXT_PUBLIC_OG_CHAIN_ID ?? 16602),
    rpcUrl: process.env.NEXT_PUBLIC_OG_RPC_URL ?? "",
    explorerUrl: process.env.NEXT_PUBLIC_OG_EXPLORER_URL ?? "",
    poolFactoryAddress: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS
  },
  storage: {
    rpcUrl: process.env.NEXT_PUBLIC_OG_STORAGE_RPC_URL ?? "",
    indexerUrl: process.env.NEXT_PUBLIC_OG_STORAGE_INDEXER_URL ?? ""
  }
};
