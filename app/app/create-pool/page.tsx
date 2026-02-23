"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Step = 1 | 2 | 3;

const navMain = [
  { label: "Home", icon: "/images/dashboard/home.png", href: "/app", active: true },
  {
    label: "Create Pool",
    icon: "/images/dashboard/create-pool.png",
    href: "/app/create-pool",
    selected: true
  },
  { label: "My Pools", icon: "/images/dashboard/my-pools.png", href: "/app/my-pools", badge: "3" },
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

export default function CreatePoolPage() {
  const [step, setStep] = useState<Step>(1);
  const [launched, setLaunched] = useState(false);

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

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
                  className={`nav-item${item.selected ? " active" : ""}`}
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

        <section className="poolfi-content create-pool-content">
          <header className="create-pool-top">
            <Link href="/app" className="back-btn">
              &lt;
            </Link>
            <h1>Create Goal Pool</h1>
            <button type="button" className="wizard-preview">
              Preview
            </button>
          </header>

          <div className="create-pool-steps">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`cp-step ${step === s ? "active" : step > s ? "done" : ""}`}>
                <span>{step > s ? "✓" : s}</span>
                <p>
                  {s === 1
                    ? "Pool Basics"
                    : s === 2
                      ? "Rules & Fields"
                      : "Review & Launch"}
                </p>
              </div>
            ))}
          </div>

          <div className="create-pool-grid">
            <article className="cp-main-card">
              {step === 1 ? (
                <>
                  <div className="cp-head">
                    <h2>Pool Basics</h2>
                    <p>
                      Tell us what this pool is for. Contributors will see these details
                      when they open your link.
                    </p>
                  </div>
                  <div className="cp-form">
                    <label>
                      Pool Name
                      <input placeholder="e.g. 300L Class Dues - 2nd Semester" />
                    </label>
                    <label>
                      Description <span>optional</span>
                      <textarea placeholder="Briefly describe what this pool is for and how the money will be used..." />
                    </label>
                    <div className="cp-two">
                      <label>
                        Target Amount (N)
                        <input placeholder="400,000" />
                      </label>
                      <label>
                        Contribution Per Person (N)
                        <input placeholder="1,000" />
                      </label>
                    </div>
                    <div className="cp-two">
                      <label>
                        Start Date
                        <input value="02/18/2026" readOnly />
                      </label>
                      <label>
                        Deadline
                        <input value="03/04/2026" readOnly />
                      </label>
                    </div>
                    <label>
                      Pool Category
                      <input value="Education / School" readOnly />
                    </label>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <div className="cp-head">
                    <h2>Rules & Identity Fields</h2>
                    <p>Define how contributors pay and what information you need from them.</p>
                  </div>
                  <div className="cp-rules">
                    <div className="cp-toggle">
                      <div>
                        <h4>Take All at Close</h4>
                        <p>Funds released to admin when pool closes or target is hit</p>
                      </div>
                      <button type="button" className="switch off" />
                    </div>
                    <div className="cp-toggle">
                      <div>
                        <h4>Milestone Withdrawals</h4>
                        <p>Withdraw in stages as the pool hits set percentages</p>
                      </div>
                      <button type="button" className="switch off" />
                    </div>
                    <div className="cp-list-item">50% First release - midpoint</div>
                    <div className="cp-list-item">100% Final release - pool closes</div>
                    <button type="button" className="cp-dashed-btn">
                      + Add Milestone
                    </button>
                    <h4 className="section-title">Pool Options</h4>
                    <div className="cp-toggle">
                      <div>
                        <h4>Auto-close on Target</h4>
                        <p>Pool closes automatically when contribution target is reached</p>
                      </div>
                      <button type="button" className="switch off" />
                    </div>
                    <div className="cp-toggle">
                      <div>
                        <h4>Allow Anonymous Contributions</h4>
                        <p>Contributors can hide their identity on the paid list</p>
                      </div>
                      <button type="button" className="switch off" />
                    </div>
                    <div className="cp-toggle">
                      <div>
                        <h4>Automatic Reminders</h4>
                        <p>PoolFi nudges unpaid contributors 3 days before deadline</p>
                      </div>
                      <button type="button" className="switch off" />
                    </div>
                  </div>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <div className="cp-head">
                    <h2>Review & Launch</h2>
                    <p>Everything looks good. Launch your pool and share the link.</p>
                  </div>
                  <div className="cp-summary">
                    <h4>Pool Summary</h4>
                    <div className="cp-summary-grid">
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
                  </div>
                  <div className="cp-summary">
                    <h4>Identity Fields</h4>
                    <div className="cp-pill-row">
                      <span>Full Name</span>
                      <span>Matric. No</span>
                    </div>
                  </div>
                  <p className="cp-note">
                    Once launched, your pool will be deployed on the Lisk network.
                    Contributions are secured by smart contract and can only be released by
                    you as the admin.
                  </p>
                </>
              ) : null}

              <div className="cp-actions">
                <button type="button" className="modal-secondary" onClick={step === 1 ? undefined : prevStep}>
                  {step === 1 ? "Cancel" : "< Back"}
                </button>
                <button
                  type="button"
                  className="modal-primary"
                  onClick={step === 3 ? () => setLaunched(true) : nextStep}
                >
                  {step === 1
                    ? "Continue to Rules ->"
                    : step === 2
                      ? "Review Pool ->"
                      : "Launch Pool ->"}
                </button>
              </div>
            </article>

            <aside className="cp-preview">
              <h3>Live Preview</h3>
              <p>What contributors see</p>
              <article className="wizard-preview-card">
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
              </article>
            </aside>
          </div>
        </section>
      </main>

      {launched ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal launch-modal">
            <div className="launch-icon">🎉</div>
            <h2>Pool Launched</h2>
            <p>Your pool is live and ready to collect contributions.</p>
            <div className="launch-actions">
              <Link className="modal-primary" href="/app">
                Go to Dashboard
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
