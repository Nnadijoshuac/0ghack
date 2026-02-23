"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navMain = [
  { label: "Home", icon: "/images/dashboard/home.png", href: "/app", active: true },
  { label: "Create Pool", icon: "/images/dashboard/create-pool.png", href: "#" },
  { label: "My Pools", icon: "/images/dashboard/my-pools.png", href: "#", badge: "3" },
  { label: "Impact", icon: "/images/dashboard/impact.png", href: "#" },
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

const contributors = [
  {
    initials: "EO",
    name: "Princess Saven",
    meta: "CSC/2022/031",
    time: "Just now",
    you: true,
    avatarClass: "blue"
  },
  {
    initials: "CN",
    name: "Chidi Nwosu",
    meta: "CSC/2022/014",
    time: "2 hrs ago",
    you: false,
    avatarClass: "green"
  },
  {
    initials: "AE",
    name: "Amaka Eze",
    meta: "ENG/2022/089",
    time: "3 hrs ago",
    you: false,
    avatarClass: "orange"
  },
  {
    initials: "TA",
    name: "Tunde Adeyemi",
    meta: "PHY/2022/055",
    time: "Yesterday",
    you: false,
    avatarClass: "purple"
  },
  {
    initials: "NO",
    name: "Ngozi Okafor",
    meta: "MED/2022/112",
    time: "Yesterday",
    you: false,
    avatarClass: "pink"
  },
  {
    initials: "SA",
    name: "Seun Abiodun",
    meta: "LAW/2022/007",
    time: "2 days ago",
    you: false,
    avatarClass: "teal"
  }
];

export default function PoolManagerPage() {
  const [hasJoined, setHasJoined] = useState(false);

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

      <section className="poolfi-content pool-manager-content">
        <section className="manager-hero">
          <p className="manager-chip">Goal Pool - Private - Invite Only</p>
          <h1>300L Class Dues 2nd Semester 2025/26</h1>
          <p className="manager-sub">
            All 300 Level students are required to pay their class dues before the
            deadline. Funds go towards end-of-semester events, class materials, and
            welfare.
          </p>
          <div className="manager-kpis">
            <article>
              <span>Raised so far</span>
              <h3>N312,000</h3>
              <p>of N400,000 target</p>
            </article>
            <article>
              <span>Contributors</span>
              <h3>312</h3>
              <p>of 400 students</p>
            </article>
            <article>
              <span>Per Person</span>
              <h3>N1,000</h3>
              <p>fixed contribution</p>
            </article>
            <article>
              <span>Status</span>
              <h3>5 Days Left</h3>
              <p>Closes Feb 23, 2026</p>
            </article>
          </div>
        </section>

        <section className="manager-grid">
          <div className="manager-main">
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

            <article className="contributors-card">
              <div className="contributors-head">
                <h3>Contributors</h3>
                <div className="contributors-stats">
                  <span className="paid">312 Paid</span>
                  <span className="pending">88 Pending</span>
                </div>
                <div className="filter-pills">
                  <button type="button" className="active">
                    All
                  </button>
                  <button type="button">Paid</button>
                  <button type="button">Pending</button>
                </div>
              </div>

              <ul className="contributors-list">
                {contributors.map((person) => (
                  <li key={person.name}>
                    <div className="person-main">
                      <span className={`person-avatar ${person.avatarClass}`}>
                        {person.initials}
                      </span>
                      <div>
                        <h4>
                          {person.name}{" "}
                          {person.you ? <span className="you-tag">You</span> : null}
                        </h4>
                        <p>{person.meta}</p>
                      </div>
                    </div>
                    <p className="person-time">{person.time}</p>
                    <span className="paid-pill">Paid</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <aside className="manager-side">
            <article className="close-box">
              <p>Pool closes in</p>
              <h3>5 days, 14 hrs</h3>
            </article>

            {hasJoined ? (
              <>
                <article className="contribute-box">
                  <h4>Make Your Contribution</h4>
                  <p className="contribute-amount">
                    N1,000 <span>fixed amount</span>
                  </p>

                  <div className="contribute-form">
                    <label>
                      Full Name <span>Required</span>
                      <input placeholder="Enter your full name" />
                    </label>
                    <label>
                      Matric Number <span>Required</span>
                      <input placeholder="e.g. CSC/2022/045" />
                    </label>
                    <p className="balance-chip">
                      Your PoolFi Balance <strong>N31,500.00</strong>
                    </p>
                    <button type="button" className="contribute-btn">
                      Contribute N1,000 -&gt;
                    </button>
                    <p className="secure-note">Secured by smart contract on Lisk</p>
                  </div>
                </article>

                <article className="share-box">
                  <h4>Remind your classmates</h4>
                  <button type="button">Share on WhatsApp</button>
                  <button type="button">Copy Pool Link</button>
                </article>
              </>
            ) : (
              <>
                <article className="join-box">
                  <p className="join-eyebrow">Goal Pool - Private</p>
                  <h3>Join this pool</h3>
                  <p className="join-sub">You have been invited to contribute</p>
                  <div className="join-info">
                    <div>
                      <span>Your contribution</span>
                      <strong>N1,000 (fixed)</strong>
                    </div>
                    <div>
                      <span>Admin</span>
                      <strong>Chidi Nwosu</strong>
                    </div>
                    <div>
                      <span>Deadline</span>
                      <strong>Feb 23, 2026</strong>
                    </div>
                    <div>
                      <span>Members so far</span>
                      <strong>350 joined</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="join-later"
                    onClick={() => setHasJoined(true)}
                  >
                    Join Pool (Pay Later)
                  </button>
                  <button
                    type="button"
                    className="join-pay"
                    onClick={() => setHasJoined(true)}
                  >
                    Join and Pay Now - N1,000
                  </button>
                </article>

                <article className="info-box">
                  <h4>What happens when you join?</h4>
                  <ol>
                    <li>The pool is saved in your My Pools tab.</li>
                    <li>You appear in the member list as Joined (Pending).</li>
                    <li>You can pay anytime before the deadline.</li>
                  </ol>
                </article>

                <article className="share-box">
                  <h4>Share this pool</h4>
                  <button type="button">Share on WhatsApp</button>
                  <button type="button">Copy Pool Link</button>
                </article>
              </>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}
