"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatDate, shortAddress, toMoney, toPercent } from "@/lib/backend/format";
import type { MemberRecord, PoolRecord } from "@/lib/backend/types";

type LatestPoolResponse = {
  pool: PoolRecord | null;
  error?: string;
};

type MembersResponse = {
  pool: PoolRecord;
  members: MemberRecord[];
  error?: string;
};

export default function MyPoolsPage() {
  const [pool, setPool] = useState<PoolRecord | null>(null);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [error, setError] = useState("");
  const [pseudonym, setPseudonym] = useState("Builder");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/pools/latest", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: LatestPoolResponse) => {
        if (cancelled) return;
        if (payload.error) {
          setError(payload.error);
          return;
        }
        setPool(payload.pool);

        if (!payload.pool) return;
        return fetch(`/api/v1/pools/${payload.pool.address}/members`, { cache: "no-store" })
          .then((res) => res.json())
          .then((membersPayload: MembersResponse) => {
            if (cancelled) return;
            if (membersPayload.error) {
              setError(membersPayload.error);
              return;
            }
            setMembers(membersPayload.members ?? []);
          });
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load latest pool");
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

  const progress = useMemo(() => {
    if (!pool) return 0;
    return toPercent(pool.raised, pool.target);
  }, [pool]);

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

  if (!pool) {
    return (
      <section className="poolfi-content mypools-content">
        <header className="poolfi-topbar">
          <div>
            <h1>
              {greeting}, {pseudonym}
            </h1>
            <p>{dateLabel}</p>
          </div>
        </header>
        <article className="active-pool-card">
          <p>{error || "No on-chain pool found yet. Create one first."}</p>
        </article>
      </section>
    );
  }

  return (
    <section className="poolfi-content mypools-content">
      <header className="poolfi-topbar">
        <div>
          <h1>
            {greeting}, {pseudonym}
          </h1>
          <p>{dateLabel}</p>
        </div>
        <div className="topbar-actions">
          <button type="button" className="icon-button">
            <Image
              src="/images/dashboard/notifications.png"
              alt="Notifications"
              width={18}
              height={18}
            />
          </button>
          <button type="button" className="icon-button">
            <Image
              src="/images/dashboard/settings.png"
              alt="Settings"
              width={18}
              height={18}
            />
          </button>
          <button type="button" className="create-pool-btn">
            Export CSV
          </button>
        </div>
      </header>

      <section className="mypools-hero">
        <p className="manager-chip">Goal Pool - Admin View</p>
        <h1>{pool.name}</h1>
        <p className="mypools-hero-sub">
          Closes {formatDate(pool.deadlineISO)} - {toMoney(pool.contributionPerPerson)} per person - {pool.category}
        </p>
        <div className="mypools-kpis">
          <article>
            <span>Total Raised</span>
            <h3>{toMoney(pool.raised)}</h3>
            <p>of {toMoney(pool.target)} target</p>
          </article>
          <article>
            <span>Contributors</span>
            <h3>{pool.contributorsPaid}</h3>
            <p>Paid</p>
          </article>
          <article>
            <span>Pending</span>
            <h3>{Math.max(pool.contributorsTotal - pool.contributorsPaid, 0)}</h3>
            <p>Unknown total target</p>
          </article>
          <article>
            <span>Status</span>
            <h3>{pool.status}</h3>
            <p>{formatDate(pool.deadlineISO)}</p>
          </article>
        </div>
      </section>

      <section className="mypools-grid">
        <div className="mypools-main">
          <article className="manager-progress-card">
            <div className="title-row">
              <h2>{toMoney(pool.raised)} raised</h2>
              <span className="mini-pill">{progress}% funded</span>
            </div>
            <div className="active-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-meta">
              <p>{pool.contributorsPaid} contributors paid</p>
              <p>Target: {toMoney(pool.target)}</p>
            </div>
          </article>

          <article className="mypools-members">
            <div className="members-head">
              <h3>Members</h3>
              <span>({members.length} from chain events)</span>
              <button type="button">Remind All Unpaid</button>
            </div>
            <input className="members-search" placeholder="Search wallet..." />
            <div className="members-tabs">
              <button type="button" className="active">
                All ({members.length})
              </button>
              <button type="button">Paid ({members.length})</button>
              <button type="button">Pending (0)</button>
            </div>
            <ul>
              {members.map((member) => (
                <li key={member.wallet}>
                  <div className="person-main">
                    <span className="person-avatar blue">{member.wallet.slice(2, 4).toUpperCase()}</span>
                    <div>
                      <h4>{shortAddress(member.wallet)}</h4>
                      <p>{formatDate(member.joinedAtISO)} - on-chain participant</p>
                    </div>
                  </div>
                  <span className="paid-pill">Paid</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="mypools-side">
          <article className="side-card">
            <h4>Quick Actions</h4>
            <div className="quick-grid">
              <button type="button">Export CSV</button>
              <button type="button">Send Reminders</button>
              <button type="button">Extend Deadline</button>
              <button type="button">Share Link</button>
            </div>
          </article>

          <article className="side-card">
            <h4>Pool Rules</h4>
            <div className="rule-list">
              <p>
                <span>Amount Per Person</span>
                <strong>{toMoney(pool.contributionPerPerson)} (fixed)</strong>
              </p>
              <p>
                <span>Deadline</span>
                <strong>{formatDate(pool.deadlineISO)}</strong>
              </p>
              <p>
                <span>Admin</span>
                <strong>{shortAddress(pool.adminAddress)}</strong>
              </p>
              <p>
                <span>Pool Address</span>
                <strong>{shortAddress(pool.address)}</strong>
              </p>
            </div>
          </article>

          <article className="side-card danger">
            <h4>Pool Controls</h4>
            <button type="button">Close Pool & Withdraw</button>
            <button type="button">Cancel Pool & Refund All</button>
          </article>
        </aside>
      </section>
    </section>
  );
}
