"use client";

import Link from "next/link";
import { ArrowUpRight, Pause, Play, Plus } from "lucide-react";
import type { Beat } from "@/types/store";
import { formatPrice } from "@/data/store";
import { BrandArt } from "@/components/brand-art";
import { useStore } from "@/components/store-provider";

export function BeatCard({ beat, index = 0 }: { beat: Beat; index?: number }) {
  const { activeBeat, isPlaying, togglePlayback, addToCart } = useStore();
  const playing = activeBeat?.id === beat.id && isPlaying;
  const price = beat.licenses.find((license) => license.available && license.price !== null)?.price ?? 0;
  return <article className="beat-card" style={{ animationDelay: `${index * 55}ms` }}>
    <div className="card-art-wrap"><Link href={`/beats/${beat.slug}`} aria-label={`View ${beat.title}`}><BrandArt artwork={beat.artwork} label={beat.title} className="card-art" /></Link><button className={`play-button ${playing ? "is-playing" : ""}`} onClick={() => togglePlayback(beat)} aria-label={`${playing ? "Pause" : "Play"} ${beat.title} preview`}>{playing ? <Pause fill="currentColor" size={17} /> : <Play fill="currentColor" size={17} />}</button><Link className="art-open" href={`/beats/${beat.slug}`} aria-label={`Open ${beat.title}`}><ArrowUpRight size={18} /></Link></div>
    <div className="beat-card-copy"><div className="beat-title-line"><Link href={`/beats/${beat.slug}`} className="beat-title">{beat.title}</Link><span>{formatPrice(price)}+</span></div><div className="beat-meta"><span>{beat.bpm} BPM</span><i /> <span>{beat.key}</span><i /> <span>{beat.genre}</span></div><button className="quick-add" onClick={() => addToCart(beat.id, "basic")} aria-label={`Add ${beat.title} basic lease to bag`}><Plus size={17} /></button></div>
  </article>;
}
