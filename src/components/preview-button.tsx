"use client";

import { Pause, Play } from "lucide-react";
import type { Beat } from "@/types/store";
import { useStore } from "@/components/store-provider";

export function PreviewButton({ beat }: { beat: Beat }) {
  const { activeBeat, isPlaying, togglePlayback } = useStore();
  const playing = activeBeat?.id === beat.id && isPlaying;
  return <button className="preview-button" onClick={() => togglePlayback(beat)}><span>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</span><b>{playing ? "Pause preview" : "Play preview"}</b><small>{beat.previewAudio ? "LISTEN FIRST" : "PREVIEW COMING SOON"}</small></button>;
}
