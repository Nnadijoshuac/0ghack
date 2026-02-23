"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";

type CreatePoolStep = "choose" | "basics" | "rules" | "review";
type PoolType = "goal" | "impact";

const navMain = [
  { label: "Home", icon: "/images/dashboard/home.png", active: true, href: "/app" },
  {
    label: "Create Pool",
    icon: "/images/dashboard/create-pool.png",
    active: false,
    href: "/app/create-pool"
  },
  {
    label: "My Pools",
    icon: "/images/dashboard/my-pools.png",
    badge: "3",
    href: "/app/my-pools"
  },
  { label: "Impact", icon: "/images/dashboard/impact.png", href: "/app/impact" },
  { label: "My Wallet", icon: "/images/dashboard/wallet.png", href: "#" }
];

const navAccount = [
  {
    label: "Notifications",
    icon: "/images/dashboard/notifications.png",
    badge: "2",
    badgeRed: true,
    href: "#"
  },
  { label: "Settings", icon: "/images/dashboard/settings.png", href: "#" }
];

const spotlightPools = Array.from({ length: 4 }, (_, idx) => ({
  id: idx + 1,
  title: "Clean Water for Oguta Community, Imo State",
  description:
    "Help build a functioning borehole for 3,000+ residents who currently walk 2km daily for water.",
  raised: "N670,000",
  target: "N1,000,000",
  progress: 67
}));

const recentActivity = [
  {
    icon: "CARD",
    title: "Wallet funded",
    time: "Today - 9:14am",
    amount: "+N20,000",
    positive: true
  },
  {
    icon: "DUES",
    title: "Class Dues contribution",
    time: "Today - 9:16am",
    amount: "-N1,000",
    positive: false
  },
  {
    icon: "BELL",
    title: "Amaka paid her dues",
    time: "Yesterday - 3:42pm",
    amount: "Pool update",
    positive: null
  },
  {
    icon: "POOL",
    title: "Wedding pool joined",
    time: "Feb 16 - 11:00am",
    amount: "-N5,000",
    positive: false
  }
];

const activePools = [
  {
    icon: "/images/dashboard/my-pools.png",
    name: "300L Class Dues - 2nd Semester",
    meta: "Admin   312 of 400 paid   Closes in 5 days",
    raised: "N312,000",
    target: "N400,000",
    progress: 78,
    footLeft: "88 yet to pay",
    footRight: "CSV Report ready",
    action: "Manage ->",
    href: "/app/pool-manager",
    actionColor: "blue"
  },
  {
    icon: "/images/dashboard/wallet.png",
    name: "Amaka's Wedding Collection",
    meta: "Contributor   48 contributors   Closes in 12 days",
    raised: "N240,000",
    target: "N500,000",
    progress: 48,
    footLeft: "Your contribution: N5,000",
    footRight: "",
    action: "View Pool ->",
    href: "#",
    actionColor: "blue"
  },
  {
    icon: "/images/dashboard/impact.png",
    name: "Mosque Renovation Fund",
    meta: "Contributor   Goal: N2,000,000   30 days left",
    raised: "N850,000",
    target: "N2,000,000",
    progress: 43,
    footLeft: "Your contribution: N10,000",
    footRight: "",
    action: "View Pool ->",
    href: "#",
    actionColor: "blue"
  }
];

export default function AppPage() {
  const router = useRouter();
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isPoolLaunchedOpen, setIsPoolLaunchedOpen] = useState(false);
  const [createStep, setCreateStep] = useState<CreatePoolStep>("choose");
  const [poolType, setPoolType] = useState<PoolType>("goal");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const launchedLink = "poolfi.app/goal/3xK9mP2vQr";

  const modalTitle = useMemo(() => {
    if (poolType === "impact") return "Create Impact Pool";
    return "Create Goal Pool";
  }, [poolType]);

  const openCreatePool = () => {
    router.push("/app/create-pool");
  };

  const closeCreatePool = () => {
    setIsCreatePoolOpen(false);
    setCreateStep("choose");
  };

  const closeLaunchModal = () => {
    setIsPoolLaunchedOpen(false);
    setCopyState("idle");
  };

  const handleLaunchPool = () => {
    setIsCreatePoolOpen(false);
    setIsPoolLaunchedOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(launchedLink);
      setCopyState("copied");
    } catch {
      setCopyState("idle");
    }
  };

  const goForward = () => {
    if (createStep === "choose") {
      setCreateStep("basics");
      return;
    }
    if (createStep === "basics") {
      setCreateStep("rules");
      return;
    }
    if (createStep === "rules") {
      setCreateStep("review");
    }
  };

  const goBack = () => {
    if (createStep === "review") {
      setCreateStep("rules");
      return;
    }
    if (createStep === "rules") {
      setCreateStep("basics");
      return;
    }
    if (createStep === "basics") {
      setCreateStep("choose");
    }
  };

  return (
    <>
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

        <section className="poolfi-content">
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
              <button type="button" className="create-pool-btn" onClick={openCreatePool}>
                + Create Pool
              </button>
            </div>
          </header>

          <section className="balance-card">
            <div className="balance-head">
              <div>
                <p>Your PoolFi Balance</p>
                <h2>N47,500.00</h2>
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
                <h3>N32,500.00</h3>
                <span>Free to use</span>
              </article>
              <article>
                <p>Locked</p>
                <h3>N15,000.00</h3>
                <span>In 3 active pools</span>
              </article>
              <article>
                <p>Pools</p>
                <h3>3 Active</h3>
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
              <Link href="#">Explore -&gt;</Link>
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
      </main>

      {isCreatePoolOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          {createStep === "choose" ? (
            <section className="pool-modal choose-modal">
              <button className="modal-close" type="button" onClick={closeCreatePool}>
                x
              </button>
              <h2>Create a Pool</h2>
              <p>
                Choose the type of pool you want to create. You can always change the
                details after.
              </p>

              <div className="pool-type-grid">
                <button
                  type="button"
                  className={`pool-type-card${poolType === "goal" ? " active" : ""}`}
                  onClick={() => setPoolType("goal")}
                >
                  <span className="type-icon-wrap">
                    <Image
                      src="/images/dashboard/create-pool.png"
                      alt=""
                      width={26}
                      height={26}
                    />
                  </span>
                  <h3>Goal Pool</h3>
                  <p>Private. Invite-only. For class dues, events, group contributions.</p>
                </button>

                <button
                  type="button"
                  className={`pool-type-card${poolType === "impact" ? " active" : ""}`}
                  onClick={() => setPoolType("impact")}
                >
                  <span className="type-icon-wrap">
                    <Image src="/images/dashboard/impact.png" alt="" width={26} height={26} />
                  </span>
                  <h3>Impact Pool</h3>
                  <p>Public. Community-verified. For causes, projects, and shared goals.</p>
                </button>
              </div>

              <button type="button" className="modal-primary" onClick={goForward}>
                Continue to Setup -&gt;
              </button>
            </section>
          ) : (
            <section className="pool-modal wizard-modal">
              <div className="wizard-header">
                <button type="button" className="wizard-back" onClick={goBack}>
                  &lt;
                </button>
                <h2>{modalTitle}</h2>
                <button type="button" className="wizard-preview">
                  Preview
                </button>
              </div>

              <div className="wizard-steps">
                <div className={`wizard-step ${createStep === "basics" ? "active" : ""}`}>
                  <span>1</span>
                  <p>Pool Basics</p>
                </div>
                <div className={`wizard-step ${createStep === "rules" ? "active" : ""}`}>
                  <span>2</span>
                  <p>Rules &amp; Fields</p>
                </div>
                <div className={`wizard-step ${createStep === "review" ? "active" : ""}`}>
                  <span>3</span>
                  <p>Review &amp; Launch</p>
                </div>
              </div>

              <div className="wizard-body">
                <article className="wizard-form-card">
                  {createStep === "basics" ? (
                    <>
                      <h3>Pool Basics</h3>
                      <p>
                        Tell us what this pool is for. Contributors will see these details
                        when they open your link.
                      </p>
                      <div className="wizard-form-grid">
                        <label>
                          Pool Name
                          <input placeholder="e.g. 300L Class Dues - 2nd Semester" />
                        </label>
                        <label>
                          Description
                          <textarea placeholder="Briefly describe what this pool is for and how the money will be used..." />
                        </label>
                        <div className="two-col-fields">
                          <label>
                            Target Amount (N)
                            <input placeholder="400,000" />
                          </label>
                          <label>
                            Contribution Per Person (N)
                            <input placeholder="1,000" />
                          </label>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {createStep === "rules" ? (
                    <>
                      <h3>Rules &amp; Identity Fields</h3>
                      <p>
                        Define how contributors pay and what information you need from
                        them.
                      </p>
                      <div className="toggle-stack">
                        <div className="toggle-row">
                          <div>
                            <h4>Take All at Close</h4>
                            <p>Funds released to admin when pool closes or target is hit</p>
                          </div>
                          <button type="button" className="switch off" />
                        </div>
                        <div className="toggle-row">
                          <div>
                            <h4>Milestone Withdrawals</h4>
                            <p>Withdraw in stages as the pool hits set percentages</p>
                          </div>
                          <button type="button" className="switch on" />
                        </div>
                      </div>
                    </>
                  ) : null}

                  {createStep === "review" ? (
                    <>
                      <h3>Review &amp; Launch</h3>
                      <p>
                        Everything looks good. Launch your pool and share the link with
                        your group.
                      </p>
                      <div className="summary-box">
                        <div>
                          <small>Pool Name</small>
                          <strong>300L Class Dues</strong>
                        </div>
                        <div>
                          <small>Target</small>
                          <strong>400,000</strong>
                        </div>
                        <div>
                          <small>Per Person</small>
                          <strong>1,000</strong>
                        </div>
                        <div>
                          <small>Deadline</small>
                          <strong>7 Mar 2026</strong>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="wizard-actions">
                    <button type="button" className="modal-secondary" onClick={goBack}>
                      {createStep === "basics" ? "Cancel" : "< Back"}
                    </button>
                    <button
                      type="button"
                      className="modal-primary"
                      onClick={createStep === "review" ? handleLaunchPool : goForward}
                    >
                      {createStep === "review" ? "Launch Pool ->" : "Continue ->"}
                    </button>
                  </div>
                </article>

                <aside className="wizard-preview-card">
                  <p className="preview-eyebrow">Goal Pool - Private</p>
                  <h4>Your pool name...</h4>
                  <p>Add a description above</p>
                  <div className="preview-metrics">
                    <div>
                      <small>Target</small>
                      <strong>N-</strong>
                    </div>
                    <div>
                      <small>Per Person</small>
                      <strong>N-</strong>
                    </div>
                  </div>
                  <div className="preview-note">
                    The live preview updates as you fill in details. This is exactly what
                    contributors see.
                  </div>
                </aside>
              </div>
            </section>
          )}
        </div>
      ) : null}

      {isPoolLaunchedOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal launch-modal">
            <div className="launch-icon">🎉</div>
            <h2>Pool Launched</h2>
            <p>
              Your pool is live on the Lisk network. Share the link below with your
              group to start collecting contributions.
            </p>
            <div className="launch-link-row">
              <span>{launchedLink}</span>
              <button type="button" onClick={handleCopyLink}>
                {copyState === "copied" ? "Copied" : "Copy Link"}
              </button>
            </div>
            <div className="launch-actions">
              <button
                type="button"
                className="modal-secondary"
                onClick={() => {
                  closeLaunchModal();
                  closeCreatePool();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-primary"
                onClick={() => {
                  closeLaunchModal();
                  closeCreatePool();
                }}
              >
                Continue to Rules {"->"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
