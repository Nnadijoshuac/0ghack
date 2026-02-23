import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
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

          <form className="login-form">
            <label className="login-input-group">
              Email Address or Phone Number
              <input type="text" placeholder="saven@email.com" />
            </label>
            <label className="login-input-group">
              Password
              <input type="password" placeholder="Enter Password" />
            </label>

            <div className="forgot-row">
              <button type="button">Forgot Password?</button>
            </div>

            <Link href="/app" className="login-submit">
              Sign In <span aria-hidden>{"->"}</span>
            </Link>
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
