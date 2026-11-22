"use client";

import Link from "next/link";
import { ArrowRight, Minus, ShoppingBag, X } from "lucide-react";
import { beats, formatPrice } from "@/data/store";
import { useEffect, useRef } from "react";
import { useStore } from "@/components/store-provider";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart } = useStore();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!cartOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setCartOpen(false); return; }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [cartOpen, setCartOpen]);
  const lines = cart.map((item) => {
    const beat = beats.find((entry) => entry.id === item.beatId);
    const license = beat?.licenses.find((entry) => entry.id === item.licenseId);
    return { item, beat, license };
  }).filter((line) => line.beat && line.license);
  const subtotal = lines.reduce((sum, line) => sum + (line.license?.price ?? 0), 0);
  return <>
    <button aria-label="Close cart" className={`drawer-backdrop ${cartOpen ? "is-visible" : ""}`} onClick={() => setCartOpen(false)} tabIndex={cartOpen ? 0 : -1} />
    <aside ref={drawerRef} className={`cart-drawer ${cartOpen ? "is-open" : ""}`} aria-label="Shopping bag" role="dialog" aria-modal={cartOpen} aria-hidden={!cartOpen} inert={!cartOpen}>
      <div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Shopping bag <small>{cart.length.toString().padStart(2, "0")}</small></h2></div><button ref={closeButtonRef} className="icon-button" aria-label="Close shopping bag" onClick={() => setCartOpen(false)}><X /></button></div>
      {lines.length ? <><div className="cart-lines">{lines.map(({ item, beat, license }) => <div className="cart-line" key={`${item.beatId}-${item.licenseId}`}><div className="cart-line-art" style={{ background: beat?.artwork }} aria-hidden="true">CB</div><div className="cart-line-info"><b>{beat?.title}</b><span>{license?.name}</span><span>{license?.summary}</span></div><div className="cart-line-end"><b>{license?.price === null ? "Let’s talk" : formatPrice(license?.price ?? 0)}</b><button onClick={() => removeFromCart(item.beatId, item.licenseId)} aria-label={`Remove ${beat?.title}`}><Minus size={14} /> Remove</button></div></div>)}</div><div className="drawer-bottom"><div className="subtotal-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><p>Digital files are delivered after payment is verified. Checkout is being prepared.</p><button className="button button-primary button-full" disabled aria-disabled="true">Checkout coming soon <ArrowRight size={16} /></button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue shopping</button></div></> : <div className="empty-bag"><ShoppingBag size={26} /><h3>Your bag’s on mute.</h3><p>Find a sound that starts something.</p><Link className="button button-outline" href="/beats" onClick={() => setCartOpen(false)}>Explore the beats <ArrowRight size={15} /></Link></div>}
    </aside>
  </>;
}
