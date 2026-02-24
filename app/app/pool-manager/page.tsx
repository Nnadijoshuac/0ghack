"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/app-topbar";
import { contributeToPoolOnChain } from "@/lib/backend/contracts";
import { formatDate, shortAddress, toMoney, toPercent } from "@/lib/backend/format";
import type { MemberRecord, PoolRecord } from "@/lib/backend/types";

type LatestPoolResponse = { pool: PoolRecord | null; error?: string };
type MembersResponse = { pool: PoolRecord; members: MemberRecord[]; error?: string };

export default function PoolManagerPage() {
  const [pool, setPool] = useState<PoolRecord | null>(null);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [poolAddress, setPoolAddress] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [txMessage, setTxMessage] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [pseudonym, setPseudonym] = useState("Builder");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/pools/latest", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: LatestPoolResponse) => {
        if (cancelled) return;
        if (!payload.pool) {
          const saved = localStorage.getItem("poolfi_last_pool_address");
          if (saved) setPoolAddress(saved);
          return;
        }

        setPool(payload.pool);
        setPoolAddress(payload.pool.address);
        localStorage.setItem("poolfi_last_pool_address", payload.pool.address);

        return fetch(`/api/v1/pools/${payload.pool.address}/members`, { cache: "no-store" })
          .then((res) => res.json())
          .then((membersPayload: MembersResponse) => {
            if (cancelled) return;
            if (!membersPayload.error) {
              setMembers(membersPayload.members ?? []);
            }
          });
      })
      .catch(() => {
        const saved = localStorage.getItem("poolfi_last_pool_address");
        if (!cancelled && saved) setPoolAddress(saved);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetch("/api/v1/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: { session?: { pseudonym?: string } }) => {
        if (typeof payload.session?.pseudonym === "string" && payload.session.pseudonym.trim()) {
          setPseudonym(payload.session.pseudonym);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, [now]);

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
    [now]
  );

  const progress = useMemo(() => {
    if (!pool) return 0;
    return toPercent(pool.raised, pool.target);
  }, [pool]);

  const handleContribute = async () => {
    if (!poolAddress) {
      setTxMessage("No pool contract found. Create a pool first.");
      return;
    }

    try {
      setIsContributing(true);
      setTxMessage("");
      const result = await contributeToPoolOnChain(poolAddress);
      setTxMessage(`Contribution successful. Tx: ${result.txHash}`);
    } catch (error) {
      setTxMessage(error instanceof Error ? error.message : "Contribution failed.");
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <section className="poolfi-content pool-manager-content">
      <AppTopbar title={`${greeting}, ${pseudonym}`} subtitle={dateLabel} ctaLabel="Export CSV" ctaHref="#" />
      <section className="manager-hero">
        <p className="manager-chip">Goal Pool - Private - Invite Only</p>
        <h1>{pool?.name ?? "No pool found"}</h1>
        <p className="manager-sub">
          Track real-time on-chain progress, contributions, and contributors for your latest pool.
        </p>
        <div className="manager-kpis">
          <article>
            <span>Raised so far</span>
            <h3>{toMoney(pool?.raised ?? 0)}</h3>
            <p>of {toMoney(pool?.target ?? 0)} target</p>
          </article>
          <article>
            <span>Contributors</span>
            <h3>{pool?.contributorsPaid ?? 0}</h3>
            <p>On-chain contributors</p>
          </article>
          <article>
            <span>Per Person</span>
            <h3>{toMoney(pool?.contributionPerPerson ?? 0)}</h3>
            <p>fixed contribution</p>
          </article>
          <article>
            <span>Status</span>
            <h3>{pool?.status ?? "-"}</h3>
            <p>Closes {pool ? formatDate(pool.deadlineISO) : "-"}</p>
          </article>
        </div>
      </section>

      <section className="manager-grid">
        <div className="manager-main">
          <article className="manager-progress-card">
            <div className="title-row">
              <h2>{toMoney(pool?.raised ?? 0)} raised</h2>
              <span className="mini-pill">{progress}% funded</span>
            </div>
            <div className="active-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-meta">
              <p>{pool?.contributorsPaid ?? 0} students paid</p>
              <p>Target: {toMoney(pool?.target ?? 0)}</p>
            </div>
          </article>

          <article className="contributors-card">
            <div className="contributors-head">
              <h3>Contributors</h3>
              <div className="contributors-stats">
                <span className="paid">{members.length} Paid</span>
                <span className="pending">0 Pending</span>
              </div>
              <div className="filter-pills">
                <button type="button" className="active">
                  All
                </button>
                <button type="button">Paid</button>
                <button type="button">Pending</button>
              </div>
            </div>

            <ul className="contributors-list">
              {members.map((person) => (
                <li key={person.wallet}>
                  <div className="person-main">
                    <span className="person-avatar blue">{person.wallet.slice(2, 4).toUpperCase()}</span>
                    <div>
                      <h4>{shortAddress(person.wallet)}</h4>
                      <p>Joined {formatDate(person.joinedAtISO)}</p>
                    </div>
                  </div>
                  <p className="person-time">on-chain</p>
                  <span className="paid-pill">Paid</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="manager-side">
          <article className="close-box">
            <p>Pool closes</p>
            <h3>{pool ? formatDate(pool.deadlineISO) : "-"}</h3>
          </article>

          {hasJoined ? (
            <>
              <article className="contribute-box">
                <h4>Make Your Contribution</h4>
                <p className="contribute-amount">
                  {toMoney(pool?.contributionPerPerson ?? 0)} <span>fixed amount</span>
                </p>

                <div className="contribute-form">
                  <label>
                    Full Name <span>Required</span>
                    <input placeholder="Enter your full name" />
                  </label>
                  <label>
                    Matric Number <span>Required</span>
                    <input placeholder="e.g. CSC/2022/045" />
                  </label>
                  <p className="balance-chip">
                    Pool Contract <strong>{poolAddress ? shortAddress(poolAddress) : "-"}</strong>
                  </p>
                  <button type="button" className="contribute-btn" onClick={handleContribute} disabled={isContributing}>
                    {isContributing ? "Contributing..." : `Contribute ${toMoney(pool?.contributionPerPerson ?? 0)} ->`}
                  </button>
                  {txMessage ? <p className="secure-note">{txMessage}</p> : null}
                  <p className="secure-note">Secured by smart contract on 0G</p>
                </div>
              </article>

              <article className="share-box">
                <h4>Remind your classmates</h4>
                <button type="button">Share on WhatsApp</button>
                <button type="button">Copy Pool Link</button>
              </article>
            </>
          ) : (
            <>
              <article className="join-box">
                <p className="join-eyebrow">Goal Pool - Private</p>
                <h3>Join this pool</h3>
                <p className="join-sub">You have been invited to contribute</p>
                <div className="join-info">
                  <div>
                    <span>Your contribution</span>
                    <strong>{toMoney(pool?.contributionPerPerson ?? 0)} (fixed)</strong>
                  </div>
                  <div>
                    <span>Admin</span>
                    <strong>{pool ? shortAddress(pool.adminAddress) : "-"}</strong>
                  </div>
                  <div>
                    <span>Deadline</span>
                    <strong>{pool ? formatDate(pool.deadlineISO) : "-"}</strong>
                  </div>
                  <div>
                    <span>Members so far</span>
                    <strong>{members.length} joined</strong>
                  </div>
                </div>
                <button type="button" className="join-later" onClick={() => setHasJoined(true)}>
                  Join Pool (Pay Later)
                </button>
                <button type="button" className="join-pay" onClick={() => setHasJoined(true)}>
                  Join and Pay Now - {toMoney(pool?.contributionPerPerson ?? 0)}
                </button>
              </article>

              <article className="info-box">
                <h4>What happens when you join?</h4>
                <ol>
                  <li>The pool is saved in your My Pools tab.</li>
                  <li>You appear in the member list as Joined (Paid).</li>
                  <li>You can pay anytime before the deadline.</li>
                </ol>
              </article>

              <article className="share-box">
                <h4>Share this pool</h4>
                <button type="button">Share on WhatsApp</button>
                <button type="button">Copy Pool Link</button>
              </article>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
