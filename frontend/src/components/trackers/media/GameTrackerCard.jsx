"use client";

import { motion } from "framer-motion";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";
import { Gamepad2, Star, Plus, CheckCircle2, Trophy, Clock } from "lucide-react";

export default function GameTrackerCard({ tracker, onSelect }) {
  const { quickIncrementProgress } = useTrackerStore();
  const { rating, creator, coverUrl } = extractMediaMetadata(tracker);

  const currentHours = tracker.currentCount || 0;
  const totalHours = tracker.targetCount || 50;
  const isCompleted = currentHours >= totalHours || tracker.status === "COMPLETED";
  const progressPercent = Math.min(100, Math.round((currentHours / totalHours) * 100));

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect && onSelect(tracker)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md hover:shadow-xl hover:border-[var(--primary)]/50 transition-all cursor-pointer font-mono"
    >
      {/* Steam / Gaming Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        <img
          src={coverUrl}
          alt={tracker.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-950/80 px-3 py-1 text-[10px] font-extrabold text-purple-300 backdrop-blur-md">
            <Gamepad2 className="h-3 w-3 text-purple-400" /> GAME
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
                className="text-purple-400 transition-all duration-700 ease-out"
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
          <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold uppercase tracking-wider">
            <span className="truncate max-w-[140px]">{creator}</span>
            <span>{isCompleted ? "PLATINUM" : `${currentHours} / ${totalHours} HRS`}</span>
          </div>

          <h3 className="text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-purple-400 transition-colors">
            {tracker.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-purple-400" /> {currentHours}h played
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              quickIncrementProgress(tracker, 1);
            }}
            disabled={isCompleted}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 px-3 py-1.5 text-xs font-extrabold text-purple-300 hover:bg-purple-500/30 hover:border-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCompleted ? (
              <>
                <Trophy className="h-3.5 w-3.5 text-amber-400" /> Platinum
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 text-purple-400" /> +1 Hour
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
