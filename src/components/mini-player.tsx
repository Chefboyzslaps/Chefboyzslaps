"use client";

import Link from "next/link";
import { Pause, Play, Volume2 } from "lucide-react";
import { useStore } from "@/components/store-provider";

export function MiniPlayer() {
  const { activeBeat, isPlaying, togglePlayback, currentTime, duration, seek } = useStore();
  if (!activeBeat) return null;
  const time = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
  return <div className="mini-player"><button className="player-play" onClick={() => togglePlayback(activeBeat)} aria-label={isPlaying ? "Pause preview" : "Play preview"}>{isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button><Link href={`/beats/${activeBeat.slug}`} className="player-track"><b>{activeBeat.title}</b><span>{activeBeat.bpm} BPM · {activeBeat.key}{!activeBeat.previewAudio && " · preview coming soon"}</span></Link><div className="player-progress"><input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} aria-label="Seek through audio preview" disabled={!duration} /><div><span>{time(currentTime)}</span><span>{duration ? time(duration) : "—:—"}</span></div></div><Volume2 size={17} className="player-volume" /></div>;
}
