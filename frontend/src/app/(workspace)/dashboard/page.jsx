"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useTaskStore } from "@/stores/task.store";
import { useNoteStore } from "@/stores/note.store";
import { useResourceStore } from "@/stores/resource.store";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import { useActivityStore } from "@/stores/activity.store";
import { useSearchStore } from "@/stores/search.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  CheckSquare,
  Activity,
  FileText,
  Bookmark,
  FolderTree,
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  Zap,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Play,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { widgets, toggleWidget, resetLayout, isEditLayoutOpen, toggleEditLayout } = useDashboardStore();
  const { openCommandPalette } = useSearchStore();

  const { tasks, toggleTaskStatus, fetchTasks } = useTaskStore();
  const { notes, setSelectedNote, fetchNotes } = useNoteStore();
  const { resources, setSelectedResource, fetchResources } = useResourceStore();
  const { trackers, setSelectedTracker, fetchTrackers } = useTrackerStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { activities, fetchActivities } = useActivityStore();

  const [greeting, setGreeting] = useState("Good day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Backend Integration: Fetch real live data across all modules
    if (fetchTasks) fetchTasks();
    if (fetchNotes) fetchNotes();
    if (fetchResources) fetchResources();
    if (fetchTrackers) fetchTrackers();
    if (fetchCategories) fetchCategories();
    if (fetchActivities) fetchActivities();
  }, [fetchTasks, fetchNotes, fetchResources, fetchTrackers, fetchCategories, fetchActivities]);

  // Filter running trackers
  const activeTrackers = useMemo(
    () => trackers.filter((t) => t.status === "IN_PROGRESS" || t.status === "RUNNING" || (t.progress > 0 && t.progress < 100)),
    [trackers]
  );

  // Today's pending tasks
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.status !== "DONE" && t.status !== "COMPLETED").slice(0, 5),
    [tasks]
  );

  // Recent 4 activity events
  const recentActivities = useMemo(() => activities.slice(0, 4), [activities]);

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="space-y-8 font-mono">
        {/* Customization Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold">
            <Zap className="h-4 w-4 text-[var(--primary)] animate-pulse" /> Personal Operating System HUD
          </div>

          <button
            onClick={toggleEditLayout}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              isEditLayoutOpen
                ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Customize Layout
          </button>
        </div>

        {/* Layout Customizer Panel */}
        <AnimatePresence>
          {isEditLayoutOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-2xl border border-[var(--primary)]/40 bg-[var(--surface)] p-4 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                  Dashboard Widgets Toggle
                </span>
                <button
                  onClick={resetLayout}
                  className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-white font-bold"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Default Layout
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: "greeting", label: "Greeting Banner" },
                  { key: "quickActions", label: "Quick Actions" },
                  { key: "trackersContinue", label: "Continue Learning" },
                  { key: "todayTasks", label: "Today's Tasks" },
                  { key: "recentActivity", label: "Activity Feed" },
                  { key: "trackerSummary", label: "Tracker Summary" },
                  { key: "categoriesOverview", label: "Category Nodes" },
                ].map((item) => {
                  const isEnabled = widgets[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleWidget(item.key)}
                      className={`flex items-center justify-between rounded-xl border p-2 text-[11px] font-bold transition-all ${
                        isEnabled
                          ? "border-[var(--primary)]/40 bg-[var(--primary)]/15 text-white"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] opacity-60"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isEnabled && <Check className="h-3.5 w-3.5 text-[var(--primary)]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Personalized OS Greeting Header Banner */}
        {widgets.greeting && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                  <Flame className="h-3.5 w-3.5" /> Vega OS Active Workspace
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                  {greeting}{user?.firstName ? `, ${user.firstName}` : user?.username ? `, ${user.username}` : ""}! 👋
                </h1>
                <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-xl font-sans leading-relaxed">
                  Your workspace is synchronized. You have <span className="text-[var(--primary)] font-bold">{todayTasks.length} pending tasks</span> and <span className="text-amber-400 font-bold">{activeTrackers.length} active learning trackers</span> in progress today.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Global Search Command Trigger Bar */}
        <div className="relative">
          <button
            onClick={openCommandPalette}
            className="w-full flex items-center justify-between rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface)] px-5 py-4 text-xs md:text-sm text-[var(--text-muted)] hover:border-[var(--primary)] transition-all shadow-xl font-mono text-left group"
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-[var(--primary)] group-hover:scale-110 transition-transform" />
              <span className="text-[var(--text)] font-semibold">Search tasks, notes, trackers, resources...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-[var(--text-muted)]">Press</span>
              <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-bold text-[var(--primary)] shadow-sm">
                ⌘K
              </span>
            </div>
          </button>
        </div>

        {/* 3. Quick Actions Bar */}
        {widgets.quickActions && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "New Task", icon: CheckSquare, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", href: "/tasks" },
              { label: "Write Note", icon: FileText, color: "text-[#8b5cf6] border-[#8b5cf6]/30 bg-[#8b5cf6]/10", href: "/notes" },
              { label: "Bookmark Link", icon: Bookmark, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", href: "/resources" },
              { label: "Log Tracker", icon: Activity, color: "text-amber-400 border-amber-500/30 bg-amber-500/10", href: "/trackers" },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.label}
                  href={act.href}
                  className={`flex items-center justify-center gap-2.5 rounded-2xl border p-3.5 text-xs font-bold transition-all hover:scale-[1.02] shadow-md ${act.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{act.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* 4. Continue Learning / Trackers Section */}
        {widgets.trackersContinue && activeTrackers.length > 0 && (
          <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[var(--primary)]" /> Continue Learning & Projects
              </h2>
              <Link
                href="/trackers"
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                View Hub <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTrackers.slice(0, 3).map((tr) => (
                <div
                  key={tr.id}
                  onClick={() => {
                    setSelectedTracker(tr);
                    router.push("/trackers");
                  }}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/50 transition-all cursor-pointer space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-[var(--primary)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                      {tr.trackerTypeName || "TRACKER"}
                    </span>
                    <h3 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate mt-1">
                      {tr.title}
                    </h3>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-bold">
                      <span>Progress</span>
                      <span className="text-[var(--text)]">{tr.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--surface)] overflow-hidden border border-[var(--border)]">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
                        style={{ width: `${tr.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[var(--text-muted)] font-sans text-[10px]">
                      {tr.targetValue ? `Target: ${tr.targetValue}` : "Active"}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[var(--primary)] group-hover:translate-x-1 transition-transform">
                      Resume <Play className="h-3 w-3 fill-current" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Main 2-Column Grid: Tasks & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Tasks Widget */}
          {widgets.todayTasks && (
            <div className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-400" /> Today's Pending Tasks ({todayTasks.length})
                </h2>
                <Link
                  href="/tasks"
                  className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  Task Board <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {todayTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--text-muted)] font-sans space-y-1">
                    <Sparkles className="h-6 w-6 text-emerald-400 opacity-50 mx-auto" />
                    <p>All tasks completed for today!</p>
                  </div>
                ) : (
                  todayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 hover:border-[var(--primary)]/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-emerald-400 hover:text-emerald-400 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <div className="truncate">
                          <p className="text-xs font-bold text-[var(--text)] truncate">{t.title}</p>
                          <span className="text-[10px] text-[var(--text-muted)] font-sans">
                            {t.categoryName || "General Task"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          t.priority === "HIGH"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {t.priority || "NORMAL"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Recent Activity Widget */}
          {widgets.recentActivity && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--primary)]" /> Activity Stream
                </h2>
                <Link
                  href="/activity"
                  className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  Feed <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] mt-0.5">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5 truncate">
                      <p className="font-bold text-[var(--text)] truncate">{act.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-sans line-clamp-1">{act.description}</p>
                      <span className="text-[9px] text-[var(--text-muted)] block">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Lower Row Widgets: Tracker Summary & Category Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tracker Summary Card */}
          {widgets.trackerSummary && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" /> Tracker System Overview
                </h2>
                <Link href="/trackers" className="text-xs font-bold text-[var(--primary)] hover:underline">
                  Manage →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="text-2xl font-extrabold text-[var(--text)]">{trackers.length}</p>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1">Total Trackers</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="text-2xl font-extrabold text-[var(--primary)]">{activeTrackers.length}</p>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1">In Progress</p>
                </div>
              </div>
            </div>
          )}

          {/* Category Overview Card */}
          {widgets.categoriesOverview && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-purple-400" /> Workspace Hierarchy Nodes
                </h2>
                <Link href="/categories" className="text-xs font-bold text-[var(--primary)] hover:underline">
                  Explore →
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href="/categories"
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color || "#8b5cf6" }} />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
