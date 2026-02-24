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
  const [isLaunching, setIsLaunching] = useState(false);
  const [poolAddress, setPoolAddress] = useState("");
  const [txError, setTxError] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [invitees, setInvitees] = useState<string[]>([
    "john.doe@email.com",
    "classrep300@example.com"
  ]);
  const [form, setForm] = useState({
    name: "300L Class Dues",
    description: "Class dues for semester activities and welfare.",
    target: "400000",
    contribution: "1000",
    category: "Education",
    startDate: "2026-02-18",
    deadline: "2026-03-04"
  });

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const addInvitee = () => {
    const value = inviteInput.trim();
    if (!value) return;
    if (invitees.includes(value)) {
      setInviteInput("");
      return;
    }
    setInvitees((prev) => [...prev, value]);
    setInviteInput("");
  };

  const removeInvitee = (value: string) => {
    setInvitees((prev) => prev.filter((entry) => entry !== value));
  };

  const launchPool = async () => {
    try {
      setIsLaunching(true);
      setTxError("");
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
                onClick={() => {
                  setShowTypeModal(false);
                  if (poolKind === "impact") {
                    setPoolKind("goal");
                  }
                }}
              >
                {poolKind === "goal" ? "Continue to Goal Setup ->" : "Start with Goal Pool ->"}
              </button>
            </div>
            {poolKind === "impact" ? (
              <p className="pool-type-footnote">
                Impact Pool flow is next. For now, continue with Goal Pool (private invite-only).
              </p>
            ) : null}
          </section>
        </div>
      ) : null}

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
                  <h2>Pool Basics</h2>
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
                  <h2>Rules & Identity Fields</h2>
                  <p>Define how contributors pay and what information you need from them.</p>
                </div>
                <div className="cp-rules">
                  <h4 className="section-title">Invited Members</h4>
                  <div className="cp-invite-row">
                    <input
                      placeholder="Enter email or pseudonym"
                      value={inviteInput}
                      onChange={(event) => setInviteInput(event.target.value)}
                    />
                    <button type="button" className="cp-add-btn" onClick={addInvitee}>
                      Add
                    </button>
                  </div>
                  <div className="cp-pill-row">
                    {invitees.length > 0 ? (
                      invitees.map((invitee) => (
                        <span key={invitee} className="cp-invite-pill">
                          {invitee}
                          <button type="button" onClick={() => removeInvitee(invitee)}>
                            x
                          </button>
                        </span>
                      ))
                    ) : (
                      <span>No invitees yet</span>
                    )}
                  </div>

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
                      <strong>{form.name}</strong>
                    </div>
                    <div>
                      <small>Target</small>
                      <strong>{Number(form.target || "0").toLocaleString("en-US")}</strong>
                    </div>
                    <div>
                      <small>Per Person</small>
                      <strong>{Number(form.contribution || "0").toLocaleString("en-US")}</strong>
                    </div>
                    <div>
                      <small>Deadline</small>
                      <strong>{new Date(form.deadline).toDateString()}</strong>
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
                <div className="cp-summary">
                  <h4>Invited Members ({invitees.length})</h4>
                  <div className="cp-pill-row">
                    {invitees.slice(0, 4).map((invitee) => (
                      <span key={invitee}>{invitee}</span>
                    ))}
                    {invitees.length > 4 ? <span>+{invitees.length - 4} more</span> : null}
                  </div>
                </div>
                <p className="cp-note">
                  This Goal Pool is private and invite-only. Only invited members can
                  access the contribution page. Pool funds are secured by smart contract
                  and can only be released by you as admin.
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
            <h3>Live Preview</h3>
            <p>What contributors see</p>
            <article className="wizard-preview-card">
              <p className="preview-eyebrow">
                Goal Pool - Private - Invite Only
              </p>
              <h4>{form.name}</h4>
              <p>{form.description || "Add a description above"}</p>
              <div className="preview-metrics">
                <div>
                  <small>Target</small>
                  <strong>{toMoney(Number(form.target || "0"))}</strong>
                </div>
                <div>
                  <small>Per Person</small>
                  <strong>{toMoney(Number(form.contribution || "0"))}</strong>
                </div>
              </div>
              <div className="preview-note">
                Only invited members can access this pool link and contribute.
              </div>
            </article>
          </aside>
        </div>
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
    </>
  );
}
