# PoolFi Frontend Prototype

PoolFi is a frontend prototype for collaborative goal pools and impact pools, designed for a 0G-powered product experience.

This project currently focuses on:
- Auth flow: sign in, sign up, transaction PIN setup
- App shell: reusable sidebar + shared layout
- Dashboard, Impact, My Pools, Pool Manager pages
- Canonical Create Pool flow (single implementation)
- Shared mock data layer for consistent UI state across pages

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS (global stylesheet)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open:
`http://localhost:3000`

## Scripts

- `npm run dev` - start local development server
- `npm run lint` - run ESLint checks
- `npm run build` - production build validation
- `npm run start` - run production server

## Main Routes

- `/login`
- `/signup`
- `/signup/transaction-pin`
- `/app`
- `/app/create-pool`
- `/app/impact`
- `/app/my-pools`
- `/app/pool-manager`

## Data Model (Mock)

Centralized in `lib/mock-data.ts`:
- `viewer`
- `dashboardBalance`
- `pools`
- `poolMembers`
- `impactFeatured`
- `impactCards`
- `recentActivity`
- `uiMeta`

## 0G Backend Scaffold (Included)

The repo now includes a backend foundation for 0G integration:

- `backend/contracts/src/PoolFactory.sol`
- `backend/contracts/src/GoalPool.sol`
- `backend/contracts/src/interfaces/IPoolFiTypes.sol`
- `backend/api/openapi.yaml`
- `backend/docs/INTEGRATION.md`
- `lib/backend/config.ts`
- `lib/backend/types.ts`
- `lib/backend/api-client.ts`
- `app/api/v1/*` (mock-backed API routes)

Use `.env.example` to configure 0G network values.

## Notes

- This is a frontend prototype only.
- Backend, wallet integrations, and on-chain flows are intentionally mocked for hackathon presentation.
