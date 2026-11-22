import type { MetadataRoute } from "next";
import { beats, collections } from "@/data/store";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; return ["", "/beats", "/collections", "/about", "/contact", "/licensing"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })).concat(beats.map((beat) => ({ url: `${base}/beats/${beat.slug}`, lastModified: new Date(beat.createdAt) })), collections.map((collection) => ({ url: `${base}/collections/${collection.slug}`, lastModified: new Date() }))); }
