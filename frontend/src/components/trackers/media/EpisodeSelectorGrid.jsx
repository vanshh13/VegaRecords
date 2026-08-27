"use client";

import { useState } from "react";
import { CheckCircle2, Play, ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { useTrackerStore } from "@/stores/tracker.store";

export default function EpisodeSelectorGrid({ tracker, unitLabel = "episodes" }) {
  const { setCustomProgressCount } = useTrackerStore();

  const shortUnit = (unitLabel || "episodes").toLowerCase().startsWith("ep") ? "Ep" : (unitLabel || "Unit");
  const fullUnit = unitLabel || "episodes";

  const currentCount = tracker?.currentCount || 0;
  const isOngoing = tracker?.isOngoing || tracker?.targetCount === 0;
  const maxTarget = (!isOngoing && tracker?.targetCount > 0)
    ? tracker.targetCount
    : Math.max(currentCount + 50, 100);

  const CHUNK_SIZE = 50;
  const totalChunks = Math.ceil(maxTarget / CHUNK_SIZE);

  // Default to the chunk containing the current episode
  const initialChunk = Math.min(Math.floor(Math.max(currentCount - 1, 0) / CHUNK_SIZE), totalChunks - 1);
  const [activeChunk, setActiveChunk] = useState(initialChunk >= 0 ? initialChunk : 0);

  const startEp = activeChunk * CHUNK_SIZE + 1;
  const endEp = Math.min((activeChunk + 1) * CHUNK_SIZE, maxTarget);

  const episodes = [];
  for (let i = startEp; i <= endEp; i++) {
    episodes.push(i);
  }

  const handleSelectEpisode = (epNum) => {
    setCustomProgressCount(tracker, epNum, `Marked ${fullUnit} ${epNum} as watched`);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg backdrop-blur-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2 capitalize">
            <Layers className="h-4 w-4 text-[var(--primary)]" />
            Interactive {fullUnit} Selector Grid
          </h3>
          <p className="text-[11px] text-[var(--text-muted)]">
            Click any episode button to quickly jump or toggle your watched progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Watched: {currentCount} {isOngoing ? "(Ongoing)" : `/ ${tracker.targetCount || "∞"}`}
          </span>
        </div>
      </div>

      {/* Range Pagination Tabs (e.g. 1-50, 51-100...) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveChunk((prev) => Math.max(prev - 1, 0))}
          disabled={activeChunk === 0}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] hover:border-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {Array.from({ length: totalChunks }).map((_, idx) => {
          const chunkStart = idx * CHUNK_SIZE + 1;
          const chunkEnd = Math.min((idx + 1) * CHUNK_SIZE, maxTarget);
          const isSelected = activeChunk === idx;
          const hasWatchedInChunk = currentCount >= chunkStart;

          return (
            <button
              key={idx}
              onClick={() => setActiveChunk(idx)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30 scale-105"
                  : hasWatchedInChunk
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/50"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
              }`}
            >
              {chunkStart} - {chunkEnd}
            </button>
          );
        })}

        <button
          onClick={() => setActiveChunk((prev) => Math.min(prev + 1, totalChunks - 1))}
          disabled={activeChunk >= totalChunks - 1}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] hover:border-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Episode Buttons Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
        {episodes.map((epNum) => {
          const isWatched = epNum <= currentCount;
          const isCurrentActive = epNum === currentCount;

          return (
            <button
              key={epNum}
              onClick={() => handleSelectEpisode(epNum)}
              title={`${shortUnit} ${epNum} ${isWatched ? "(Watched)" : "(Unwatched)"}`}
              className={`group relative flex flex-col items-center justify-center rounded-2xl p-2.5 text-xs font-black transition-all cursor-pointer border ${
                isCurrentActive
                  ? "border-amber-400 bg-gradient-to-b from-amber-500/30 to-amber-900/40 text-amber-200 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400 animate-pulse scale-105"
                  : isWatched
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400"
                  : "border-[var(--border)] bg-[var(--surface)]/60 text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--text)]"
              }`}
            >
              <div className="flex items-center gap-1">
                {isWatched ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                ) : (
                  <Play className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-opacity shrink-0" />
                )}
                <span>{epNum}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Currently watching: <strong className="text-[var(--text)]">{shortUnit} {currentCount}</strong>
        </span>
        <span>Showing range {startEp} to {endEp}</span>
      </div>
    </div>
  );
}
