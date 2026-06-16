"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/wallets",
    label: "Wallets",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const shortAddress = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : "Connected";

  return (
    <div className="dashboard-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${!sidebarOpen ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="16" cy="16" r="5" fill="white" />
            </svg>
          </div>
          <span className="sidebar-logo-text">CoinSight</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              title={!sidebarOpen ? item.label : undefined}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <span className="nav-item-icon" aria-hidden>{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-item btn-ghost"
            onClick={handleLogout}
            style={{ width: "100%" }}
            title={!sidebarOpen ? "Disconnect" : undefined}
            id="logout-btn"
          >
            <span className="nav-item-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="nav-item-label">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={`main-content ${!sidebarOpen ? "main-content--collapsed" : ""}`}>
        {/* Topbar */}
        <header className={`topbar ${!sidebarOpen ? "topbar--collapsed" : ""}`} role="banner">
          <div className="flex items-center gap-4">
            <button
              className="btn btn-ghost btn-icon"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              id="sidebar-toggle-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>

          <div className="topbar-actions">
            <div className="wallet-pill">
              <span className="wallet-dot" aria-hidden />
              <span>{shortAddress}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
