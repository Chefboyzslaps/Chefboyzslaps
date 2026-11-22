import type { Metadata } from "next";
import { collections } from "@/data/store";
import { CollectionCard } from "@/components/collection-card";

export const metadata: Metadata = { title: "Collections", description: "Explore curated CHEFBOYZ beat collections." };
export default function CollectionsPage() { return <div className="page-wrap inner-page"><div className="page-intro"><span className="eyebrow">CURATED WITH INTENTION</span><h1>Find a world<br /><em>of your own.</em></h1><p>Different rooms, different moods. Every collection starts a new conversation.</p></div><div className="collection-grid collections-page-grid">{collections.map((collection, index) => <CollectionCard key={collection.id} collection={collection} number={`0${index + 1}`} />)}</div></div>; }
