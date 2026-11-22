import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { beats, collections } from "@/data/store";
import { BeatCard } from "@/components/beat-card";
import { CollectionCard } from "@/components/collection-card";
import { BrandArt } from "@/components/brand-art";
import { NewsletterForm } from "@/components/newsletter-form";

export default function HomePage() {
  return <>
    <section className="home-hero page-wrap"><div className="hero-copy"><span className="eyebrow hero-kicker"><i /> INDEPENDENT PRODUCTION · EST. 2016</span><h1>Beats made<br />to make <em>noise.</em></h1><p>For the ones with something to say. Find the sound, make the record, leave your mark.</p><div className="hero-actions"><Link className="button button-primary" href="/beats">Find your beat <ArrowRight size={16} /></Link><Link className="text-link" href="/about">Meet CHEFBOYZ <ArrowUpRight size={15} /></Link></div><div className="hero-scroll"><ArrowDown size={14} /><span>SCROLL TO EXPLORE</span></div></div><div className="hero-art-wrap"><BrandArt artwork="linear-gradient(130deg,#b17153,#43352a 45%,#151512 80%)" label="CHEFBOYZ record sleeve" className="hero-art" /><div className="hero-stamp">SOUND<br />WITH<br />INTENTION<span>CB—001</span></div><span className="hero-side-note">VOL. 01 &nbsp; / &nbsp; THE NEW STANDARD</span></div><span className="hero-index">01 — 04</span></section>
    <section className="ticker" aria-label="Brand statement"><div>MAKE SOMETHING THAT LASTS <i>✳</i> MAKE SOMETHING THAT LASTS <i>✳</i> MAKE SOMETHING THAT LASTS <i>✳</i></div></section>
    <section className="section page-wrap"><div className="section-heading"><div><span className="eyebrow">STRAIGHT FROM THE KITCHEN</span><h2>Fresh off<br className="mobile-break" /> the board.</h2></div><Link className="text-link" href="/beats">All beats <ArrowUpRight size={15} /></Link></div><div className="beat-grid">{beats.slice(0, 4).map((beat, index) => <BeatCard key={beat.id} beat={beat} index={index} />)}</div></section>
    <section className="section collections-section"><div className="page-wrap"><div className="section-heading"><div><span className="eyebrow">PICK YOUR LANE</span><h2>Worlds of their own.</h2></div><Link className="text-link" href="/collections">Explore collections <ArrowUpRight size={15} /></Link></div><div className="collection-grid">{collections.slice(0, 3).map((collection, index) => <CollectionCard key={collection.id} collection={collection} number={`0${index + 1}`} />)}</div></div></section>
    <section className="manifesto page-wrap"><div className="manifesto-rule"><span>THE CHEFBOYZ POINT OF VIEW</span><span>LOS ANGELES · EVERYWHERE</span></div><p>Good music makes space<br />for <em>something real.</em></p><div className="manifesto-bottom"><span>Two producers. One kitchen.<br />Built for the next record.</span><Link className="text-link" href="/about">Get to know us <ArrowUpRight size={15} /></Link></div></section>
    <section className="newsletter-band"><div className="page-wrap newsletter-inner"><div><span className="eyebrow">NOTES FROM THE KITCHEN</span><h2>Good things<br />come in <em>waves.</em></h2><p>New drops, collection notes, and the occasional ingredient. No filler.</p></div><NewsletterForm /></div></section>
    <section className="home-end page-wrap"><span>COOK SOMETHING DIFFERENT.</span><Link href="/beats">THE BEAT STORE <ArrowUpRight size={16} /></Link></section>
  </>;
}
