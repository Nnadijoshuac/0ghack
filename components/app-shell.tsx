"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MainNavItem = {
  label: string;
  icon: string;
  href: string;
  key: string;
  badge?: string;
};

const mainItems: MainNavItem[] = [
  { label: "Home", icon: "/images/dashboard/home.png", href: "/app", key: "home" },
  {
    label: "Create Pool",
    icon: "/images/dashboard/create-pool.png",
    href: "/app/create-pool",
    key: "create"
  },
  {
    label: "My Pools",
    icon: "/images/dashboard/my-pools.png",
    href: "/app/my-pools",
    key: "my-pools"
  },
  { label: "Impact", icon: "/images/dashboard/impact.png", href: "/app/impact", key: "impact" },
  { label: "My Wallet", icon: "/images/dashboard/wallet.png", href: "#", key: "wallet" }
];

const accountItems = [
  {
    label: "Notifications",
    icon: "/images/dashboard/notifications.png",
    href: "#",
    badge: "2",
    badgeRed: true
  },
  { label: "Settings", icon: "/images/dashboard/settings.png", href: "#" }
];

function getActiveKey(pathname: string) {
  if (pathname.startsWith("/app/create-pool")) return "create";
  if (pathname.startsWith("/app/pool-manager")) return "my-pools";
  if (pathname.startsWith("/app/impact")) return "impact";
  if (pathname.startsWith("/app/my-pools")) return "my-pools";
  return "home";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);
  const [poolCount, setPoolCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/pools", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { pools?: unknown[] }) => {
        if (!cancelled) setPoolCount(Array.isArray(data.pools) ? data.pools.length : 0);
      })
      .catch(() => {
        if (!cancelled) setPoolCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = useMemo(
    () =>
      mainItems.map((item) =>
        item.key === "my-pools" ? { ...item, badge: String(poolCount) } : item
      ),
    [poolCount]
  );

  return (
    <main className="poolfi-dashboard">
      <aside className="poolfi-sidebar">
        <div>
          <div className="poolfi-brand">
            <Image
              src="/images/dashboard/sidebar-logo.png"
              alt="PoolFi"
              width={112}
              height={48}
              className="sidebar-logo"
            />
          </div>

          <p className="nav-title">Main</p>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className={`nav-item${item.key === activeKey ? " active" : ""}`}
              >
                <span className="nav-icon-wrap">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </span>
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </Link>
            ))}
          </nav>

          <p className="nav-title">Account</p>
          <nav className="sidebar-nav">
            {accountItems.map((item) => (
              <Link href={item.href} key={item.label} className="nav-item">
                <span className="nav-icon-wrap">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </span>
                <span>{item.label}</span>
                {item.badge ? (
                  <span className={`nav-badge${item.badgeRed ? " red" : ""}`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">0G</div>
          <div>
            <p>0G User</p>
            <span>Builder</span>
          </div>
        </div>
      </aside>
      {children}
    </main>
  );
}
