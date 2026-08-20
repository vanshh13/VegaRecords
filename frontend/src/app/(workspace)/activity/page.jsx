"use client";

import { useMemo, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useActivityStore } from "@/stores/activity.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Filter,
  CheckSquare,
  Activity as ActivityIcon,
  FileText,
  Bookmark,
  FolderTree,
  Zap,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ActivityPage() {
  const { activities, filter, setFilter, clearActivities } = useActivityStore();

  const getEntityIcon = (type) => {
    switch (type) {
      case "TASK":
        return <CheckSquare className="h-4 w-4 text-emerald-400" />;
      case "TRACKER":
        return <ActivityIcon className="h-4 w-4 text-amber-400" />;
      case "NOTE":
        return <FileText className="h-4 w-4 text-[#8b5cf6]" />;
      case "RESOURCE":
        return <Bookmark className="h-4 w-4 text-cyan-400" />;
      case "CATEGORY":
        return <FolderTree className="h-4 w-4 text-purple-400" />;
      default:
        return <Zap className="h-4 w-4 text-[var(--primary)]" />;
    }
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (filter === "ALL") return activities;
    return activities.filter((act) => act.entityType === filter);
  }, [activities, filter]);

  // Group by Time: Today, Yesterday, This Week, Earlier
  const groupedActivities = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const thisWeek = today - 86400000 * 7;

    const groups = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      Earlier: [],
    };

    filteredActivities.forEach((act) => {
      const actTime = new Date(act.timestamp).getTime();
      if (actTime >= today) {
        groups.Today.push(act);
      } else if (actTime >= yesterday) {
        groups.Yesterday.push(act);
      } else if (actTime >= thisWeek) {
        groups["This Week"].push(act);
      } else {
        groups.Earlier.push(act);
      }
    });

    return groups;
  }, [filteredActivities]);

  return (
    <MainLayout>
      <div className="space-y-6 font-mono">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
              <Clock className="h-3.5 w-3.5" /> Linear + GitHub Event Feed
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] tracking-tight">
              Activity Feed & Event Logs
            </h1>
            <p className="text-xs text-[var(--text-muted)] max-w-xl font-sans">
              Real-time audit log tracking task completions, note revisions, resource bookmarks, and tracker milestones across your personal OS.
            </p>
          </div>

          {activities.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all activity logs?")) clearActivities();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all self-start md:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Log History
            </button>
          )}
        </div>

        {/* Entity Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <span className="text-xs text-[var(--text-muted)] font-bold flex items-center gap-1.5 mr-2 shrink-0">
            <Filter className="h-3.5 w-3.5 text-[var(--primary)]" /> Filter Feed:
          </span>
          {[
            { label: "All Activity", value: "ALL" },
            { label: "Tasks", value: "TASK" },
            { label: "Trackers", value: "TRACKER" },
            { label: "Notes", value: "NOTE" },
            { label: "Resources", value: "RESOURCE" },
            { label: "Categories", value: "CATEGORY" },
          ].map((item) => {
            const isActive = filter === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] shadow-md"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Timeline Stream */}
        <div className="space-y-8 pt-2">
          {Object.entries(groupedActivities).map(([groupTitle, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-4">
                {/* Group Time Header */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[var(--primary)] tracking-wider">
                    <Calendar className="h-3.5 w-3.5" /> {groupTitle}
                  </span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">
                    {items.length} events
                  </span>
                </div>

                {/* Timeline Items List */}
                <div className="relative pl-6 border-l-2 border-[var(--border)] space-y-4 ml-3">
                  <AnimatePresence>
                    {items.map((act, index) => (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="relative group"
                      >
                        {/* Timeline Node Bullet Dot */}
                        <div className="absolute -left-[31px] top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--card)] text-[var(--primary)] shadow-md group-hover:scale-110 transition-transform">
                          {getEntityIcon(act.entityType)}
                        </div>

                        {/* Event Card */}
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg backdrop-blur-xl hover:border-[var(--primary)]/40 transition-all space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                              {act.title}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                                {act.entityType}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] font-sans">
                                {new Date(act.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          {act.description && (
                            <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed bg-[var(--card)] p-2.5 rounded-xl border border-[var(--border)]">
                              {act.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
              <Sparkles className="h-10 w-10 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--text)]">No Activity Found</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans max-w-sm mx-auto">
                No activity logs match the selected filter. Create tasks, write notes, or log trackers to record events.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
