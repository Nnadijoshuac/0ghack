"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

type OwnerTab = "contributors" | "updates" | "withdrawals";

type CreatorPool = {
  id: string;
  name: string;
  category: string;
  description: string;
  target: number;
  raised: number;
  contributionPerPerson: number;
  updatesCount: number;
  withdrawalsCount: number;
  createdAtISO: string;
  updatedAtISO: string;
};

type WithdrawalRecord = {
  id: string;
  amount: number;
  purpose: string;
  vendor: string;
  stage: string;
  approvals: number;
  requiredApprovals: number;
  status: "PENDING" | "APPROVED" | "RELEASED" | "REJECTED";
  createdAtISO: string;
};

type UpdateRecord = {
  id: string;
  title: string;
  details: string;
  referenceLink?: string;
  createdAtISO: string;
};

export default function ImpactCreatorPage() {
  const searchParams = useSearchParams();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<OwnerTab>("contributors");
  const [pool, setPool] = useState<CreatorPool | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [updates, setUpdates] = useState<UpdateRecord[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    purpose: "",
    vendor: "",
    stage: ""
  });
  const [updateForm, setUpdateForm] = useState({
    title: "",
    details: "",
    referenceLink: ""
  });

  const poolIdQuery = searchParams.get("poolId") || "";

  const loadCreatorData = async () => {
    const q = poolIdQuery ? `?poolId=${encodeURIComponent(poolIdQuery)}` : "";
    const poolRes = await fetch(`/api/v1/impact/creator${q}`, { cache: "no-store" });
    const poolPayload = (await poolRes.json()) as { error?: string; pool?: CreatorPool | null };
    if (!poolRes.ok) throw new Error(poolPayload.error || "Failed to load creator pool");
    if (!poolPayload.pool) {
      setPool(null);
      setWithdrawals([]);
      setUpdates([]);
      return;
    }
    setPool(poolPayload.pool);

    const [withdrawRes, updateRes] = await Promise.all([
      fetch(`/api/v1/impact/${encodeURIComponent(poolPayload.pool.id)}/withdrawals`, { cache: "no-store" }),
      fetch(`/api/v1/impact/${encodeURIComponent(poolPayload.pool.id)}/updates`, { cache: "no-store" })
    ]);

    const withdrawPayload = (await withdrawRes.json()) as { withdrawals?: WithdrawalRecord[] };
    const updatePayload = (await updateRes.json()) as { updates?: UpdateRecord[] };
    setWithdrawals(Array.isArray(withdrawPayload.withdrawals) ? withdrawPayload.withdrawals : []);
    setUpdates(Array.isArray(updatePayload.updates) ? updatePayload.updates : []);
  };

  useEffect(() => {
    let cancelled = false;
    setError("");
    loadCreatorData().catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load creator page");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolIdQuery]);

  const raised = pool?.raised ?? 670000;
  const target = pool?.target ?? 1000000;
  const progress = useMemo(() => (target > 0 ? Math.round((raised / target) * 100) : 0), [raised, target]);

  const submitWithdrawal = async () => {
    if (!pool?.id) return;
    try {
      setIsSaving(true);
      setError("");
      const res = await fetch(`/api/v1/impact/${encodeURIComponent(pool.id)}/withdrawals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(withdrawForm.amount || 0),
          purpose: withdrawForm.purpose,
          vendor: withdrawForm.vendor,
          stage: withdrawForm.stage
        })
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Failed to submit withdrawal");
      setWithdrawForm({ amount: "", purpose: "", vendor: "", stage: "" });
      setShowWithdrawModal(false);
      await loadCreatorData();
      setActiveTab("withdrawals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit withdrawal");
    } finally {
      setIsSaving(false);
    }
  };

  const submitUpdate = async () => {
    if (!pool?.id) return;
    try {
      setIsSaving(true);
      setError("");
      const res = await fetch(`/api/v1/impact/${encodeURIComponent(pool.id)}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm)
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Failed to publish update");
      setUpdateForm({ title: "", details: "", referenceLink: "" });
      setShowUpdateModal(false);
      await loadCreatorData();
      setActiveTab("updates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish update");
    } finally {
      setIsSaving(false);
    }
  };

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
            onClick={() => navigator.clipboard.writeText(`poolfi.app/impact/${pool?.id ?? "pool"}`)}
          >
            Share Link
          </button>
          <button type="button" className="impact-hero-btn" onClick={() => setShowUpdateModal(true)}>
            Post Update
          </button>
        </div>
        <p className="impact-owner-chip">Live - Verified</p>
        <h1>{pool?.name || "Impact Pool"}</h1>
        <p className="impact-owner-meta">{pool?.category || "General"} - Creator View</p>

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
            <h3>{toMoney(withdrawals.filter((x) => x.status === "RELEASED").reduce((s, x) => s + x.amount, 0))}</h3>
            <p>released withdrawals</p>
          </article>
          <article>
            <span>In Pool</span>
            <h3>{toMoney(Math.max(0, raised - withdrawals.reduce((s, x) => s + x.amount, 0)))}</h3>
            <p>available to request</p>
          </article>
        </div>
      </section>

      {error ? <p className="cp-note">{error}</p> : null}

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
              <p>{toMoney(Math.max(0, target - raised))} still needed to hit target</p>
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
                Updates ({updates.length})
              </button>
              <button
                type="button"
                className={activeTab === "withdrawals" ? "active" : ""}
                onClick={() => setActiveTab("withdrawals")}
              >
                Withdrawals ({withdrawals.length})
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
                      <p className="person-time">{new Date(item.createdAtISO).toLocaleDateString()}</p>
                      <p className="impact-withdraw-approvals">
                        {item.approvals}/{item.requiredApprovals}
                      </p>
                      <span
                        className={`impact-owner-status ${
                          item.status === "APPROVED" || item.status === "RELEASED"
                            ? "approved"
                            : item.status === "PENDING"
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
                {updates.length === 0 ? <p>No updates yet.</p> : null}
                {updates.map((item) => (
                  <article key={item.id} className="cp-summary cp-summary-muted">
                    <h4>{item.title}</h4>
                    <p>{item.details}</p>
                  </article>
                ))}
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
              <p><span>Category</span><strong>{pool?.category || "General"}</strong></p>
              <p><span>Chain</span><strong>0G Testnet</strong></p>
              <p><span>Approvers</span><strong>3 of 5 required</strong></p>
              <p><span>Anonymous</span><strong>Allowed</strong></p>
            </div>
          </article>

          <article className="impact-withdrawal-card">
            <h4>Active Withdrawal</h4>
            <p>{withdrawals[0] ? `${withdrawals[0].id} is awaiting community approval.` : "No active request."}</p>
            <h3>{toMoney(withdrawals[0]?.amount ?? 0)}</h3>
            <div className="impact-owner-withdraw-progress">
              <span className="ok" />
              <span className={withdrawals[0]?.approvals && withdrawals[0].approvals > 1 ? "ok" : ""} />
              <span className="pending" />
            </div>
            <small>
              {withdrawals[0]
                ? `${withdrawals[0].approvals} of ${withdrawals[0].requiredApprovals} approvals received`
                : "No pending approval"}
            </small>
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
                Amount to withdraw (N)
                <div className="withdraw-money">
                  <span>N</span>
                  <input
                    placeholder="400,000"
                    value={withdrawForm.amount}
                    onChange={(event) => setWithdrawForm((prev) => ({ ...prev, amount: event.target.value.replace(/\D/g, "") }))}
                  />
                </div>
                <small>{toMoney(Math.max(0, raised - withdrawals.reduce((s, x) => s + x.amount, 0)))} available in pool</small>
              </label>

              <label>
                Purpose
                <textarea
                  placeholder="What exactly will this money be used for?"
                  value={withdrawForm.purpose}
                  onChange={(event) => setWithdrawForm((prev) => ({ ...prev, purpose: event.target.value }))}
                />
              </label>

              <label>
                Vendor/Recipient
                <input
                  placeholder="e.g AquaTech NG Ltd - invoice #ATN-2026-0214"
                  value={withdrawForm.vendor}
                  onChange={(event) => setWithdrawForm((prev) => ({ ...prev, vendor: event.target.value }))}
                />
              </label>

              <label>
                Project Stage
                <input
                  placeholder="e.g Phase 2 of 3 - Pump installation"
                  value={withdrawForm.stage}
                  onChange={(event) => setWithdrawForm((prev) => ({ ...prev, stage: event.target.value }))}
                />
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
              <button type="button" className="modal-primary" onClick={submitWithdrawal} disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit Request ->"}
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
                <input
                  placeholder="e.g Borehole drilling completed"
                  value={updateForm.title}
                  onChange={(event) => setUpdateForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </label>
              <label>
                Update Details
                <textarea
                  placeholder="Write the latest progress, what changed, and what is next."
                  value={updateForm.details}
                  onChange={(event) => setUpdateForm((prev) => ({ ...prev, details: event.target.value }))}
                />
              </label>
              <label>
                Reference Link <span>optional</span>
                <input
                  placeholder="e.g photo album, invoice, proof document link"
                  value={updateForm.referenceLink}
                  onChange={(event) => setUpdateForm((prev) => ({ ...prev, referenceLink: event.target.value }))}
                />
              </label>
            </div>

            <div className="withdraw-actions">
              <button type="button" className="modal-secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>
              <button type="button" className="modal-primary" onClick={submitUpdate} disabled={isSaving}>
                {isSaving ? "Publishing..." : "Publish Update ->"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
