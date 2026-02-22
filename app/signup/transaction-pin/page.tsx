"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function TransactionPinPage() {
  const pinRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handlePinChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const digit = input.value.replace(/\D/g, "").slice(-1);
    input.value = digit;

    if (!digit) return;

    pinRefs.current[index + 1]?.focus();
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
              Your PoolFi Balance
            </p>
            <h1>
              Your money.
              <br />
              <span className="highlight-together">Always yours.</span>
              <br />
              Just pooled.
            </h1>
            <p>
              Your balance stays visible at all times - available, locked in a
              pool, or total. You&apos;re always in control.
            </p>
          </div>
        </aside>

        <section className="pin-form-wrap">
          <header className="signup-header">
            <div className="step-dots pin-step" aria-hidden>
              <span />
              <span className="active" />
            </div>
            <p className="step-text">STEP 2 OF 2 - SETTING PIN</p>
            <h2>Set your transaction pin</h2>
            <p>Set a 4-digit transaction PIN</p>
          </header>

          <form className="pin-form">
            <div className="pin-row">
              <input
                type="password"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => {
                  pinRefs.current[0] = el;
                }}
                onChange={(event) => handlePinChange(0, event)}
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => {
                  pinRefs.current[1] = el;
                }}
                onChange={(event) => handlePinChange(1, event)}
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => {
                  pinRefs.current[2] = el;
                }}
                onChange={(event) => handlePinChange(2, event)}
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => {
                  pinRefs.current[3] = el;
                }}
                onChange={(event) => handlePinChange(3, event)}
              />
            </div>
            <p className="pin-note">
              Required before every contribution or withdrawal. Don&apos;t share it
              with anyone.
            </p>
            <Link href="/app" className="signup-submit">
              Continue <span aria-hidden>{"->"}</span>
            </Link>
          </form>

          <p className="skip-note">
            <Link href="/app">Skip for now, I&apos;ll set up later</Link>
          </p>
        </section>
      </section>
    </main>
  );
}
