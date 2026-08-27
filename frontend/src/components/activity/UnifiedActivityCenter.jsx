"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useNotificationStore } from "@/stores/notification.store";
import { useActivityStore } from "@/stores/activity.store";
import { wsClient } from "@/utils/websocketClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Flame,
  Activity as ActivityIcon,
  Shield,
  ArrowUpRight,
  Sparkles,
  Search,
  CheckSquare,
  FileText,
  Bookmark,
  FolderTree,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Layers,
  Inbox,
  ListFilter,
} from "lucide-react";

export default function UnifiedActivityCenter({ defaultView = "ALL" }) {
  const [activeTab, setActiveTab] = useState(defaultView); // 'ALL' | 'NOTIFICATIONS' | 'ACTIVITY'
  const [setFilter, setSetFilter] = useState("ALL"); // 'ALL' | 'TASK' | 'TRACKER' | 'NOTE' | 'RESOURCE' | 'CATEGORY'
  const [levelFilter, setLevelFilter] = useState("ALL"); // 'ALL' | 'CRITICAL' | 'MILESTONE' | 'REMINDER' | 'SUCCESS' | 'HIGH_PRIORITY'
  const [searchQuery, setSearchQuery] = useState("");

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll: clearNotifications,
  } = useNotificationStore();

  const {
    activities,
    clearActivities,
  } = useActivityStore();

  // Connect to WebSocket stream on mount
  useEffect(() => {
    wsClient.connect();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const criticalCount = useMemo(
    () => notifications.filter((n) => n.type === "CRITICAL" || n.priority === "HIGH").length,
    [notifications]
  );

  // Merge and normalize streams
  const unifiedItems = useMemo(() => {
    const notifEntries = notifications.map((n) => ({
      id: `notif-${n.id}`,
      originalId: n.id,
      streamType: "NOTIFICATION",
      title: n.title,
      description: n.message,
      entityType: n.entityType || "SYSTEM",
      level: n.level || "Notification Level",
      priority: n.priority || "MEDIUM",
      severity: n.type || "INFO",
      isRead: n.isRead,
      timestamp: n.timestamp || new Date().toISOString(),
      link: n.link,
    }));

    const activityEntries = activities.map((a) => ({
      id: `act-${a.id}`,
      originalId: a.id,
      streamType: "ACTIVITY",
      title: a.title || `${a.action} on ${a.entityType}`,
      description: a.description || `Action executed on ${a.entityType}`,
      entityType: a.entityType || "TASK",
      level: a.level || "Activity Level",
      priority: a.priority || "MEDIUM",
      severity: "INFO",
      isRead: true,
      timestamp: a.timestamp || new Date().toISOString(),
      link: null,
    }));

    let merged = [];
    if (activeTab === "ALL") {
      merged = [...notifEntries, ...activityEntries];
    } else if (activeTab === "NOTIFICATIONS") {
      merged = notifEntries;
    } else {
      merged = activityEntries;
    }

    // Sort descending by timestamp
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply Entity Set Filter
    if (setFilter !== "ALL") {
      merged = merged.filter((item) => item.entityType === setFilter);
    }

    // Apply Level / Severity Filter
    if (levelFilter !== "ALL") {
      if (levelFilter === "HIGH_PRIORITY") {
        merged = merged.filter((item) => item.priority === "HIGH");
      } else {
        merged = merged.filter((item) => item.severity === levelFilter);
      }
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      merged = merged.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return merged;
  }, [notifications, activities, activeTab, setFilter, levelFilter, searchQuery]);

  const getEntityIcon = (type) => {
    switch (type) {
      case "TASK":
        return <CheckSquare className="h-4 w-4 text-emerald-400" />;
      case "TRACKER":
        return <ActivityIcon className="h-4 w-4 text-amber-400" />;
      case "NOTE":
        return <FileText className="h-4 w-4 text-purple-400" />;
      case "RESOURCE":
        return <Bookmark className="h-4 w-4 text-cyan-400" />;
      case "CATEGORY":
        return <FolderTree className="h-4 w-4 text-rose-400" />;
      default:
        return <Zap className="h-4 w-4 text-[var(--primary)]" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[9px] font-extrabold text-rose-400">
            <AlertTriangle className="h-3 w-3" /> CRITICAL
          </span>
        );
      case "MILESTONE":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[9px] font-extrabold text-amber-400">
            <Flame className="h-3 w-3" /> MILESTONE
          </span>
        );
      case "REMINDER":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 text-[9px] font-extrabold text-purple-300">
            <Clock className="h-3 w-3" /> REMINDER
          </span>
        );
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-extrabold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> SUCCESS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/15 px-2 py-0.5 text-[9px] font-extrabold text-cyan-400">
            <Shield className="h-3 w-3" /> INFO
          </span>
        );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-mono">
        {/* Compact Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold text-[var(--text)] tracking-tight">
              Activity & Notification Stream
            </h1>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <Wifi className="h-3 w-3 animate-pulse text-emerald-400" /> LIVE STREAM
            </div>
          </div>

          {/* Compact Stat Badges */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400">
                {unreadCount} Unread
              </span>
            )}
            <span className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
              {unifiedItems.length} Total
            </span>
          </div>
        </div>

        {/* View Switcher Tabs & Quick Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {[
              { id: "ALL", label: "Unified Feed", icon: Layers, count: notifications.length + activities.length },
              { id: "NOTIFICATIONS", label: "Notifications Inbox", icon: Inbox, count: notifications.length },
              { id: "ACTIVITY", label: "Activity Audit Log", icon: Clock, count: activities.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-extrabold transition-all shrink-0 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] shadow-md"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
                  }`}
                >
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                  {tab.label}
                  <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] border border-[var(--border)]">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/15 px-3 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--primary)]/25 transition-all"
              >
                <CheckCheck className="h-4 w-4 text-[var(--primary)]" /> Mark All Read
              </button>
            )}

            <button
              onClick={() => {
                if (confirm("Clear all logs and notifications?")) {
                  clearNotifications();
                  clearActivities();
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
            >
              <Trash2 className="h-4 w-4" /> Clear All History
            </button>
          </div>
        </div>

        {/* Search & Multi-Filter Control Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed by title, level, or details..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-colors"
            />
          </div>

          {/* Set Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            <span className="text-[11px] font-bold text-[var(--text-muted)] shrink-0 flex items-center gap-1">
              <ListFilter className="h-3.5 w-3.5 text-[var(--primary)]" /> Entity Set:
            </span>
            {[
              { label: "All Sets", value: "ALL" },
              { label: "Tasks", value: "TASK" },
              { label: "Trackers", value: "TRACKER" },
              { label: "Tree Nodes", value: "CATEGORY" },
              { label: "Notes", value: "NOTE" },
              { label: "Bookmarks", value: "RESOURCE" },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setSetFilter(s.value)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shrink-0 ${
                  setFilter === s.value
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stream List Cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {unifiedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 shadow-md backdrop-blur-xl transition-all ${
                  !item.isRead
                    ? "border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--text)] shadow-[var(--primary)]/5"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shrink-0 mt-0.5">
                    {getEntityIcon(item.entityType)}
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
                      {getSeverityBadge(item.severity)}
                      <span className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                        {item.entityType} SET
                      </span>
                      {item.level && (
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-300">
                          {item.level}
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] opacity-75">
                      <span>
                        {new Date(item.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span className="uppercase font-bold text-[var(--primary)]">{item.streamType} STREAM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.link && (
                    <Link
                      href={item.link}
                      className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                    >
                      View Item <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {!item.isRead && item.streamType === "NOTIFICATION" && (
                    <button
                      onClick={() => markAsRead(item.originalId)}
                      className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  {item.streamType === "NOTIFICATION" && (
                    <button
                      onClick={() => deleteNotification(item.originalId)}
                      className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {unifiedItems.length === 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
              <Sparkles className="h-10 w-10 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--text)]">No Events Found</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans max-w-sm mx-auto">
                No notifications or activity logs match your active search and filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
