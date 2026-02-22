const pools = [
  {
    name: "Women in Agri-Tech Fund",
    progress: 74,
    raised: "$42,350",
    target: "$57,000",
    status: "Milestone review due in 3 days"
  },
  {
    name: "Community Solar Co-op",
    progress: 56,
    raised: "$18,420",
    target: "$33,000",
    status: "2 new contributors joined today"
  },
  {
    name: "Health Access Bridge",
    progress: 91,
    raised: "$63,900",
    target: "$70,000",
    status: "Ready for payout vote"
  }
];

const activity = [
  "Awa N. contributed $350 to Women in Agri-Tech Fund",
  "Milestone #2 approved in Health Access Bridge",
  "Community Solar Co-op shared monthly impact report",
  "12 contributors completed identity verification"
];

export default function AppPage() {
  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Poolfin</p>
          <h1>Good evening, Chimd</h1>
        </div>
        <button className="btn btn-primary" type="button">
          Create new pool
        </button>
      </header>

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Active pools</p>
          <h2>12</h2>
          <span>+3 this month</span>
        </article>
        <article className="kpi-card">
          <p>Total value locked</p>
          <h2>$184,700</h2>
          <span>Across all contributors</span>
        </article>
        <article className="kpi-card">
          <p>Released milestones</p>
          <h2>27</h2>
          <span>91% verification success</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="surface">
          <div className="section-head">
            <h3>Pool Overview</h3>
            <button type="button" className="text-button">
              View all
            </button>
          </div>
          <div className="pool-list">
            {pools.map((pool) => (
              <div key={pool.name} className="pool-card">
                <div className="pool-line">
                  <h4>{pool.name}</h4>
                  <span>{pool.progress}%</span>
                </div>
                <p className="muted">
                  {pool.raised} raised of {pool.target}
                </p>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pool.progress}%` }}
                  />
                </div>
                <p className="pool-status">{pool.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface">
          <div className="section-head">
            <h3>Live Activity</h3>
            <button type="button" className="text-button">
              Open feed
            </button>
          </div>
          <ul className="activity-list">
            {activity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

