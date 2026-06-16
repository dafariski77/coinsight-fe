"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { AddWalletPayload, ChainType } from "@/types";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: AddWalletPayload) => Promise<void>;
  isLoading?: boolean;
}

const CHAINS: ChainType[] = ["ETHEREUM", "POLYGON", "SOLANA"];

function isValidAddress(address: string, chain: ChainType): boolean {
  if (!address.trim()) return false;
  if (chain === "SOLANA") {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function AddWalletModal({ isOpen, onClose, onAdd, isLoading }: AddWalletModalProps) {
  const [address, setAddress] = useState("");
  const [chainType, setChainType] = useState<ChainType>("ETHEREUM");
  const [error, setError] = useState("");

  const valid = isValidAddress(address, chainType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError("Invalid address format for the selected chain.");
      return;
    }
    setError("");
    await onAdd({ address: address.trim(), chainType });
    setAddress("");
    onClose();
  };

  const handleClose = () => {
    setAddress("");
    setError("");
    onClose();
  };

  const placeholder =
    chainType === "SOLANA"
      ? "e.g. 7a1bXCnLJ2qY5VkHdX3tM8pRwN6sF4eGzT9uAcDvB2m"
      : "e.g. 0x742d35Cc6634C0532925a3b8D4C9C56b5a4b3456";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Wallet"
      id="add-wallet-modal"
      footer={
        <>
          <button className="btn btn-secondary" onClick={handleClose} type="button">
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!valid || isLoading}
            id="add-wallet-submit-btn"
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" />
                Adding…
              </>
            ) : (
              "Add Wallet"
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {/* Chain selector */}
        <div>
          <label htmlFor="chain-select" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Blockchain
          </label>
          <select
            id="chain-select"
            className="input select"
            value={chainType}
            onChange={(e) => { setChainType(e.target.value as ChainType); setAddress(""); setError(""); }}
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Address input */}
        <div>
          <label htmlFor="wallet-address-input" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Wallet Address
          </label>
          <input
            id="wallet-address-input"
            className="input"
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setError(""); }}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p style={{ fontSize: "12px", color: "var(--color-danger)", marginTop: "var(--space-2)" }}>
              {error}
            </p>
          )}
          {address && valid && (
            <p style={{ fontSize: "12px", color: "var(--color-success)", marginTop: "var(--space-2)" }}>
              ✓ Valid {chainType} address
            </p>
          )}
        </div>

        <div style={{ padding: "var(--space-3) var(--space-4)", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", fontSize: "12px", color: "var(--color-text-secondary)" }}>
          💡 After adding, sync will start automatically in the background. Data may take a few minutes to appear.
        </div>
      </form>
    </Modal>
  );
}
