"use client";

import { motion } from "framer-motion";
import { useTrackerStore } from "@/stores/tracker.store";
import { Star, Plus, CheckCircle2, Folder } from "lucide-react";

export default function LibraryPosterGrid({ trackers, onSelect }) {
  const { quickIncrementProgress } = useTrackerStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 font-mono">
      {trackers.map((tracker) => {
        const coverUrl =
          tracker.coverImage ||
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
        const currentCount = tracker.currentCount || 0;
        const targetCount = tracker.targetCount || 100;
        const isDone = tracker.status === "COMPLETED" || currentCount >= targetCount;
        const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
        const categoryName = tracker.category?.name || tracker.categoryName || (tracker.categories && tracker.categories[0]?.name);

        return (
          <motion.div
            key={tracker.id}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect && onSelect(tracker)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:border-[var(--primary)]/50 transition-all cursor-pointer"
          >
            {/* Poster Aspect Ratio Frame */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
              <img
                src={coverUrl}
                alt={tracker.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
                }}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Type & Category Badge Top Left */}
              <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 max-w-[80%]">
                {categoryName && (
                  <span className="rounded-full border border-indigo-500/40 bg-indigo-950/80 px-2 py-0.5 text-[8px] font-black text-indigo-300 backdrop-blur-md uppercase flex items-center gap-0.5">
                    <Folder className="h-2.5 w-2.5" /> {categoryName}
                  </span>
                )}
                <span className="rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[8px] font-black text-white backdrop-blur-md uppercase">
                  {tracker.trackerType?.name || "MEDIA"}
                </span>
              </div>

              {/* Score Top Right */}
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-amber-500/40 bg-black/60 px-2 py-0.5 text-[8px] font-black text-amber-400 backdrop-blur-md">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> 8.8
              </div>

              {/* Hover Quick Increment Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs space-y-2 text-center">
                <h4 className="text-xs font-extrabold text-white line-clamp-2">{tracker.title}</h4>
                
                <span className="text-[10px] font-bold text-[var(--primary)]">
                  {currentCount} / {targetCount} ({progressPercent}%)
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    quickIncrementProgress(tracker, 1);
                  }}
                  disabled={isDone}
                  className="flex items-center gap-1 rounded-xl bg-[var(--primary)] px-3 py-1.5 text-[10px] font-extrabold text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isDone ? <CheckCircle2 className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {isDone ? "Done" : "+1 Progress"}
                </button>
              </div>

              {/* Bottom Info Bar inside Poster */}
              <div className="absolute bottom-2 left-2 right-2 group-hover:opacity-0 transition-opacity space-y-1">
                <h4 className="text-xs font-bold text-white line-clamp-1">{tracker.title}</h4>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
