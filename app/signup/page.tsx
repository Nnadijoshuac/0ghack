"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, pseudonym, email, password })
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        return;
      }

      router.push("/signup/transaction-pin");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="login-layout">
        <aside className="login-visual">
          <div className="login-visual-overlay" />
          <div className="login-brand">
            <Image
              src="/images/logo.png"
              alt="PoolFi logo"
              width={176}
              height={44}
              className="brand-logo"
              priority
            />
          </div>
          <div className="login-copy">
            <p className="pill-tag">
              <span />
              Community-led finance
            </p>
            <h1>
              Pool money.
              <br />
              <span className="highlight-together">Together.</span>
              <br />
              Transparently.
            </h1>
            <p>
              No more WhatsApp treasurer drama. Create a pool, invite your
              people, track every contribution in real time.
            </p>
          </div>
        </aside>

        <section className="signup-form-wrap">
          <header className="signup-header">
            <div className="step-dots" aria-hidden>
              <span className="active" />
              <span />
            </div>
            <p className="step-text">STEP 1 OF 2</p>
            <h2>Create your account</h2>
            <p>Join thousands of communities already pooling with PoolFi.</p>
          </header>

          <div className="auth-toggle" role="tablist" aria-label="Auth tabs">
            <span className="auth-tab active" aria-current="page">
              Sign Up
            </span>
            <Link href="/login" className="auth-tab">
              Sign In
            </Link>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="two-col">
              <label className="signup-input-group">
                First Name
                <input type="text" placeholder="John" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </label>
              <label className="signup-input-group">
                Last Name
                <input type="text" placeholder="Doe" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </label>
            </div>

            <label className="signup-input-group">
              <span className="label-line">
                Choose your pseudonym
                <span className="label-muted"> - your public username on PoolFi</span>
              </span>
              <input type="text" placeholder="0xDegenDoe" value={pseudonym} onChange={(event) => setPseudonym(event.target.value)} />
            </label>
            <p className="field-note">3-20 characters - letters, numbers and underscores only - no spaces</p>

              <label className="signup-input-group">
                Email Address
              <input type="email" placeholder="john.doe@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>

            <label className="signup-input-group">
              Password
              <input type="password" placeholder="Min. 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Continue"} <span aria-hidden>{"->"}</span>
            </button>
          </form>

          <p className="wallet-auth-note">
            Wallet-based authentication will be enabled in the 0G backend integration phase.
          </p>

          <p className="signin-note">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>

          <p className="terms-note">
            By signing up you agree to PoolFi&apos;s <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>
          </p>
        </section>
      </section>
    </main>
  );
}
