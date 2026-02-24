"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGoalPoolOnChain } from "@/lib/backend/contracts";
import { toMoney } from "@/lib/backend/format";

type Step = 1 | 2 | 3;
type PoolKind = "goal" | "impact";

export default function CreatePoolPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [poolKind, setPoolKind] = useState<PoolKind>("goal");
  const [showTypeModal, setShowTypeModal] = useState(true);
  const [launched, setLaunched] = useState(false);
  const [impactSubmitted, setImpactSubmitted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [poolAddress, setPoolAddress] = useState("");
  const [txError, setTxError] = useState("");
  const [invitees] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    target: "",
    contribution: "",
    category: "",
    startDate: "",
    deadline: ""
  });
  const [impactForm, setImpactForm] = useState({
    title: "",
    problem: "",
    usage: "",
    location: "",
    beneficiaries: "",
    target: "",
    deadline: "",
    suggestedContribution: "",
    referenceLink: ""
  });

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const launchPool = async () => {
    try {
      setIsLaunching(true);
      setTxError("");

      if (
        !form.name.trim() ||
        !form.category.trim() ||
        !form.target.trim() ||
        !form.contribution.trim() ||
        !form.startDate ||
        !form.deadline
      ) {
        setTxError("Fill all required fields before launching.");
        return;
      }

      const startAt = Math.floor(new Date(form.startDate).getTime() / 1000);
      const deadline = Math.floor(new Date(form.deadline).getTime() / 1000);

      const result = await createGoalPoolOnChain({
        name: form.name,
        category: form.category,
        targetAmount: BigInt(form.target || "0"),
        contributionPerPerson: BigInt(form.contribution || "0"),
        startAt,
        deadline,
        metadataText: JSON.stringify({
          poolType: "goal",
          visibility: "private",
          inviteOnly: true,
          name: form.name,
          description: form.description,
          category: form.category,
          invitedMembers: invitees
        })
      });

      await fetch("/api/v1/pools/register-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: result.poolAddress,
          name: form.name,
          category: form.category,
          target: Number(form.target || 0),
          contributionPerPerson: Number(form.contribution || 0),
          invitedMembers: invitees
        })
      });

      setPoolAddress(result.poolAddress);
      localStorage.setItem("poolfi_last_pool_address", result.poolAddress);
      setLaunched(true);
    } catch (error) {
      setTxError(error instanceof Error ? error.message : "Failed to launch pool.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <>
      {showTypeModal ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal pool-type-modal">
            <div className="pool-type-head">
              <div>
                <h2>Create a Pool</h2>
                <p>
                  Choose the type of pool you want to create. You can always change
                  the details later.
                </p>
              </div>
              <button
                type="button"
                className="pool-type-close"
                aria-label="Close"
                onClick={() => router.push("/app")}
              >
                X
              </button>
            </div>

            <div className="pool-type-grid">
              <button
                type="button"
                className={`pool-type-card ${poolKind === "goal" ? "active" : ""}`}
                onClick={() => setPoolKind("goal")}
              >
                <span className="pool-type-icon">
                  <Image src="/images/my-pool.png" alt="Goal pool" width={28} height={28} />
                </span>
                <h3>Goal Pool</h3>
                <p>Private. Invite-only. For class dues, events, and group contributions.</p>
              </button>
              <button
                type="button"
                className={`pool-type-card ${poolKind === "impact" ? "active" : ""}`}
                onClick={() => setPoolKind("impact")}
              >
                <span className="pool-type-icon">
                  <Image src="/images/impact.png" alt="Impact pool" width={28} height={28} />
                </span>
                <h3>Impact Pool</h3>
                <p>Public. Community-verified. For causes, projects, and shared goals.</p>
              </button>
            </div>

            <div className="pool-type-actions">
              <button
                type="button"
                className="modal-primary"
                onClick={() => setShowTypeModal(false)}
              >
                Continue to Setup -&gt;
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section className="poolfi-content create-pool-content">
        <header className="create-pool-top">
          <Link href="/app" className="back-btn">
            &lt;
          </Link>
          <h1>{poolKind === "impact" ? "Create Impact Pool" : "Create Goal Pool"}</h1>
          <button type="button" className="wizard-preview">
            Preview
          </button>
        </header>

        {poolKind === "goal" ? (
          <>
        <div className="create-pool-steps">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`cp-step ${step === s ? "active" : step > s ? "done" : ""}`}>
              <span>{step > s ? "OK" : s}</span>
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
                  <h2 className="cp-head-title">
                    <Image
                      src="/images/poolbasics.png"
                      alt="Pool basics"
                      width={18}
                      height={18}
                    />
                    <span>Pool Basics</span>
                  </h2>
                  <p>
                    Tell us what this pool is for. Contributors will see these details
                    when they open your link.
                  </p>
                </div>
                <div className="cp-form">
                  <label>
                    Pool Name
                    <input
                      placeholder="e.g. 300L Class Dues - 2nd Semester"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Description <span>optional</span>
                    <textarea
                      placeholder="Briefly describe what this pool is for and how the money will be used..."
                      value={form.description}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                    />
                  </label>
                  <div className="cp-two">
                    <label>
                      Target Amount (₦)
                      <input
                        placeholder="400,000"
                        value={form.target}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            target: event.target.value.replace(/\D/g, "")
                          }))
                        }
                      />
                    </label>
                    <label>
                      Contribution Per Person (₦)
                      <input
                        placeholder="1,000"
                        value={form.contribution}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            contribution: event.target.value.replace(/\D/g, "")
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="cp-two">
                    <label>
                      Start Date
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, startDate: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Deadline
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, deadline: event.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <label>
                    Pool Category
                    <input
                      value={form.category}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                    />
                  </label>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <span className="cp-head-badge">?</span>
                    <span>Rules & Identity Fields</span>
                  </h2>
                  <p>Define how contributors pay and what information you need from them.</p>
                </div>
                <div className="cp-rules">
                  <h4 className="section-title">Payout Rules</h4>
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

                  <h4 className="section-title">Milestone Points</h4>
                  <div className="cp-list-item">
                    <span className="cp-list-pct">50%</span>
                    <span>First release - midpoint</span>
                    <button type="button" aria-label="Remove milestone">
                      ×
                    </button>
                  </div>
                  <div className="cp-list-item">
                    <span className="cp-list-pct">100%</span>
                    <span>Final release - pool closes</span>
                    <button type="button" aria-label="Remove milestone">
                      ×
                    </button>
                  </div>
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

                  <h4 className="section-title">Required Identity Fields</h4>
                  <div className="cp-pill-row">
                    <span>Full Name</span>
                    <span>Matric. No</span>
                    <span>Phone No</span>
                  </div>

                  <h4 className="section-title">Milestone Points</h4>
                  <div className="cp-list-item">
                    <span className="cp-list-pct">50%</span>
                    <span>Full Name</span>
                    <button type="button" aria-label="Remove field">
                      ×
                    </button>
                  </div>
                  <div className="cp-list-item">
                    <span className="cp-list-pct">100%</span>
                    <span>Matric. No</span>
                    <button type="button" aria-label="Remove field">
                      ×
                    </button>
                  </div>
                  <button type="button" className="cp-dashed-btn">
                    + Add Custom Field
                  </button>
                  <p className="cp-rules-note">
                    Choose what contributors must provide. These appear on your CSV report.
                    Select from presets or add custom fields.
                  </p>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <span className="cp-head-badge">🚀</span>
                    <span>Review & Launch</span>
                  </h2>
                  <p>Everything looks good. Launch your pool and share the link.</p>
                </div>
                <div className="cp-review-wrap">
                  <div className="cp-summary cp-summary-muted">
                    <h4>Pool Summary</h4>
                    <div className="cp-summary-grid">
                      <div>
                        <small>Pool Name</small>
                        <strong>{form.name || "300L Class Dues"}</strong>
                      </div>
                      <div>
                        <small>Target</small>
                        <strong>{Number(form.target || "400000").toLocaleString("en-US")}</strong>
                      </div>
                      <div>
                        <small>per person</small>
                        <strong>{Number(form.contribution || "1000").toLocaleString("en-US")}</strong>
                      </div>
                      <div>
                        <small>Deadline</small>
                        <strong>
                          {form.deadline
                            ? new Date(form.deadline).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                            : "7 Mar 2026"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="cp-summary cp-summary-muted">
                    <h4>Identity Fields</h4>
                    <div className="cp-pill-row">
                      <span>Full Name</span>
                      <span>Matric. No</span>
                    </div>
                  </div>
                </div>
                <p className="cp-note">
                  Once launched, your pool will be deployed on the 0G network. Contributions are
                  secured by smart contract and can only be released by you as the admin.
                </p>
                {txError ? <p className="cp-note">{txError}</p> : null}
              </>
            ) : null}

            <div className="cp-actions">
              <button type="button" className="modal-secondary" onClick={step === 1 ? undefined : prevStep}>
                {step === 1 ? "Cancel" : "< Back"}
              </button>
              <button
                type="button"
                className="modal-primary"
                onClick={step === 3 ? launchPool : nextStep}
                disabled={isLaunching}
              >
                {step === 1
                  ? "Continue to Rules ->"
                  : step === 2
                    ? "Review Pool ->"
                    : isLaunching
                      ? "Launching..."
                      : "Launch Pool ->"}
              </button>
            </div>
          </article>

          <aside className="cp-preview">
            <div className="cp-preview-head">
              <h3>Live Preview</h3>
              <p>What contributors see</p>
            </div>
            <article className="wizard-preview-card">
              <div className="preview-top">
                <p className="preview-eyebrow">
                  {poolKind === "impact" ? "Impact Pool - Public" : "Goal Pool - Private"}
                </p>
                <h4>{form.name || "Your pool name..."}</h4>
                <p className="preview-desc">{form.description || "Add a description above"}</p>
              </div>

              <div className="preview-body">
                <div className="preview-metrics">
                  <div>
                    <small>Target</small>
                    <strong>{form.target ? toMoney(Number(form.target)) : "₦-"}</strong>
                  </div>
                  <div>
                    <small>Per Person</small>
                    <strong>{form.contribution ? toMoney(Number(form.contribution)) : "₦-"}</strong>
                  </div>
                </div>

                <div className="preview-progress-line" />
                <p className="preview-meta-line">
                  <span>₦0 raised</span>
                  <span>0%</span>
                </p>

                <h5 className="preview-required">Required Info</h5>
                <div className="preview-required-list">
                  <span>👤 Full Name</span>
                  <span>🎓 Matric No.</span>
                </div>
              </div>
            </article>
            <div className="preview-note">
              The live preview updates as you fill in details. This is exactly what contributors
              see when they open your pool link.
            </div>
          </aside>
        </div>
          </>
        ) : (
          <div className="impact-create-grid">
            <div className="impact-create-main">
              <section className="impact-how">
                <h4>How Vetting works</h4>
                <ol>
                  <li>You submit your pool with cause details and supporting evidence</li>
                  <li>PoolFi reviews within 24-48 hours</li>
                  <li>Approved pools go live on the explore feed</li>
                  <li>Withdrawals require community multi-sig approval</li>
                </ol>
              </section>

              <article className="cp-main-card impact-card">
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <Image src="/images/poolbasics.png" alt="Pool basics" width={18} height={18} />
                    <span>Pool Basics</span>
                  </h2>
                  <p>Tell us what this pool is for. Contributors will see these details when they open your link.</p>
                </div>
                <div className="cp-form">
                  <label>
                    Pool Title
                    <input
                      placeholder="e.g clean water borehole for oguta community"
                      value={impactForm.title}
                      onChange={(event) => setImpactForm((prev) => ({ ...prev, title: event.target.value }))}
                    />
                  </label>
                  <label>
                    Describe a problem
                    <textarea
                      placeholder="What problem are you solving? who does it affect? Be specific - contributors need to understand why this matters"
                      value={impactForm.problem}
                      onChange={(event) => setImpactForm((prev) => ({ ...prev, problem: event.target.value }))}
                    />
                  </label>
                  <label>
                    How will the money be used?
                    <textarea
                      placeholder="Break down how funds will be spent. e.g 400k - go for borehole drilling"
                      value={impactForm.usage}
                      onChange={(event) => setImpactForm((prev) => ({ ...prev, usage: event.target.value }))}
                    />
                  </label>
                  <label>
                    Location/community
                    <input
                      placeholder="e.g oguta, imo state, Nigeria"
                      value={impactForm.location}
                      onChange={(event) => setImpactForm((prev) => ({ ...prev, location: event.target.value }))}
                    />
                  </label>
                  <label>
                    Who benefits?
                    <input
                      placeholder="e.g 3000+ residents of oguta community"
                      value={impactForm.beneficiaries}
                      onChange={(event) =>
                        setImpactForm((prev) => ({ ...prev, beneficiaries: event.target.value }))
                      }
                    />
                  </label>
                </div>
              </article>

              <article className="cp-main-card impact-card">
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <span className="cp-head-badge">💰</span>
                    <span>Funding Details</span>
                  </h2>
                  <p>Set your target and timeline. Contributions are open to everyone.</p>
                </div>
                <div className="cp-form">
                  <div className="cp-two">
                    <label>
                      Funding Target (₦)
                      <input
                        placeholder="400,000"
                        value={impactForm.target}
                        onChange={(event) =>
                          setImpactForm((prev) => ({
                            ...prev,
                            target: event.target.value.replace(/\D/g, "")
                          }))
                        }
                      />
                    </label>
                    <label>
                      Deadline
                      <input
                        type="date"
                        value={impactForm.deadline}
                        onChange={(event) => setImpactForm((prev) => ({ ...prev, deadline: event.target.value }))}
                      />
                    </label>
                  </div>
                  <label>
                    Suggested Contribution (₦) <span>optional</span>
                    <input
                      placeholder="e.g 2,000 - contributors can give any amount"
                      value={impactForm.suggestedContribution}
                      onChange={(event) =>
                        setImpactForm((prev) => ({
                          ...prev,
                          suggestedContribution: event.target.value.replace(/\D/g, "")
                        }))
                      }
                    />
                  </label>
                </div>
              </article>

              <article className="cp-main-card impact-card">
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <span className="cp-head-badge">🔐</span>
                    <span>Withdrawal Governance</span>
                  </h2>
                  <p>Impact pools use community multi-sig for all withdrawals.</p>
                </div>
                <div className="cp-form">
                  <div className="cp-note">
                    <strong>How Multi-Sig Works on PoolFi</strong>
                    <br />
                    When you request a withdrawal, PoolFi randomly selects contributors from your pool to review and
                    approve the request.
                  </div>
                  <label>
                    Approvers Required per Withdrawal
                    <input value="3 of 5 randomly selected contributors" disabled />
                  </label>
                </div>
              </article>

              <article className="cp-main-card impact-card">
                <div className="cp-head">
                  <h2 className="cp-head-title">
                    <span className="cp-head-badge">
                      <Image
                        src="/images/supporting evidence.png"
                        alt="Supporting evidence"
                        width={14}
                        height={14}
                      />
                    </span>
                    <span>Supporting Evidence</span>
                  </h2>
                  <p>Verified pools get more contributions. Upload proof of the problem.</p>
                </div>
                <div className="cp-form">
                  <div className="impact-upload-box">
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
                  <label>
                    Reference Link <span>optional</span>
                    <input
                      placeholder="e.g news article, community letter, social media posts"
                      value={impactForm.referenceLink}
                      onChange={(event) => setImpactForm((prev) => ({ ...prev, referenceLink: event.target.value }))}
                    />
                  </label>
                </div>
                <div className="cp-actions impact-actions">
                  <button type="button" className="modal-secondary" onClick={() => router.push("/app/impact")}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="modal-primary"
                    onClick={() => setImpactSubmitted(true)}
                  >
                    Submit for Review -&gt;
                  </button>
                </div>
              </article>
            </div>

            <aside className="cp-preview impact-preview">
              <div className="cp-preview-head">
                <h3>Live Preview</h3>
                <p>What contributors see</p>
              </div>
              <article className="wizard-preview-card">
                <div className="preview-top">
                  <p className="preview-eyebrow">Impact Pool - Public</p>
                  <h4>{impactForm.title || "Your pool title..."}</h4>
                  <p className="preview-desc">{impactForm.problem || "Add a description above"}</p>
                </div>
                <div className="preview-body">
                  <div className="preview-progress-line" />
                  <p className="preview-meta-line">
                    <span>₦0 raised</span>
                    <span>0%</span>
                  </p>
                  <div className="preview-metrics">
                    <div>
                      <small>Target</small>
                      <strong>{impactForm.target ? toMoney(Number(impactForm.target)) : "₦-"}</strong>
                    </div>
                    <div>
                      <small>Approvers</small>
                      <strong>3 of 5</strong>
                    </div>
                  </div>
                </div>
              </article>
              <div className="preview-note">
                After submission, PoolFi reviews your pool within 24-48 hours. Approved pools appear on the explore
                feed and can be shared publicly.
              </div>
            </aside>
          </div>
        )}
      </section>

      {launched ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal launch-modal">
            <div className="launch-icon">POOL</div>
            <h2>Pool Launched</h2>
            <p>Your pool is live and ready to collect contributions.</p>
            {poolAddress ? (
              <p>
                Pool address: <strong>{poolAddress}</strong>
              </p>
            ) : null}
            <div className="launch-actions">
              <Link className="modal-primary" href="/app">
                Go to Dashboard
              </Link>
            </div>
          </section>
        </div>
      ) : null}

      {impactSubmitted ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <section className="pool-modal impact-review-modal">
            <div className="impact-review-icon">📄</div>
            <h2>Submitted for Review</h2>
            <p>
              Your impact pool has been submitted. Here is what happens next while you wait.
            </p>

            <div className="impact-review-list">
              <div className="impact-review-item">
                <span>Pool Successfully Submitted</span>
                <em className="done">Done</em>
              </div>
              <div className="impact-review-item">
                <span>PoolFi review (24-48 hrs)</span>
                <em className="pending">Pending</em>
              </div>
              <div className="impact-review-item">
                <span>Pool goes live on explore feed</span>
                <em className="waiting">Waiting</em>
              </div>
              <div className="impact-review-item">
                <span>Share link sent to your account</span>
                <em className="waiting">Waiting</em>
              </div>
            </div>

            <div className="impact-review-actions">
              <button
                type="button"
                className="modal-primary"
                onClick={() => {
                  setImpactSubmitted(false);
                  router.push("/app/my-pools");
                }}
              >
                Back to My Pools -&gt;
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}


