"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/app-topbar";
import { toMoney } from "@/lib/backend/format";

const categories = [
  "All",
  "Water and Sanitation",
  "Education",
  "Health",
  "Agriculture",
  "Infrastructure",
  "Welfare",
  "Energy"
];

type ImpactCard = {
  id: string;
  title: string;
  desc: string;
  raised: number;
  target: number;
  contributors: number;
  progress: number;
  joined: boolean;
  category: string;
};

type ImpactResponse = {
  stats: {
    totalRaisedLabel: string;
    contributorsLabel: string;
    activePools: string;
    completedLabel: string;
  };
  featured: ImpactCard | null;
  cards: ImpactCard[];
  error?: string;
};

export default function ImpactPage() {
  const [data, setData] = useState<ImpactResponse | null>(null);
  const [error, setError] = useState("");
  const [joiningPoolId, setJoiningPoolId] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [pseudonym, setPseudonym] = useState("Builder");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/impact", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: ImpactResponse) => {
        if (cancelled) return;
        setData(payload);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load impact pools");
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

  const cards = useMemo(() => data?.cards ?? [], [data]);
  const featured = data?.featured ?? null;

  const joinPool = async (poolId: string) => {
    try {
      setJoiningPoolId(poolId);
      const res = await fetch("/api/v1/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poolId })
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error || "Failed to join pool");
        return;
      }

      setData((prev) => {
        if (!prev) return prev;
        const nextCards = prev.cards.map((card) =>
          card.id === poolId ? { ...card, joined: true, contributors: card.contributors + 1 } : card
        );
        return {
          ...prev,
          cards: nextCards,
          featured:
            prev.featured && prev.featured.id === poolId
              ? { ...prev.featured, joined: true, contributors: prev.featured.contributors + 1 }
              : prev.featured
        };
      });
    } finally {
      setJoiningPoolId("");
    }
  };

  return (
    <section className="poolfi-content impact-content">
      <AppTopbar title={`${greeting}, ${pseudonym}`} subtitle={dateLabel} />
      <section className="impact-hero">
        <p className="impact-chip">Impact Pools</p>
        <h1>
          Fund causes that matter.
          <br />
          With accountability built in.
        </h1>
        <p className="impact-sub">
          Public pools created by PoolFi users. Join any impact pool and it will
          appear on your homepage and My Pools.
        </p>
        <div className="impact-stats">
          <article>
            <h3>{data?.stats.totalRaisedLabel ?? "₦0"}</h3>
            <p>Total Raised</p>
          </article>
          <article>
            <h3>{data?.stats.contributorsLabel ?? "0"}</h3>
            <p>Contributors</p>
          </article>
          <article>
            <h3>{data?.stats.activePools ?? "0"}</h3>
            <p>Active Pools</p>
          </article>
          <article>
            <h3>{data?.stats.completedLabel ?? "0"}</h3>
            <p>Completed</p>
          </article>
        </div>
        <input className="impact-search" placeholder="Search causes, locations, categories..." />
      </section>

      <section className="impact-filters">
        {categories.map((cat, index) => (
          <button type="button" className={index === 0 ? "active" : ""} key={cat}>
            {cat}
          </button>
        ))}
      </section>

      {error ? <p className="cp-note">{error}</p> : null}

      {featured ? (
        <>
          <p className="featured-label">Featured Pool</p>
          <section className="impact-featured">
            <div>
              <p className="featured-badge">Featured - Verified</p>
              <h2>{featured.title}</h2>
              <p>{featured.desc}</p>
              <div className="featured-tags">
                <span>{featured.category}</span>
                <span>Community</span>
                <span>Public</span>
                <span>Verified</span>
              </div>
            </div>
            <aside className="featured-contribute">
              <h3>{toMoney(featured.raised)}</h3>
              <p>{featured.progress}%</p>
              <div className="featured-progress">
                <div style={{ width: `${featured.progress}%` }} />
              </div>
              <button
                type="button"
                onClick={() => joinPool(featured.id)}
                disabled={featured.joined || joiningPoolId === featured.id}
              >
                {featured.joined
                  ? "Joined"
                  : joiningPoolId === featured.id
                    ? "Joining..."
                    : "Join Pool ->"}
              </button>
            </aside>
          </section>
        </>
      ) : null}

      <section className="impact-grid">
        {cards.map((card) => (
          <article key={card.id} className="impact-card">
            <p className="impact-card-type">{card.category}</p>
            <h3>{card.title}</h3>
            <p className="impact-card-desc">{card.desc}</p>
            <div className="impact-card-progress">
              <div style={{ width: `${card.progress}%` }} />
            </div>
            <p className="impact-card-meta">
              <strong>{toMoney(card.raised)}</strong>
              <span>
                {card.progress}% of {toMoney(card.target)}
              </span>
            </p>
            <footer>
              <span>{card.contributors} contributors</span>
              <button
                type="button"
                onClick={() => joinPool(card.id)}
                disabled={card.joined || joiningPoolId === card.id}
              >
                {card.joined ? "Joined" : joiningPoolId === card.id ? "Joining..." : "Join ->"}
              </button>
            </footer>
          </article>
        ))}
      </section>

      <section className="section-row">
        <h3 />
        <Link href="/app/my-pools">Open My Pools -&gt;</Link>
      </section>
    </section>
  );
}
