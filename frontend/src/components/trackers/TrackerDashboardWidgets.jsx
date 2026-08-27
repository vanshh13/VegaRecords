"use client";

import { useTrackerStore } from "@/stores/tracker.store";
import { motion } from "framer-motion";
import {
  Activity,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Sparkles,
  Filter,
} from "lucide-react";

export default function TrackerDashboardWidgets() {
  const { trackers = [], setFilters, filters, openDrawer } = useTrackerStore();

  const totalCount = trackers.length;
  const activeCount = trackers.filter((t) => t.status === "IN_PROGRESS" || !t.status).length;
  const favoritesCount = trackers.filter((t) => t.isFavorite).length;
  const completedCount = trackers.filter(
    (t) => t.status === "COMPLETED" || (t.currentCount && t.targetCount && t.currentCount >= t.targetCount)
  ).length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const activeRate = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  const recentlyUpdated = [...trackers]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3);

  const isFilteredActive = filters.status === "IN_PROGRESS";
  const isFilteredFav = filters.isFavorite;
  const isFilteredCompleted = filters.status === "COMPLETED";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {/* Widget 1: Active Trackers */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => setFilters({ status: isFilteredActive ? null : "IN_PROGRESS" })}
        className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-md transition-all cursor-pointer overflow-hidden ${
          isFilteredActive
            ? "border-[var(--primary)] bg-[var(--card)] ring-2 ring-[var(--primary)]/30"
            : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 hover:shadow-lg"
        }`}
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-[var(--primary)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-ping" />
              Active Trackers
            </span>
            <div className="h-7 w-7 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-[var(--text)]">{activeCount}</span>
              <span className="text-[10px] text-[var(--text-muted)] ml-2 font-bold">In Progress</span>
            </div>
            <span className="text-[11px] font-extrabold text-[var(--primary)]">{activeRate}%</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
              style={{ width: `${activeRate}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Widget 2: Favorites & Pinned */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => setFilters({ isFavorite: !isFilteredFav })}
        className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-md transition-all cursor-pointer overflow-hidden ${
          isFilteredFav
            ? "border-amber-500/60 bg-[var(--card)] ring-2 ring-amber-500/30"
            : "border-[var(--border)] bg-[var(--card)] hover:border-amber-500/50 hover:shadow-lg"
        }`}
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              Favorites & Pinned
            </span>
            <div className="h-7 w-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400">{favoritesCount}</span>
              <span className="text-[10px] text-[var(--text-muted)] ml-2 font-bold">Pinned Media</span>
            </div>
            <span className="text-[11px] font-extrabold text-amber-400">★ High Priority</span>
          </div>

          {/* Micro Star Row */}
          <div className="flex items-center gap-1 pt-0.5">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                className={`h-3 w-3 ${
                  starIndex <= Math.min(favoritesCount, 5)
                    ? "fill-amber-400 text-amber-400"
                    : "text-[var(--border)]"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Widget 3: Completed Trackers */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => setFilters({ status: isFilteredCompleted ? null : "COMPLETED" })}
        className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-md transition-all cursor-pointer overflow-hidden ${
          isFilteredCompleted
            ? "border-emerald-500/60 bg-[var(--card)] ring-2 ring-emerald-500/30"
            : "border-[var(--border)] bg-[var(--card)] hover:border-emerald-500/50 hover:shadow-lg"
        }`}
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Completed Trackers
            </span>
            <div className="h-7 w-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-emerald-400">{completedCount}</span>
              <span className="text-[10px] text-[var(--text-muted)] ml-2 font-bold">Finished Goals</span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-400">{completionRate}% Done</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Widget 4: Recently Updated Activity */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md hover:border-cyan-500/50 hover:shadow-lg transition-all overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Recently Updated
            </span>
            <div className="h-7 w-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            {recentlyUpdated.length > 0 ? (
              recentlyUpdated.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawer(item);
                  }}
                  className="flex items-center justify-between text-[11px] font-bold text-[var(--text)] hover:text-cyan-400 cursor-pointer rounded-lg px-1.5 py-1 hover:bg-[var(--surface)] transition-all"
                >
                  <span className="truncate max-w-[130px]">{item.title}</span>
                  <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    {item.currentCount || 0}/{item.targetCount || "∞"}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-[var(--text-muted)] italic block py-2">No recent updates</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
