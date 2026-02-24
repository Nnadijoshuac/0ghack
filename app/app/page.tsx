"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/app-topbar";
import { toMoney, toPercent } from "@/lib/backend/format";
import type { PoolRecord } from "@/lib/backend/types";

type DashboardResponse = {
  viewer: { name: string; handle: string; initials: string };
  balance: { total: number; available: number; locked: number };
  pools: PoolRecord[];
  latestPool: PoolRecord | null;
  recentActivity: Array<{
    icon: string;
    title: string;
    time: string;
    amount: string;
    positive: boolean | null;
  }>;
};

const spotlightPools = Array.from({ length: 4 }, (_, idx) => ({
  id: idx + 1,
  title: "Clean Water Borehole for Oguta Community, Imo State",
  description:
    "Help build a functioning borehole for 3,000+ residents who currently walk 2km daily for water.",
  raised: "₦670,000",
  target: "₦1,000,000",
  progress: 67
}));

export default function AppPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: DashboardResponse & { error?: string }) => {
        if (cancelled) return;
        if (payload.error) {
          setError(payload.error);
          return;
        }
        setData(payload);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load dashboard");
      });

    return () => {
      cancelled = true;
    };
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

  const activePools = useMemo(() => {
    if (!data?.pools) return [];

    return data.pools
      .slice()
      .reverse()
      .map((pool) => ({
        icon: pool.type === "GOAL" ? "/images/dashboard/my-pools.png" : "/images/dashboard/impact.png",
        name: pool.name,
        meta:
          pool.type === "GOAL"
            ? `Private goal pool - ${pool.contributorsPaid} contributors`
            : "Joined impact pool",
        raised: toMoney(pool.raised),
        target: toMoney(pool.target),
        progress: toPercent(pool.raised, pool.target),
        footLeft:
          pool.contributorsTotal > pool.contributorsPaid
            ? `${pool.contributorsTotal - pool.contributorsPaid} yet to pay`
            : `${pool.contributorsPaid} contributors paid`,
        footRight: `Pool: ${pool.address.slice(0, 10)}...`,
        action: pool.type === "GOAL" ? "Manage ->" : "View Pool ->",
        href: pool.type === "GOAL" ? "/app/pool-manager" : "/app/impact",
        actionColor: "blue"
      }));
  }, [data]);

  return (
    <section className="poolfi-content">
      <AppTopbar title={`${greeting}, ${data?.viewer.handle ?? "Builder"}`} subtitle={dateLabel} />

      <section className="balance-card">
        <div className="balance-head">
          <div>
            <p>Your PoolFi Balance</p>
            <h2>{toMoney(data?.balance.total ?? 0)}.00</h2>
            <span>Total Balance</span>
          </div>
          <div className="balance-actions">
            <button type="button">+ Add Funds</button>
            <button type="button" className="ghost">
              ↑ Withdraw
            </button>
          </div>
        </div>
        <div className="balance-metrics">
          <article>
            <p>Available</p>
            <h3>{toMoney(data?.balance.available ?? 0)}.00</h3>
            <span>Free to use</span>
          </article>
          <article>
            <p>Locked</p>
            <h3>{toMoney(data?.balance.locked ?? 0)}.00</h3>
            <span>In {(data?.pools ?? []).length} active pools</span>
          </article>
          <article>
            <p>Pools</p>
            <h3>{(data?.pools ?? []).length} Active</h3>
            <span>{Math.max((data?.pools ?? []).length - 1, 0)} completed</span>
          </article>
        </div>
      </section>

      {error ? <p className="cp-note">{error}</p> : null}

      <section className="active-pools">
        {activePools.length === 0 ? (
          <article className="empty-state">
            <Image
              src="/images/dashboard/no-active-pools.png"
              alt="No pools created"
              width={138}
              height={138}
            />
            <h2>No Active Pools</h2>
            <p>No pools on-chain yet. Create one to get started.</p>
          </article>
        ) : (
          activePools.map((pool) => (
            <article className="active-pool-card" key={pool.name + pool.footRight}>
              <div className="active-pool-head">
                <div className="pool-head-left">
                  <span className="pool-head-icon">
                    <Image src={pool.icon} alt="" width={18} height={18} />
                  </span>
                  <div>
                    <h3>{pool.name}</h3>
                    <p>{pool.meta}</p>
                  </div>
                </div>
                <span className="status-pill">Active</span>
              </div>

              <p className="raised-line">
                <strong>{pool.raised}</strong> raised
                <span>Target: {pool.target}</span>
              </p>
              <div className="active-progress">
                <div style={{ width: `${pool.progress}%` }} />
              </div>

              <div className="active-foot">
                <p>{pool.footLeft}</p>
                <p>{pool.footRight}</p>
                <Link href={pool.href} className={`pool-action ${pool.actionColor}`}>
                  {pool.action}
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="spotlight">
        <div className="section-row">
          <h3>Impact Spotlight</h3>
          <Link href="/app/impact">Explore -&gt;</Link>
        </div>
        <div className="spotlight-row">
          {spotlightPools.map((pool) => (
            <article key={pool.id} className="spot-card">
              <p className="featured-tag">
                <span>FEATURED</span>
                <span>POOL</span>
              </p>
              <h4>{pool.title}</h4>
              <p className="spot-desc">{pool.description}</p>
              <div className="spot-progress">
                <div style={{ width: `${pool.progress}%` }} />
              </div>
              <p className="spot-meta">
                <strong>{pool.raised}</strong> raised
                <span>
                  {pool.progress}% of {pool.target}
                </span>
              </p>
              <button type="button">Contribute to this Pool -&gt;</button>
            </article>
          ))}
        </div>
      </section>

      <section className="recent-card">
        <div className="section-row">
          <h3>Recent Activity</h3>
          <Link href="#">All -&gt;</Link>
        </div>
        <ul>
          {(data?.recentActivity ?? []).map((item) => (
            <li key={item.title + item.time}>
              <div className="activity-main">
                <span className="activity-icon">{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.time}</p>
                </div>
              </div>
              <span
                className={`activity-amount${
                  item.positive === true
                    ? " positive"
                    : item.positive === false
                      ? " negative"
                      : ""
                }`}
              >
                {item.amount}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
