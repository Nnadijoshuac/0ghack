"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/app-topbar";
import { formatDate, toMoney, toPercent } from "@/lib/backend/format";
import type { PoolRecord } from "@/lib/backend/types";

type PoolsResponse = {
  pools: PoolRecord[];
  error?: string;
};

export default function MyPoolsPage() {
  const [pools, setPools] = useState<PoolRecord[]>([]);
  const [error, setError] = useState("");
  const [pseudonym, setPseudonym] = useState("Builder");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/pools", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: PoolsResponse) => {
        if (cancelled) return;
        if (payload.error) {
          setError(payload.error);
          return;
        }
        setPools(payload.pools ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load your pools");
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

  return (
    <section className="poolfi-content mypools-content">
      <AppTopbar title={`${greeting}, ${pseudonym}`} subtitle={dateLabel} />

      {error ? <p className="cp-note">{error}</p> : null}

      <section className="active-pools">
        {pools.length === 0 ? (
          <article className="empty-state">
            <Image
              src="/images/dashboard/no-active-pools.png"
              alt="No pools available"
              width={138}
              height={138}
            />
            <h2>No Pools Yet</h2>
            <p>Create a goal pool or join a public impact pool to see pools here.</p>
          </article>
        ) : (
          pools.map((pool) => (
            <article className="active-pool-card" key={pool.id}>
              <div className="active-pool-head">
                <div className="pool-head-left">
                  <span className="pool-head-icon">
                    {pool.type === "GOAL" ? "G" : "I"}
                  </span>
                  <div>
                    <h3>{pool.name}</h3>
                    <p>
                      {pool.type === "GOAL" ? "Goal Pool (Private)" : "Impact Pool (Public)"} -{" "}
                      {pool.category}
                    </p>
                  </div>
                </div>
                <span className="status-pill">{pool.status}</span>
              </div>

              <p className="raised-line">
                <strong>{toMoney(pool.raised)}</strong> raised
                <span>Target: {toMoney(pool.target)}</span>
              </p>
              <div className="active-progress">
                <div style={{ width: `${toPercent(pool.raised, pool.target)}%` }} />
              </div>

              <div className="active-foot">
                <p>
                  {pool.contributorsPaid} paid
                </p>
                <p>Deadline: {formatDate(pool.deadlineISO)}</p>
                <Link
                  href={pool.type === "GOAL" ? "/app/pool-manager" : "/app/impact"}
                  className="pool-action blue"
                >
                  {pool.type === "GOAL" ? "Manage ->" : "View ->"}
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </section>
  );
}
