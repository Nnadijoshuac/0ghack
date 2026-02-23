import Link from "next/link";

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

const impactStats = {
  totalRaisedLabel: "N48.2M",
  contributorsLabel: "1,240",
  activePools: "34",
  completedLabel: "12"
};

const impactFeatured = {
  title: "Clean Water Borehole for Oguta Community, Imo State",
  description:
    "3,000+ residents walk 2km daily for water. This pool funds a functional borehole and distribution network.",
  raisedLabel: "N670,000",
  targetLabel: "N1,000,000",
  progress: 67
};

const impactCards = Array.from({ length: 6 }, (_, idx) => ({
  id: `impact-${idx + 1}`,
  title: "Scholarship Fund for Indigent UNIBEN Students",
  desc: "Supporting 20 students who cannot afford fees this semester.",
  raisedLabel: "N270,000",
  targetLabel: "N500,000",
  progress: 54,
  contributors: 128
}));

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
            <h3>{impactStats.activePools}</h3>
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
          <p>{impactFeatured.description}</p>
          <div className="featured-tags">
            <span>Water</span>
            <span>Imo State</span>
            <span>Community</span>
            <span>Verified</span>
          </div>
        </div>
        <aside className="featured-contribute">
          <h3>{impactFeatured.raisedLabel}</h3>
          <p>{impactFeatured.progress}%</p>
          <div className="featured-progress">
            <div style={{ width: `${impactFeatured.progress}%` }} />
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
              <div style={{ width: `${card.progress}%` }} />
            </div>
            <p className="impact-card-meta">
              <strong>{card.raisedLabel}</strong>
              <span>
                {card.progress}% of {card.targetLabel}
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
