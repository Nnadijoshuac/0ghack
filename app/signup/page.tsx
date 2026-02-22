import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Get started</p>
          <h1>Create your Poolfin account</h1>
          <p className="muted">
            Set up your account to launch and contribute to collaborative
            funding pools.
          </p>
        </div>

        <form className="auth-form">
          <label className="input-group">
            Full name
            <input type="text" placeholder="Amina Cole" />
          </label>
          <label className="input-group">
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label className="input-group">
            Password
            <input type="password" placeholder="Create a strong password" />
          </label>
          <label className="input-group">
            Confirm password
            <input type="password" placeholder="Repeat your password" />
          </label>
          <label className="check">
            <input type="checkbox" />
            I agree to the terms and community guidelines
          </label>
          <Link href="/app" className="btn btn-primary">
            Create account
          </Link>
        </form>

        <p className="muted">
          Already have an account?{" "}
          <Link className="inline-link" href="/login">
            Log in
          </Link>
        </p>
      </section>

      <aside className="showcase-panel">
        <p className="eyebrow">Built for 0G era finance</p>
        <h2>Transparent impact pools, real-time contribution proofs.</h2>
        <ul className="metrics">
          <li>
            <span>2 min</span>
            Average pool setup time
          </li>
          <li>
            <span>35+</span>
            Supported goal templates
          </li>
          <li>
            <span>100%</span>
            Audit trail visibility
          </li>
        </ul>
      </aside>
    </main>
  );
}

