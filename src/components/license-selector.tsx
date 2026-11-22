"use client";

import { useState } from "react";
import { ArrowRight, Check, Info } from "lucide-react";
import type { Beat, LicenseId } from "@/types/store";
import { formatPrice } from "@/data/store";
import { useStore } from "@/components/store-provider";

export function LicenseSelector({ beat }: { beat: Beat }) {
  const [selected, setSelected] = useState<LicenseId>(beat.licenses.find((option) => option.available)?.id ?? "basic");
  const { addToCart } = useStore();
  const option = beat.licenses.find((entry) => entry.id === selected) ?? beat.licenses[0];
  return <div className="license-selector"><div className="license-head"><span className="eyebrow">CHOOSE YOUR LICENSE</span><span className="license-terms"><Info size={13} /> <a href="/licensing">License details</a></span></div><div className="license-options">{beat.licenses.map((license) => <button type="button" className={`license-option ${selected === license.id ? "is-selected" : ""} ${!license.available ? "is-unavailable" : ""}`} key={license.id} onClick={() => setSelected(license.id)} aria-pressed={selected === license.id}><span className="license-radio">{selected === license.id && <Check size={11} />}</span><span className="license-option-copy"><b>{license.name}</b><small>{license.summary}</small></span><strong>{license.price === null ? "Custom" : formatPrice(license.price)}</strong></button>)}</div><ul className="license-includes">{option.includes.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul><button className="button button-primary button-full" disabled={!option.available} onClick={() => addToCart(beat.id, selected)}>{option.available ? <>Add to bag <ArrowRight size={16} /></> : "Contact us for exclusive rights"}</button></div>;
}
