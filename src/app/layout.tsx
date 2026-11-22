import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/components/store-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "CHEFBOYZ® — Beats made to make noise", template: "%s — CHEFBOYZ®" },
  description: "Independent production for independent voices. Find your next record in the CHEFBOYZ beat store.",
  openGraph: { type: "website", siteName: "CHEFBOYZ", title: "CHEFBOYZ® — Beats made to make noise", description: "Find your next record in the CHEFBOYZ beat store." },
  twitter: { card: "summary_large_image", title: "CHEFBOYZ® — Beats made to make noise", description: "Independent production for independent voices." },
};
export const viewport: Viewport = { themeColor: "#11110f", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><StoreProvider><SiteShell>{children}</SiteShell></StoreProvider></AuthProvider></body></html>;
}
