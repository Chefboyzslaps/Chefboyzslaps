import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { collections, getCollection, getCollectionBeats } from "@/data/store";
import { BrandArt } from "@/components/brand-art";
import { BeatCard } from "@/components/beat-card";

export function generateStaticParams() { return collections.map((collection) => ({ slug: collection.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const collection = getCollection(slug); return collection ? { title: collection.title, description: collection.description } : {}; }
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const collection = getCollection(slug); if (!collection) notFound(); const items = getCollectionBeats(collection); return <div className="page-wrap inner-page"><Link href="/collections" className="back-link"><ArrowLeft size={15} /> ALL COLLECTIONS</Link><div className="collection-hero"><BrandArt artwork={collection.artwork} label={collection.title} className="collection-hero-art" /><div><span className="eyebrow">CHEFBOYZ COLLECTION · {items.length.toString().padStart(2, "0")} RECORDS</span><h1>{collection.title}<ArrowUpRight size={30} /></h1><p>{collection.description}</p></div></div><div className="beat-grid collection-beats">{items.map((beat, index) => <BeatCard key={beat.id} beat={beat} index={index} />)}</div></div>; }
