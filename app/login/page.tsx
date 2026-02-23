"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.push("/app");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
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

        <section className="login-form-wrap">
          <header className="login-header">
            <h2>Already a Diver?</h2>
            <p>Join thousands of communities already pooling with PoolFi.</p>
          </header>

          <div className="auth-toggle" role="tablist" aria-label="Auth tabs">
            <Link href="/signup" className="auth-tab">
              Sign Up
            </Link>
            <span className="auth-tab active" aria-current="page">
              Sign In
            </span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-input-group">
              Email Address
              <input
                type="email"
                placeholder="saven@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="login-input-group">
              Password
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="forgot-row">
              <button type="button">Forgot Password?</button>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"} <span aria-hidden>{"->"}</span>
            </button>
          </form>

          <p className="signup-note">
            New to PoolFi?{" "}
            <Link href="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
