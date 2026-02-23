# PoolFi (0G Testnet) - Hackathon Submission

PoolFi is a web app for creating and managing contribution pools.

It supports two pool models in product design:
- Goal Pool: private, invite-only
- Impact Pool: public to all PoolFi users

This submission implements the full frontend prototype with 0G testnet integration points, plus on-chain Goal Pool creation.

## What Is Implemented

- Next.js 16 App Router frontend
- Auth flow (walletless): signup/login with server session cookies
- Auth data persistence with optional 0G Storage sync
- Shared app shell (sidebar + top header)
- Dashboard, My Pools, Impact, Pool Manager pages
- Canonical Create Pool flow (modal -> wizard)
- Goal Pool launch on-chain through PoolFactory

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- ethers v6
- @0glabs/0g-ts-sdk
- CSS (global styles)

## 0G Network Configuration

Set these in `.env.local` (template in `.env.example`):

- `NEXT_PUBLIC_OG_CHAIN_ID`
- `NEXT_PUBLIC_OG_RPC_URL`
- `NEXT_PUBLIC_OG_EXPLORER_URL`
- `NEXT_PUBLIC_POOL_FACTORY_ADDRESS`
- `NEXT_PUBLIC_OG_STORAGE_RPC_URL`
- `NEXT_PUBLIC_OG_STORAGE_INDEXER_URL`
- `DEPLOYER_PRIVATE_KEY` (server-only)
- `OG_STORAGE_PRIVATE_KEY` (server-only)
- `AUTH_DB_DIR`

## Quick Start

1. Install dependencies
```bash
npm install
```

2. Configure env
```bash
cp .env.example .env.local
```

3. Run dev server
```bash
npm run dev
```

4. Open
`http://localhost:3000`

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - lint checks
- `npm run build` - production build check
- `npm run start` - run production app
- `npm run deploy:poolfactory` - deploy factory contract
- `npm run verify:factory` - verify deployment configuration

## Main Routes

- `/login`
- `/signup`
- `/signup/transaction-pin`
- `/app`
- `/app/create-pool`
- `/app/impact`
- `/app/my-pools`
- `/app/pool-manager`

## Backend/API (App Router handlers)

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard`
- `GET /api/v1/impact`
- `GET /api/v1/pools`
- `GET /api/v1/pools/latest`
- `GET /api/v1/pools/:poolId/members`
- `GET /api/v1/health`

## Smart Contracts

Contracts live in:
- `backend/contracts/src/PoolFactory.sol`
- `backend/contracts/src/GoalPool.sol`
- `backend/contracts/src/interfaces/IPoolFiTypes.sol`

Frontend on-chain calls:
- `lib/backend/contracts.ts`

## Deployment Notes

- Vercel/serverless environments are ephemeral.  
  Use `AUTH_DB_DIR=/tmp/poolfi-data` for local file fallback.
- If 0G Storage env vars + private key are present, auth DB is uploaded and synced via 0G Storage.

## Current Scope / Known Gaps

- Goal Pool flow is the active on-chain launch path.
- Impact Pool is represented in UI and product direction, but its dedicated launch backend flow is next.
- Some pages use scaffolded/demo state for presentation while chain-backed flows are being finalized.

## Submission Summary

This submission demonstrates:
- a complete UX flow from auth to pool creation,
- a 0G testnet-aware architecture,
- smart contract pool creation from the frontend,
- and a clear path to complete public Impact Pool backend logic.
