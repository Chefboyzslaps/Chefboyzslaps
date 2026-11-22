import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { CartDrawer } from "@/components/cart-drawer";
import { MiniPlayer } from "@/components/mini-player";

export function SiteShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main>{children}</main><footer className="site-footer"><Link href="/" className="footer-brand">CHEFBOYZ<span>®</span></Link><p>Made for the records that move culture.</p><div className="footer-links"><Link href="/licensing">Licensing</Link><Link href="/contact">Contact</Link><Link href="/about">About</Link></div><small>© {new Date().getFullYear()} CHEFBOYZ. All rights reserved.</small></footer><MiniPlayer /><CartDrawer /></>;
}
