"use client";

import { useTrackerStore } from "@/stores/tracker.store";
import { Play, Plus, Zap, CheckCircle2, Film, Tv, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function QuickContinueHub() {
  const { trackers, quickIncrementProgress } = useTrackerStore();

  // Filter active in-progress trackers
  const activeTrackers = trackers
    .filter((t) => t.status === "IN_PROGRESS" || t.status === "PLAN_TO_WATCH" || !t.status)
    .slice(0, 4);

  if (activeTrackers.length === 0) return null;

  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
        <Zap className="h-4 w-4 text-[var(--primary)] animate-bounce" /> Quick Continue Hub
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTrackers.map((t) => {
          const current = t.currentCount || 0;
          const target = t.targetCount || 100;
          const percent = Math.min(Math.round((current / target) * 100), 100);
          const typeName = t.trackerType?.name || "Series";

          const getUnitLabel = (name) => {
            if (name === "Series" || name === "Anime") return "Ep";
            if (name === "Book") return "Pg";
            if (name === "Course") return "Mod";
            return "Unit";
          };

          const unitLabel = getUnitLabel(typeName);

          return (
            <div
              key={t.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--surface)] to-[var(--card)] p-4 shadow-lg hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                    {typeName}
                  </span>
                  <span className="text-[10px] font-extrabold text-[var(--primary)]">
                    {percent}% Complete
                  </span>
                </div>

                <Link
                  href={`/trackers/${t.id}`}
                  className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 block"
                >
                  {t.title}
                </Link>

                {/* Live Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                    <span>
                      {unitLabel} {current} of {target}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick +1 Action */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)]">
                <Link
                  href={`/trackers/${t.id}`}
                  className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  View Timeline &rarr;
                </Link>

                <button
                  type="button"
                  onClick={() => quickIncrementProgress(t, 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-extrabold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                  title={`Add +1 ${unitLabel}`}
                >
                  <Plus className="h-3.5 w-3.5" /> +1 {unitLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
