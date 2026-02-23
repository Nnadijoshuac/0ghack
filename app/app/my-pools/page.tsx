import Image from "next/image";
import Link from "next/link";

const navMain = [
  { label: "Home", icon: "/images/dashboard/home.png", href: "/app" },
  { label: "Create Pool", icon: "/images/dashboard/create-pool.png", href: "/app/create-pool" },
  {
    label: "My Pools",
    icon: "/images/dashboard/my-pools.png",
    href: "/app/my-pools",
    active: true,
    badge: "3"
  },
  { label: "Impact", icon: "/images/dashboard/impact.png", href: "/app/impact" },
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

const members = [
  ["EO", "Emeka Obi", "CSC/2022/031 - Paid Feb 18", "Paid", "blue"],
  ["CN", "Chidi Nwosu", "CSC/2022/014 - Paid Feb 18", "Paid", "green"],
  ["AE", "Amaka Eze", "ENG/2022/089 - Paid Feb 17", "Paid", "orange"],
  ["FO", "Femi Okonkwo", "CHE/2022/068. Paid Feb 17", "Paid", "gray"],
  ["BA", "Bisi Adeleke", "MTH/2022/029. Paid Feb 16", "Paid", "gray"],
  ["UI", "Uche Ibe", "MTH/2022/029. Paid Feb 16", "Paid", "gray"],
  ["NO", "Ngozi Okafor", "MED/2022/112 - Paid Feb 15", "Paid", "red"],
  ["TA", "Tunde Adeyemi", "PHY/2022/055 - Paid Feb 16", "Paid", "teal"]
] as const;

export default function MyPoolsPage() {
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

      <section className="poolfi-content mypools-content">
        <header className="poolfi-topbar">
          <div>
            <h1>Good morning, Saven</h1>
            <p>Wednesday, Feb 18, 2026</p>
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
          <h1>300L Class Dues - 2nd Semester 2025/26</h1>
          <p className="mypools-hero-sub">Closes Feb 28, 2026 - N1,000 per person - Education</p>
          <div className="mypools-kpis">
            <article>
              <span>Total Raised</span>
              <h3>N313,000</h3>
              <p>of N400,000 target</p>
            </article>
            <article>
              <span>Contributors</span>
              <h3>313</h3>
              <p>Paid</p>
            </article>
            <article>
              <span>Pending</span>
              <h3>87</h3>
              <p>Have not paid</p>
            </article>
            <article>
              <span>Deadline</span>
              <h3>5</h3>
              <p>Days Left</p>
            </article>
          </div>
        </section>

        <section className="mypools-grid">
          <div className="mypools-main">
            <article className="manager-progress-card">
              <div className="title-row">
                <h2>N312,000 raised</h2>
                <span className="mini-pill">78% funded</span>
              </div>
              <div className="active-progress">
                <div style={{ width: "78%" }} />
              </div>
              <div className="progress-meta">
                <p>88 students yet to pay</p>
                <p>Target: N400,000</p>
              </div>
            </article>

            <article className="mypools-members">
              <div className="members-head">
                <h3>Members</h3>
                <span>(400 total)</span>
                <button type="button">Remind All Unpaid</button>
              </div>
              <input className="members-search" placeholder="Search names..." />
              <div className="members-tabs">
                <button type="button" className="active">
                  All (400)
                </button>
                <button type="button">Paid (313)</button>
                <button type="button">Pending (87)</button>
              </div>
              <ul>
                {members.map(([initials, name, meta, status, color]) => (
                  <li key={name}>
                    <div className="person-main">
                      <span className={`person-avatar ${color}`}>{initials}</span>
                      <div>
                        <h4>{name}</h4>
                        <p>{meta}</p>
                      </div>
                    </div>
                    <span className="paid-pill">{status}</span>
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
                  <strong>N1,000 (fixed)</strong>
                </p>
                <p>
                  <span>Deadline</span>
                  <strong>Feb 28, 2026</strong>
                </p>
                <p>
                  <span>Withdrawal Mode</span>
                  <strong>Take All at Close</strong>
                </p>
                <p>
                  <span>Auto Reminders</span>
                  <strong>Enabled</strong>
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
    </main>
  );
}
