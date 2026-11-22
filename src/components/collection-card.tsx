import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BeatCollection } from "@/types/store";
import { BrandArt } from "@/components/brand-art";

export function CollectionCard({ collection, number }: { collection: BeatCollection; number: string }) {
  return <Link href={`/collections/${collection.slug}`} className="collection-card">
    <BrandArt artwork={collection.artwork} label={collection.title} className="collection-art" />
    <div className="collection-card-copy"><span className="eyebrow">COLLECTION {number}</span><div><h3>{collection.title}</h3><ArrowUpRight size={21} /></div><p>{collection.description}</p></div>
  </Link>;
}
