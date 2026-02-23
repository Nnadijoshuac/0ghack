import Image from "next/image";
import Link from "next/link";

const navMain = [
  { label: "Home", icon: "/images/dashboard/home.png", href: "/app" },
  { label: "Create Pool", icon: "/images/dashboard/create-pool.png", href: "/app/create-pool" },
  { label: "My Pools", icon: "/images/dashboard/my-pools.png", href: "/app/my-pools", badge: "3" },
  { label: "Impact", icon: "/images/dashboard/impact.png", href: "/app/impact", active: true },
  { label: "My Wallet", icon: "/images/dashboard/wallet.png", href: "#" }
];

const navAccount = [
  {
    label: "Notifications",
    icon: "/images/dashboard/notifications.png",
    href: "#",
    badge: "2",
    badgeRed: true
  },
  { label: "Settings", icon: "/images/dashboard/settings.png", href: "#" }
];

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

const impactCards = Array.from({ length: 6 }, (_, idx) => ({
  id: idx + 1,
  title: "Scholarship Fund for Indigent UNIBEN Students",
  desc: "Supporting 20 students who can't afford fees this semester.",
  raised: "N270,000",
  target: "N500,000",
  contributors: "128 contributors",
  progress: 54
}));

export default function ImpactPage() {
  return (
    <main className="poolfi-dashboard">
      <aside className="poolfi-sidebar">
        <div>
          <div className="poolfi-brand">
            <Image
              src="/images/dashboard/sidebar-logo.png"
              alt="PoolFi"
              width={112}
              height={48}
              className="sidebar-logo"
            />
          </div>

          <p className="nav-title">Main</p>
          <nav className="sidebar-nav">
            {navMain.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className={`nav-item${item.active ? " active" : ""}`}
              >
                <span className="nav-icon-wrap">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </span>
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </Link>
            ))}
          </nav>

          <p className="nav-title">Account</p>
          <nav className="sidebar-nav">
            {navAccount.map((item) => (
              <Link href={item.href} key={item.label} className="nav-item">
                <span className="nav-icon-wrap">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </span>
                <span>{item.label}</span>
                {item.badge ? (
                  <span className={`nav-badge${item.badgeRed ? " red" : ""}`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">PS</div>
          <div>
            <p>Princess Saven</p>
            <span>Saven</span>
          </div>
        </div>
      </aside>

      <section className="poolfi-content impact-content">
        <section className="impact-hero">
          <p className="impact-chip">Impact Pools</p>
          <h1>
            Fund causes that matter.
            <br />
            With accountability built in.
          </h1>
          <p className="impact-sub">
            Every impact pool is community-governed. Contributors vote to release
            funds, so your money only moves when the cause deserves it.
          </p>
          <div className="impact-stats">
            <article>
              <h3>N48.2M</h3>
              <p>Total Raised</p>
            </article>
            <article>
              <h3>1,240</h3>
              <p>Contributors</p>
            </article>
            <article>
              <h3>34</h3>
              <p>Active Pools</p>
            </article>
            <article>
              <h3>12</h3>
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
            <h2>Clean Water Borehole for Oguta Community, Imo State</h2>
            <p>
              3,000+ residents walk 2km daily for water. This pool funds a functional
              borehole and distribution network.
            </p>
            <div className="featured-tags">
              <span>Water</span>
              <span>Imo State</span>
              <span>Community</span>
              <span>Verified</span>
            </div>
          </div>
          <aside className="featured-contribute">
            <h3>N670,000</h3>
            <p>67%</p>
            <div className="featured-progress">
              <div style={{ width: "67%" }} />
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
                <strong>{card.raised}</strong>
                <span>{card.progress}% of {card.target}</span>
              </p>
              <footer>
                <span>{card.contributors}</span>
                <button type="button">Give -&gt;</button>
              </footer>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
