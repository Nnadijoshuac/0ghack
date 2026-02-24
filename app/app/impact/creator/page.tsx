"use client";

import Image from "next/image";
import { useState } from "react";
import AppTopbar from "@/components/app-topbar";
import { toMoney } from "@/lib/backend/format";

const contributors = [
  { initials: "CE", name: "Chioma Eze", handle: "SilverFalcon#3312", amount: 5000, date: "Feb 18, 2026", status: "Approved" },
  { initials: "BM", name: "Bello Musa", handle: "IronEagle#9941", amount: 10000, date: "Feb 17, 2026", status: "Reviewing" },
  { initials: "?", name: "Anonymous", handle: "Hidden", amount: 2000, date: "Feb 17, 2026", status: "-" },
  { initials: "YA", name: "Yemi Adesanya", handle: "GoldRiver#7721", amount: 1000, date: "Feb 16, 2026", status: "-" },
  { initials: "AO", name: "Adaeze Okeke", handle: "CoralWave#5534", amount: 500, date: "Feb 16, 2026", status: "Reviewing" },
  { initials: "SF", name: "Segun Fashola", handle: "BlueMoon#2287", amount: 2000, date: "Feb 15, 2026", status: "Approved" }
];

const withdrawals = [
  { id: "REQ-003", amount: 300000, date: "Feb 18, 2026", approvals: "2/3", status: "Reviewing" },
  { id: "REQ-002", amount: 150000, date: "Feb 10, 2026", approvals: "3/3", status: "Approved" },
  { id: "REQ-001", amount: 80000, date: "Jan 29, 2026", approvals: "3/3", status: "Released" }
];

type OwnerTab = "contributors" | "updates" | "withdrawals";

export default function ImpactCreatorPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<OwnerTab>("contributors");
  const raised = 670000;
  const target = 1000000;
  const progress = Math.round((raised / target) * 100);

  return (
    <section className="poolfi-content impact-owner-content">
      <AppTopbar
        title="My Impact Feed"
        subtitle="Creator Dashboard"
        ctaLabel="Request Withdrawal"
        ctaOnClick={() => setShowWithdrawModal(true)}
      />

      <section className="impact-owner-hero">
        <div className="impact-owner-hero-actions">
          <button
            type="button"
            className="impact-hero-btn ghost"
            onClick={() => navigator.clipboard.writeText("poolfi.app/impact/oguta-water")}
          >
            Share Link
          </button>
          <button type="button" className="impact-hero-btn" onClick={() => setShowUpdateModal(true)}>
            Post Update
          </button>
        </div>
        <p className="impact-owner-chip">Live - Verified</p>
        <h1>Clean Water Borehole for Oguta Community, Imo State</h1>
        <p className="impact-owner-meta">Created Jan 20, 2026 - Closes Mar 15, 2026 - Water & Sanitation</p>

        <div className="impact-owner-kpis">
          <article>
            <span>Total Raised</span>
            <h3>{toMoney(raised)}</h3>
            <p>of {toMoney(target)} target</p>
          </article>
          <article>
            <span>Contributors</span>
            <h3>342</h3>
            <p>total contributors</p>
          </article>
          <article>
            <span>Released</span>
            <h3>{toMoney(150000)}</h3>
            <p>1 approved withdrawal</p>
          </article>
          <article>
            <span>In Pool</span>
            <h3>{toMoney(470000)}</h3>
            <p>available to request</p>
          </article>
        </div>
      </section>

      <section className="impact-owner-grid">
        <div className="impact-owner-main">
          <article className="impact-owner-progress-card">
            <div className="title-row">
              <h2>{toMoney(raised)} raised</h2>
              <span className="mini-pill">{progress}% funded</span>
            </div>
            <div className="active-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-meta">
              <p>{toMoney(target - raised)} still needed to hit target</p>
              <p>Target: {toMoney(target)}</p>
            </div>
          </article>

          <article className="impact-owner-table">
            <div className="impact-owner-tabs">
              <button
                type="button"
                className={activeTab === "contributors" ? "active" : ""}
                onClick={() => setActiveTab("contributors")}
              >
                Contributors (342)
              </button>
              <button
                type="button"
                className={activeTab === "updates" ? "active" : ""}
                onClick={() => setActiveTab("updates")}
              >
                Updates (2)
              </button>
              <button
                type="button"
                className={activeTab === "withdrawals" ? "active" : ""}
                onClick={() => setActiveTab("withdrawals")}
              >
                Withdrawals
              </button>
            </div>
            {activeTab === "contributors" ? (
              <>
                <p className="impact-owner-count">Showing 342 contributors</p>
                <button type="button" className="impact-export-btn">Export CSV</button>

                <div className="impact-owner-head">
                  <span>Contributor</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Approver Status</span>
                </div>

                <ul>
                  {contributors.map((person) => (
                    <li key={`${person.name}-${person.date}`}>
                      <div className="person-main">
                        <span className="person-avatar blue">{person.initials}</span>
                        <div>
                          <h4>{person.name}</h4>
                          <p>{person.handle}</p>
                        </div>
                      </div>
                      <p className="impact-owner-amount">+{toMoney(person.amount)}</p>
                      <p className="person-time">{person.date}</p>
                      <span
                        className={`impact-owner-status ${
                          person.status === "Approved"
                            ? "approved"
                            : person.status === "Reviewing"
                              ? "reviewing"
                              : "idle"
                        }`}
                      >
                        {person.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {activeTab === "withdrawals" ? (
              <>
                <p className="impact-owner-count">Withdrawal history from creator end</p>
                <div className="impact-owner-head impact-owner-withdraw-head">
                  <span>Request ID</span>
                  <span>Amount</span>
                  <span>Submitted</span>
                  <span>Approvals</span>
                  <span>Status</span>
                </div>
                <ul className="impact-owner-withdraw-list">
                  {withdrawals.map((item) => (
                    <li key={item.id}>
                      <p className="impact-withdraw-id">{item.id}</p>
                      <p className="impact-owner-amount">{toMoney(item.amount)}</p>
                      <p className="person-time">{item.date}</p>
                      <p className="impact-withdraw-approvals">{item.approvals}</p>
                      <span
                        className={`impact-owner-status ${
                          item.status === "Approved" || item.status === "Released"
                            ? "approved"
                            : item.status === "Reviewing"
                              ? "reviewing"
                              : "idle"
                        }`}
                      >
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {activeTab === "updates" ? (
              <div className="impact-owner-updates-empty">
                <p>2 updates have been posted by the creator.</p>
                <button type="button" className="impact-hero-btn" onClick={() => setShowUpdateModal(true)}>
                  Post New Update
                </button>
              </div>
            ) : null}
          </article>
        </div>

        <aside className="impact-owner-side">
          <article className="side-card">
            <h4>Pool Details</h4>
            <div className="rule-list">
              <p><span>Status</span><strong>Live & Verified</strong></p>
              <p><span>Category</span><strong>Water & Sanitation</strong></p>
              <p><span>Chain</span><strong>0G Testnet</strong></p>
              <p><span>Approvers</span><strong>3 of 5 required</strong></p>
              <p><span>Deadline</span><strong>Mar 15, 2026</strong></p>
              <p><span>Anonymous</span><strong>Allowed</strong></p>
            </div>
          </article>

          <article className="impact-withdrawal-card">
            <h4>Active Withdrawal</h4>
            <p>Request #2 is awaiting community approval.</p>
            <h3>{toMoney(300000)}</h3>
            <div className="impact-owner-withdraw-progress">
              <span className="ok" />
              <span className="ok" />
              <span className="pending" />
            </div>
            <small>2 of 3 approvals received - waiting on 1 more</small>
          </article>

          <article className="side-card danger">
            <h4>Pool Controls</h4>
            <p>Closing your pool will stop new contributions and return locked funds to contributors.</p>
            <button type="button">Close Pool & Refund Contributors</button>
          </article>
        </aside>
      </section>

      {showWithdrawModal ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal withdrawal-modal">
            <h2>Request Withdrawal</h2>

            <div className="withdraw-help">
              Describe exactly what this withdrawal is for. PoolFi will randomly select contributors
              to review your request
            </div>

            <div className="withdraw-note">
              3 of 5 contributors will be randomly selected to approve this. You cannot choose who
              reviews it
            </div>

            <div className="withdraw-form">
              <label>
                Amount to withdraw (₦)
                <div className="withdraw-money">
                  <span>₦</span>
                  <input placeholder="400,000" />
                </div>
                <small>₦470,000 available in pool</small>
              </label>

              <label>
                Purpose
                <textarea placeholder="What exactly will this money be used for?" />
              </label>

              <label>
                Vendor/Recipient
                <input placeholder="e.g AquaTech NG Ltd - invoice #ATN-2026-0214" />
              </label>

              <label>
                Project Stage
                <input placeholder="e.g Phase 2 of 3 - Pump installation" />
              </label>

              <div className="impact-upload-box withdraw-upload">
                <Image
                  src="/images/camera-01.png"
                  alt="Upload"
                  width={46}
                  height={46}
                  className="impact-upload-icon"
                />
                <p>Upload photos or documents</p>
                <small>JPG, PNG, PDF. Max 5mb per file</small>
              </div>
            </div>

            <div className="withdraw-actions">
              <button type="button" className="modal-secondary" onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </button>
              <button type="button" className="modal-primary" onClick={() => setShowWithdrawModal(false)}>
                Submit Request -&gt;
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {showUpdateModal ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal update-modal">
            <h2>Post Update</h2>
            <p>Share progress with contributors. Updates are visible on the pool page.</p>

            <div className="withdraw-form">
              <label>
                Update Title
                <input placeholder="e.g Borehole drilling completed" />
              </label>
              <label>
                Update Details
                <textarea placeholder="Write the latest progress, what changed, and what is next." />
              </label>
              <label>
                Reference Link <span>optional</span>
                <input placeholder="e.g photo album, invoice, proof document link" />
              </label>
            </div>

            <div className="withdraw-actions">
              <button type="button" className="modal-secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>
              <button type="button" className="modal-primary" onClick={() => setShowUpdateModal(false)}>
                Publish Update -&gt;
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
