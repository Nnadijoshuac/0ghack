"use client";

import { useState } from "react";
import { poolMembers, pools, toMoney, toPercent } from "@/lib/mock-data";

export default function PoolManagerPage() {
  const pool = pools[0];
  const [hasJoined, setHasJoined] = useState(false);

  return (
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
            <h3>{toMoney(pool.raised)}</h3>
            <p>of {toMoney(pool.target)} target</p>
          </article>
          <article>
            <span>Contributors</span>
            <h3>{pool.contributorsPaid}</h3>
            <p>of {pool.contributorsTotal} students</p>
          </article>
          <article>
            <span>Per Person</span>
            <h3>{toMoney(pool.contributionPerPerson)}</h3>
            <p>fixed contribution</p>
          </article>
          <article>
            <span>Status</span>
            <h3>{pool.deadlineText}</h3>
            <p>Closes Feb 23, 2026</p>
          </article>
        </div>
      </section>

      <section className="manager-grid">
        <div className="manager-main">
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

          <article className="contributors-card">
            <div className="contributors-head">
              <h3>Contributors</h3>
              <div className="contributors-stats">
                <span className="paid">{pool.contributorsPaid} Paid</span>
                <span className="pending">{pool.contributorsTotal - pool.contributorsPaid} Pending</span>
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
              {poolMembers.map((person) => (
                <li key={person.name}>
                  <div className="person-main">
                    <span className={`person-avatar ${person.avatarClass}`}>{person.initials}</span>
                    <div>
                      <h4>
                        {person.name} {person.you ? <span className="you-tag">You</span> : null}
                      </h4>
                      <p>{person.matric}</p>
                    </div>
                  </div>
                  <p className="person-time">{person.timeText}</p>
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
                    <strong>{toMoney(pool.contributionPerPerson)} (fixed)</strong>
                  </div>
                  <div>
                    <span>Admin</span>
                    <strong>{pool.admin}</strong>
                  </div>
                  <div>
                    <span>Deadline</span>
                    <strong>Feb 23, 2026</strong>
                  </div>
                  <div>
                    <span>Members so far</span>
                    <strong>{pool.contributorsPaid + 37} joined</strong>
                  </div>
                </div>
                <button type="button" className="join-later" onClick={() => setHasJoined(true)}>
                  Join Pool (Pay Later)
                </button>
                <button type="button" className="join-pay" onClick={() => setHasJoined(true)}>
                  Join and Pay Now - {toMoney(pool.contributionPerPerson)}
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
  );
}
