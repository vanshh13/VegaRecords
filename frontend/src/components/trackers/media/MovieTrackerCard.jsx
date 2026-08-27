"use client";

import { motion } from "framer-motion";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";
import { Film, Star, CheckCircle2, Heart, Folder } from "lucide-react";

export default function MovieTrackerCard({ tracker, onSelect }) {
  const { updateStatus } = useTrackerStore();
  const { rating, creator, coverUrl } = extractMediaMetadata(tracker);
  const categoryName = tracker.category?.name || tracker.categoryName || (tracker.categories && tracker.categories[0]?.name);
  const isWatched = tracker.status === "COMPLETED";

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
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/80 px-3 py-1 text-[10px] font-extrabold text-rose-300 backdrop-blur-md">
            <Film className="h-3 w-3 text-rose-400" /> MOVIE
          </span>

          <div className="flex items-center gap-1.5">
            {categoryName && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-rose-200 backdrop-blur-md">
                <Folder className="h-3 w-3 text-rose-400" /> {categoryName}
              </span>
            )}
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-slate-950/80 px-2.5 py-1 text-[10px] font-black text-amber-400 backdrop-blur-md">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {rating}
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 p-2 rounded-full border border-rose-500/40 bg-rose-950/80 text-rose-400 backdrop-blur-md">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase tracking-wider">
            <span className="truncate max-w-[150px]">{creator}</span>
            <span>{isWatched ? "WATCHED" : "UNWATCHED"}</span>
          </div>

          <h3 className="text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-rose-400 transition-colors">
            {tracker.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
            isWatched
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
              : "border-slate-700 bg-slate-800 text-slate-400"
          }`}>
            {isWatched ? "WATCHED" : "PLAN TO WATCH"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStatus(tracker.id, isWatched ? "IN_PROGRESS" : "COMPLETED");
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition-all ${
              isWatched
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                : "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isWatched ? "Watched" : "Mark Watched"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
