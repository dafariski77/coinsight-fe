"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/ui.store";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore();
  const { clearWallets } = useWalletStore();
  const [connecting, setConnecting] = useState(false);
  const [userId, setUserId] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Since the backend has no auth endpoint, we use the wallet address directly
   * as the userId. The user types their Ethereum address to "connect".
   */
  const handleConnect = async () => {
    if (!inputVisible) {
      setInputVisible(true);
      return;
    }

    const trimmed = userId.trim();
    if (!trimmed) {
      setError("Please enter your wallet address.");
      return;
    }

    setConnecting(true);
    setError("");

    // Small UX delay to simulate connecting
    await new Promise((r) => setTimeout(r, 600));

    clearWallets();
    setAuth({
      id: trimmed,
      walletAddress: trimmed,
      createdAt: new Date().toISOString(),
    });

    router.push("/dashboard");
  };

  return (
    <div className="landing-bg">
      <div className="landing-glow-1" />
      <div className="landing-glow-2" />
      <div className="landing-grid" />

      <div className="landing-card">
        {/* Logo */}
        <div className="landing-logo" aria-hidden>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="16" cy="16" r="5" fill="white" />
          </svg>
        </div>

        <h1 className="landing-title">CoinSight</h1>
        <p className="landing-subtitle">
          Track your Web3 portfolio, transaction history, and PnL across multiple
          wallets and blockchains — in one beautiful dashboard.
        </p>

        {inputVisible && (
          <div style={{ marginBottom: "var(--space-4)", textAlign: "left" }}>
            <label htmlFor="user-id-input" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Your User ID / Wallet Address
            </label>
            <input
              id="user-id-input"
              className="input"
              type="text"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setError(""); }}
              placeholder="e.g. 0x742d35Cc... or a UUID"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            {error && (
              <p style={{ fontSize: "12px", color: "var(--color-danger)", marginTop: "var(--space-2)" }}>
                {error}
              </p>
            )}
            <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              Enter the same ID used when adding wallets to the backend.
            </p>
          </div>
        )}

        <button
          id="connect-wallet-btn"
          className="connect-btn"
          onClick={handleConnect}
          disabled={connecting}
          aria-label={inputVisible ? "Sign in with user ID" : "Connect wallet"}
        >
          {connecting ? (
            <>
              <span className="spinner spinner-sm" style={{ borderTopColor: "rgba(255,255,255,0.9)" }} />
              <span>Connecting…</span>
            </>
          ) : inputVisible ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Enter Dashboard
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.01 15.38c-3.23-7.15-9.64-9.64-16.01-7.38" />
                <path d="M15.38 20.01c-7.15-3.23-9.64-9.64-7.38-16.01" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Connect Wallet
            </>
          )}
        </button>

        <div className="feature-pills" style={{ marginTop: "var(--space-8)" }}>
          <span className="feature-pill">🔗 Multi-chain</span>
          <span className="feature-pill">📊 Real-time PnL</span>
          <span className="feature-pill">🔒 Non-custodial</span>
          <span className="feature-pill">⚡ Auto-sync</span>
        </div>

        <p style={{ marginTop: "var(--space-6)", fontSize: "11px", color: "var(--color-text-muted)" }}>
          Supports Ethereum · Polygon · Solana
        </p>
      </div>
    </div>
  );
}
