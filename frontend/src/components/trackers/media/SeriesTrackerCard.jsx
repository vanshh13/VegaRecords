"use client";

import { motion } from "framer-motion";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";
import { Tv, Star, Plus, CheckCircle2, Layers } from "lucide-react";

export default function SeriesTrackerCard({ tracker, onSelect }) {
  const { quickIncrementProgress } = useTrackerStore();
  const { rating, creator, coverUrl, isOngoing, targetCount } = extractMediaMetadata(tracker);

  const currentEp = tracker.currentCount || 0;
  const targetEp = targetCount || tracker.targetCount || 0;
  const isInfinite = isOngoing || targetEp === 0;
  const isCompleted = !isInfinite && (currentEp >= targetEp || tracker.status === "COMPLETED");
  const progressPercent = isInfinite ? 100 : Math.min(100, Math.round((currentEp / Math.max(targetEp, 1)) * 100));

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect && onSelect(tracker)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md hover:shadow-xl hover:border-[var(--primary)]/50 transition-all cursor-pointer font-mono"
    >
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        <img
          src={coverUrl}
          alt={tracker.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/80 px-3 py-1 text-[10px] font-extrabold text-cyan-300 backdrop-blur-md">
            <Tv className="h-3 w-3 text-cyan-400" /> TV SERIES
          </span>

          <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-slate-950/80 px-2.5 py-1 text-[10px] font-black text-amber-400 backdrop-blur-md">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {rating}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="relative flex items-center justify-center h-11 w-11">
            <svg className="h-11 w-11 transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * progressPercent) / 100}
                className="text-cyan-400 transition-all duration-700 ease-out"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-white">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            <span className="truncate max-w-[140px]">{creator}</span>
            <span>{isCompleted ? "COMPLETED" : isInfinite ? `${currentEp} EPS (ONGOING)` : `${currentEp} / ${targetEp} EPS`}</span>
          </div>

          <h3 className="text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {tracker.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-cyan-400" /> {isInfinite ? `Ep ${currentEp} (Ongoing)` : `Ep ${currentEp} of ${targetEp}`}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              quickIncrementProgress(tracker, 1);
            }}
            disabled={isCompleted}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-extrabold text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Finished
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 text-cyan-400" /> +1 Episode
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
