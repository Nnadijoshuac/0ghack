# PoolFi 0G Backend Blueprint

This folder defines the backend architecture to move from mock frontend data to real 0G-powered infrastructure.

## Modules

- `contracts/`: Solidity contracts for pool creation, contribution, and lifecycle management.
- `api/`: REST contract for frontend consumption.
- `docs/`: integration notes and rollout checklist.

## Phase Plan

1. Deploy `PoolFactory`, `GoalPool`, and `ImpactPool` to 0G testnet.
2. Implement indexer worker that consumes contract events.
3. Expose API endpoints consumed by Next.js app pages.
4. Move metadata and CSV exports to 0G Storage and store content hash pointers on-chain.

## Required Inputs

- 0G RPC URL
- Deployer private key (testnet only)
- Stablecoin token address to use for contributions
- Admin treasury address
- Optional reminder channel credentials (email/SMS/WhatsApp)
