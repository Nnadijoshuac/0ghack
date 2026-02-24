"use client";

import Image from "next/image";
import Link from "next/link";

type AppTopbarProps = {
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaOnClick?: (() => void) | undefined;
};

export default function AppTopbar({
  title,
  subtitle,
  ctaHref = "/app/create-pool",
  ctaLabel = "+ Create Pool",
  ctaOnClick
}: AppTopbarProps) {
  return (
    <header className="poolfi-topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <button type="button" className="icon-button" aria-label="Notifications">
          <Image
            src="/images/dashboard/notifications.png"
            alt="Notifications"
            width={18}
            height={18}
          />
        </button>
        <button type="button" className="icon-button" aria-label="Settings">
          <Image
            src="/images/dashboard/settings.png"
            alt="Settings"
            width={18}
            height={18}
          />
        </button>
        {ctaOnClick ? (
          <button type="button" className="create-pool-btn" onClick={ctaOnClick}>
            {ctaLabel}
          </button>
        ) : (
          <Link href={ctaHref} className="create-pool-btn">
            {ctaLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
