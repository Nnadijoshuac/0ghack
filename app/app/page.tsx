import Image from "next/image";
import Link from "next/link";
import {
  dashboardBalance,
  impactFeatured,
  pools,
  recentActivity,
  toMoney,
  toPercent,
  viewer
} from "@/lib/mock-data";

const spotlightPools = Array.from({ length: 4 }, (_, idx) => ({
  id: idx + 1,
  title: impactFeatured.title,
  description:
    "Help build a functioning borehole for 3,000+ residents who currently walk 2km daily for water.",
  raised: toMoney(impactFeatured.raised),
  target: toMoney(impactFeatured.target),
  progress: toPercent(impactFeatured.raised, impactFeatured.target)
}));

export default function AppPage() {
  const activePools = pools.map((pool, index) => ({
    icon:
      index === 0
        ? "/images/dashboard/my-pools.png"
        : index === 1
          ? "/images/dashboard/wallet.png"
          : "/images/dashboard/impact.png",
    name: pool.name,
    meta: `${index === 0 ? "Admin" : "Contributor"}   ${pool.contributorsPaid} of ${pool.contributorsTotal} paid   ${pool.deadlineText}`,
    raised: toMoney(pool.raised),
    target: toMoney(pool.target),
    progress: toPercent(pool.raised, pool.target),
    footLeft:
      index === 0
        ? `${pool.contributorsTotal - pool.contributorsPaid} yet to pay`
        : `Your contribution: ${toMoney(pool.contributionPerPerson)}`,
    footRight: index === 0 ? "CSV Report ready" : "",
    action: index === 0 ? "Manage ->" : "View Pool ->",
    href: index === 0 ? "/app/pool-manager" : "#",
    actionColor: "blue"
  }));

  return (
    <section className="poolfi-content">
      <header className="poolfi-topbar">
        <div>
          <h1>Good morning, {viewer.handle}</h1>
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
          <Link href="/app/create-pool" className="create-pool-btn">
            + Create Pool
          </Link>
        </div>
      </header>

      <section className="balance-card">
        <div className="balance-head">
          <div>
            <p>Your PoolFi Balance</p>
            <h2>{toMoney(dashboardBalance.total)}.00</h2>
            <span>Total Balance</span>
          </div>
          <div className="balance-actions">
            <button type="button">+ Add Funds</button>
            <button type="button" className="ghost">
              Withdraw
            </button>
          </div>
        </div>
        <div className="balance-metrics">
          <article>
            <p>Available</p>
            <h3>{toMoney(dashboardBalance.available)}.00</h3>
            <span>Free to use</span>
          </article>
          <article>
            <p>Locked</p>
            <h3>{toMoney(dashboardBalance.locked)}.00</h3>
            <span>In {pools.length} active pools</span>
          </article>
          <article>
            <p>Pools</p>
            <h3>{pools.length} Active</h3>
            <span>1 completed</span>
          </article>
        </div>
      </section>

      <section className="active-pools">
        {activePools.map((pool) => (
          <article className="active-pool-card" key={pool.name}>
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
        ))}
      </section>

      <section className="spotlight">
        <div className="section-row">
          <h3>Impact Spotlight</h3>
          <Link href="/app/impact">Explore -&gt;</Link>
        </div>
        <div className="spotlight-row">
          {spotlightPools.map((pool) => (
            <article key={pool.id} className="spot-card">
              <p className="featured-tag">Featured Pool</p>
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
          {recentActivity.map((item) => (
            <li key={item.title}>
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
