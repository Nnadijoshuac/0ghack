# 0G Integration Checklist

## Smart Contracts

- [ ] Deploy `PoolFactory` on 0G testnet.
- [ ] Verify `PoolFactory` address in explorer.
- [ ] Set `NEXT_PUBLIC_POOL_FACTORY_ADDRESS`.
- [ ] Test `createPool` transaction.
- [ ] Test contribution and pool close lifecycle.

## Storage and DA

- [ ] Upload pool metadata JSON to 0G Storage.
- [ ] Persist returned content hash in `PoolConfig.metadataHash`.
- [ ] Upload generated CSV reports to 0G Storage.
- [ ] Publish batched daily snapshots to 0G DA (optional hackathon bonus).

## Indexing

- [ ] Index `PoolCreated`, `ContributionMade`, `PoolClosed`, `PoolCancelled`.
- [ ] Build materialized views for dashboard and pool manager pages.

## Frontend wiring

- [ ] Replace `lib/mock-data.ts` reads with API client reads.
- [ ] Use wallet signer for create/contribute/close actions.
- [ ] Keep API as read model for fast UI.
