import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { beats, getBeat } from "@/data/store";
import { BrandArt } from "@/components/brand-art";
import { BeatCard } from "@/components/beat-card";
import { LicenseSelector } from "@/components/license-selector";
import { PreviewButton } from "@/components/preview-button";

export function generateStaticParams() { return beats.map((beat) => ({ slug: beat.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const beat = getBeat(slug);
  return beat ? { title: `${beat.title} — ${beat.genre} instrumental`, description: beat.description, openGraph: { title: `${beat.title} — CHEFBOYZ`, description: beat.description } } : {};
}
export default async function BeatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const beat = getBeat(slug); if (!beat) notFound();
  const related = beats.filter((entry) => entry.id !== beat.id && entry.genre === beat.genre).slice(0, 3);
  return <div className="page-wrap inner-page detail-page"><Link href="/beats" className="back-link"><ArrowLeft size={15} /> ALL BEATS</Link><div className="detail-layout"><div><BrandArt artwork={beat.artwork} label={beat.title} className="detail-art" /><div className="detail-facts"><div><span>STYLE</span><b>{beat.genre}</b></div><div><span>TEMPO</span><b>{beat.bpm} BPM</b></div><div><span>KEY</span><b>{beat.key}</b></div></div></div><div className="detail-copy"><span className="eyebrow">CHEFBOYZ PRODUCTION · {beat.genre.toUpperCase()}</span><h1>{beat.title}</h1><p className="detail-description">{beat.description}</p><div className="detail-tags">{beat.moods.map((mood) => <span key={mood}>{mood}</span>)}</div><PreviewButton beat={beat} /><div className="detail-divider" /><LicenseSelector beat={beat} /><div className="secure-note"><ShieldCheck size={16} /><span>Secure checkout will be available when payments are configured.</span></div></div></div>{related.length > 0 && <section className="section related-section"><div className="section-heading"><div><span className="eyebrow">SAME NEIGHBORHOOD</span><h2>Keep the session going.</h2></div><Link href="/beats" className="text-link">All beats <ArrowRight size={15} /></Link></div><div className="beat-grid">{related.map((entry, index) => <BeatCard key={entry.id} beat={entry} index={index} />)}</div></section>}</div>;
}
