"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { useAuth } from "@/components/auth-provider";
import { adminUids, firebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const links = [{ href: "/beats", label: "Beats" }, { href: "/collections", label: "Collections" }, { href: "/about", label: "About" }];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setCartOpen } = useStore();
  const { user } = useAuth();
  const isAdmin = Boolean(user && adminUids.includes(user.uid));
  return <header className="site-header">
    <div className="header-inner">
      <button className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Link href="/" className="wordmark" aria-label="CHEFBOYZ home">CHEFBOYZ<span>®</span></Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
        <Link className="mobile-nav-link" href="/licensing">Licensing</Link>
        {user ? (isAdmin ? <Link className="mobile-nav-link" href="/admin">Admin uploads</Link> : <button className="mobile-nav-link" onClick={() => firebaseAuth && signOut(firebaseAuth)}>Sign out</button>) : <Link className="mobile-nav-link" href="/sign-in">Sign in</Link>}
      </nav>
      <div className="header-actions"><Link className="licensing-link" href="/licensing">Licensing</Link>{user ? (isAdmin ? <Link className="account-link" href="/admin">Admin</Link> : <button className="account-link" onClick={() => firebaseAuth && signOut(firebaseAuth)}>Sign out</button>) : <Link className="account-link" href="/sign-in">Sign in</Link>}<button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}><ShoppingBag size={17} /><span>Bag</span><b>{cartCount.toString().padStart(2, "0")}</b></button></div>
    </div>
  </header>;
}
