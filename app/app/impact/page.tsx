import Link from "next/link";
import {
  impactCards,
  impactFeatured,
  impactStats,
  pools,
  toMoney,
  toPercent
} from "@/lib/mock-data";

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

export default function ImpactPage() {
  return (
    <section className="poolfi-content impact-content">
      <section className="impact-hero">
        <p className="impact-chip">Impact Pools</p>
        <h1>
          Fund causes that matter.
          <br />
          With accountability built in.
        </h1>
        <p className="impact-sub">
          Every impact pool is community-governed. Contributors vote to release funds,
          so your money only moves when the cause deserves it.
        </p>
        <div className="impact-stats">
          <article>
            <h3>{impactStats.totalRaisedLabel}</h3>
            <p>Total Raised</p>
          </article>
          <article>
            <h3>{impactStats.contributorsLabel}</h3>
            <p>Contributors</p>
          </article>
          <article>
            <h3>{pools.length + 31}</h3>
            <p>Active Pools</p>
          </article>
          <article>
            <h3>{impactStats.completedLabel}</h3>
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

      <p className="featured-label">Featured Pool</p>
      <section className="impact-featured">
        <div>
          <p className="featured-badge">Featured - Verified</p>
          <h2>{impactFeatured.title}</h2>
          <p>
            {impactFeatured.description}
          </p>
          <div className="featured-tags">
            <span>Water</span>
            <span>Imo State</span>
            <span>Community</span>
            <span>Verified</span>
          </div>
        </div>
        <aside className="featured-contribute">
          <h3>{toMoney(impactFeatured.raised)}</h3>
          <p>{toPercent(impactFeatured.raised, impactFeatured.target)}%</p>
          <div className="featured-progress">
            <div style={{ width: `${toPercent(impactFeatured.raised, impactFeatured.target)}%` }} />
          </div>
          <button type="button">Contribute to this Pool -&gt;</button>
        </aside>
      </section>

      <section className="impact-grid">
        {impactCards.map((card) => (
          <article key={card.id} className="impact-card">
            <p className="impact-card-type">Education</p>
            <h3>{card.title}</h3>
            <p className="impact-card-desc">{card.desc}</p>
            <div className="impact-card-progress">
              <div style={{ width: `${toPercent(card.raised, card.target)}%` }} />
            </div>
            <p className="impact-card-meta">
              <strong>{toMoney(card.raised)}</strong>
              <span>
                {toPercent(card.raised, card.target)}% of {toMoney(card.target)}
              </span>
            </p>
            <footer>
              <span>{card.contributors} contributors</span>
              <button type="button">Give -&gt;</button>
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
