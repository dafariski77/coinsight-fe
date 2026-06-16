import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "CoinSight — Web3 Portfolio & Transaction Tracker",
  description:
    "Track your crypto assets, portfolio performance, and transaction history across multiple wallets and blockchains in one unified dashboard.",
  keywords: "crypto, portfolio, web3, ethereum, solana, polygon, defi, tracker",
  openGraph: {
    title: "CoinSight — Web3 Portfolio Tracker",
    description: "360° visibility into your Web3 assets",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
