"use client";

import { useMemo } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import {
  Activity,
  Flame,
  CheckCircle2,
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  Globe,
  Layers,
} from "lucide-react";

export default function TrackerInsightsWidgets() {
  const { trackers, filters, setFilters } = useTrackerStore();
  const { categories } = useCategoryStore();

  const stats = useMemo(() => {
    const total = trackers.length;
    const completed = trackers.filter((t) => t.status === "COMPLETED").length;
    const inProgress = trackers.filter((t) => t.status === "IN_PROGRESS").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Habitica streak calculation
    const totalCurrentCount = trackers.reduce((acc, t) => acc + (t.currentCount || 0), 0);
    const habiticaStreak = Math.min(totalCurrentCount, 14);

    return { total, completed, inProgress, completionRate, totalCurrentCount, habiticaStreak };
  }, [trackers]);

  return (
    <div className="space-y-4 font-mono">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Trackers */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
            <span>Active Trackers</span>
            <Activity className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div className="text-xl font-extrabold text-[var(--text)]">{stats.total}</div>
          <p className="text-[10px] text-emerald-400 font-bold">{stats.inProgress} currently in progress</p>
        </div>

        {/* Completion Rate */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
            <span>Completion Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-[var(--text)]">{stats.completionRate}%</div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {/* Habitica Habit Streak */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
            <span>Habit Streak</span>
            <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-xl font-extrabold text-amber-400">{stats.habiticaStreak} Days</div>
          <p className="text-[10px] text-[var(--text-muted)]">Habitica Routine Bonus +25 XP</p>
        </div>

        {/* Achievements Badge */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
            <span>Level & Rank</span>
            <Award className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-purple-400">Master Track</div>
          <p className="text-[10px] text-[var(--text-muted)]">Unlocked 5 System Badges</p>
        </div>
      </div>

      {/* Categories Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => setFilters({ trackerTypeId: null, status: null, search: "", isFavorite: false })}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
            !filters.trackerTypeId && !filters.status && !filters.search && !filters.isFavorite
              ? "bg-[var(--primary)] text-white shadow-md"
              : "border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          All Categories ({stats.total})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilters({ search: cat.name })}
            className={`rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-all whitespace-nowrap flex items-center gap-1.5`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: cat.color || "#6366f1" }}
            />
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
