import Image from "next/image";
import { poolMembers, pools, toMoney, toPercent, uiMeta, viewer } from "@/lib/mock-data";

export default function MyPoolsPage() {
  const pool = pools[0];

  return (
    <section className="poolfi-content mypools-content">
      <header className="poolfi-topbar">
        <div>
          <h1>Good morning, {viewer.handle}</h1>
          <p>{uiMeta.todayLabel}</p>
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
          Closes Feb 28, 2026 - {toMoney(pool.contributionPerPerson)} per person - {pool.category}
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
            <h3>{pool.contributorsTotal - pool.contributorsPaid}</h3>
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
              <h2>{toMoney(pool.raised)} raised</h2>
              <span className="mini-pill">{toPercent(pool.raised, pool.target)}% funded</span>
            </div>
            <div className="active-progress">
              <div style={{ width: `${toPercent(pool.raised, pool.target)}%` }} />
            </div>
            <div className="progress-meta">
              <p>{pool.contributorsTotal - pool.contributorsPaid} students yet to pay</p>
              <p>Target: {toMoney(pool.target)}</p>
            </div>
          </article>

          <article className="mypools-members">
            <div className="members-head">
              <h3>Members</h3>
              <span>({pool.contributorsTotal} total)</span>
              <button type="button">Remind All Unpaid</button>
            </div>
            <input className="members-search" placeholder="Search names..." />
            <div className="members-tabs">
              <button type="button" className="active">
                All ({pool.contributorsTotal})
              </button>
              <button type="button">Paid ({pool.contributorsPaid})</button>
              <button type="button">Pending ({pool.contributorsTotal - pool.contributorsPaid})</button>
            </div>
            <ul>
              {poolMembers.map((member) => (
                <li key={member.name}>
                  <div className="person-main">
                    <span className={`person-avatar ${member.avatarClass}`}>{member.initials}</span>
                    <div>
                      <h4>{member.name}</h4>
                      <p>
                        {member.matric} - {member.paidDateText}
                      </p>
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
  );
}
