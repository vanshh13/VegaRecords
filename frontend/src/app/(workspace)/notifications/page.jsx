"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useNotificationStore } from "@/stores/notification.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Flame,
  Clock,
  Activity,
  Shield,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "ALL") return notifications;
    if (filter === "UNREAD") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const getIcon = (type) => {
    switch (type) {
      case "MILESTONE":
        return <Flame className="h-4 w-4 text-amber-400" />;
      case "REMINDER":
        return <Clock className="h-4 w-4 text-rose-400" />;
      case "TRACKER":
        return <Activity className="h-4 w-4 text-[#8b5cf6]" />;
      default:
        return <Shield className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-mono">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
              <Bell className="h-3.5 w-3.5" /> Notification Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] tracking-tight flex items-center gap-3">
              Notifications & Alerts
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-extrabold text-rose-400 border border-rose-500/30">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-xs text-[var(--text-muted)] max-w-xl font-sans">
              Manage system alerts, task deadline reminders, and milestone achievements across your workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/15 px-3.5 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--primary)]/25 transition-all"
              >
                <CheckCheck className="h-4 w-4 text-[var(--primary)]" /> Mark All Read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all notifications?")) clearAll();
                }}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <Trash2 className="h-4 w-4" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <span className="text-xs text-[var(--text-muted)] font-bold flex items-center gap-1.5 mr-2 shrink-0">
            <Filter className="h-3.5 w-3.5 text-[var(--primary)]" /> Filter:
          </span>
          {[
            { label: "All Alerts", value: "ALL" },
            { label: "Unread Only", value: "UNREAD" },
            { label: "Milestones", value: "MILESTONE" },
            { label: "Reminders", value: "REMINDER" },
            { label: "System", value: "SYSTEM" },
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

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 shadow-lg backdrop-blur-xl transition-all ${
                  !notif.isRead
                    ? "border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--text)] shadow-[var(--primary)]/5"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)]/30"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--text)]">{notif.title}</h3>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-[var(--text-muted)] opacity-75 block">
                      {new Date(notif.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                    >
                      Open Item <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
              <Sparkles className="h-10 w-10 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--text)]">No Notifications</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans max-w-sm mx-auto">
                Your inbox is clean. System alerts and milestone reminders will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
