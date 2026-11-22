"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { beats, collections } from "@/data/store";
import { BeatCard } from "@/components/beat-card";

export default function BeatsPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All styles");
  const [tempo, setTempo] = useState("Any tempo");
  const [key, setKey] = useState("Any key");
  const [mood, setMood] = useState("Any mood");
  const [collection, setCollection] = useState("All collections");
  const [sort, setSort] = useState("Featured");
  const genres = ["All styles", ...Array.from(new Set(beats.map((beat) => beat.genre)))];
  const keys = ["Any key", ...Array.from(new Set(beats.map((beat) => beat.key)))];
  const moods = ["Any mood", ...Array.from(new Set(beats.flatMap((beat) => beat.moods)))];
  const filtered = useMemo(() => {
    const result = beats.filter((beat) =>
      (genre === "All styles" || beat.genre === genre)
      && (key === "Any key" || beat.key === key)
      && (mood === "Any mood" || beat.moods.includes(mood))
      && (collection === "All collections" || beat.collectionIds.includes(collection))
      && (tempo === "Any tempo" || (tempo === "Under 90 BPM" ? beat.bpm < 90 : tempo === "90–109 BPM" ? beat.bpm >= 90 && beat.bpm < 110 : beat.bpm >= 110))
      && `${beat.title} ${beat.genre} ${beat.key} ${beat.moods.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Tempo: low to high") result.sort((a, b) => a.bpm - b.bpm);
    if (sort === "Tempo: high to low") result.sort((a, b) => b.bpm - a.bpm);
    if (sort === "Title A–Z") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [collection, genre, key, mood, query, sort, tempo]);
  function clearFilters() { setGenre("All styles"); setTempo("Any tempo"); setKey("Any key"); setMood("Any mood"); setCollection("All collections"); setQuery(""); }
  return <div className="page-wrap inner-page catalog-page"><div className="page-intro"><span className="eyebrow">THE BEAT STORE · {beats.length.toString().padStart(2, "0")} RECORDS</span><h1>Find your<br /><em>frequency.</em></h1><p>Every beat is a starting point. See where yours takes you.</p></div><div className="catalog-toolbar"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search beats, moods, keys…" aria-label="Search beats" /><kbd>⌘ K</kbd></label><div className="filter-controls"><label className="select-control"><SlidersHorizontal size={16} /><select value={genre} onChange={(event) => setGenre(event.target.value)} aria-label="Filter by style">{genres.map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-control"><span className="sr-only">Filter by tempo</span><select value={tempo} onChange={(event) => setTempo(event.target.value)} aria-label="Filter by tempo"><option>Any tempo</option><option>Under 90 BPM</option><option>90–109 BPM</option><option>110 BPM and up</option></select></label><label className="select-control"><span className="sr-only">Filter by key</span><select value={key} onChange={(event) => setKey(event.target.value)} aria-label="Filter by musical key">{keys.map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-control"><span className="sr-only">Filter by mood</span><select value={mood} onChange={(event) => setMood(event.target.value)} aria-label="Filter by mood">{moods.map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-control"><span className="sr-only">Filter by collection</span><select value={collection} onChange={(event) => setCollection(event.target.value)} aria-label="Filter by collection"><option value="All collections">All collections</option>{collections.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="select-control sort-control"><span className="eyebrow">SORT</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort beats"><option>Featured</option><option>Tempo: low to high</option><option>Tempo: high to low</option><option>Title A–Z</option></select></label></div></div><div className="catalog-result-line"><span>{filtered.length} {filtered.length === 1 ? "beat" : "beats"} found</span><span>PREVIEWS ARE PLACEHOLDERS</span></div>{filtered.length ? <div className="beat-grid">{filtered.map((beat, index) => <BeatCard key={beat.id} beat={beat} index={index} />)}</div> : <div className="empty-results"><h2>No records in this pocket.</h2><p>Try another search or style.</p><button className="text-link" onClick={clearFilters}>Clear filters</button></div>}</div>;
}
