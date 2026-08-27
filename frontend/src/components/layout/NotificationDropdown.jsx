"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/stores/notification.store";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  ArrowRight,
  Flame,
  Clock,
  Activity,
  Shield,
  Layers,
} from "lucide-react";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm font-mono"
        title="Notifications"
      >
        <Bell className="h-4 w-4 text-[var(--primary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl backdrop-blur-2xl z-50 font-mono text-left space-y-3"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5 px-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--text)]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[10px] text-[var(--primary)] hover:underline font-bold"
                >
                  <CheckCheck className="h-3 w-3" /> Mark All Read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-1.5">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-1">
                  <Bell className="h-6 w-6 text-[var(--text-muted)] opacity-40 mx-auto" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`group relative flex items-start justify-between rounded-xl border p-2.5 text-xs transition-all ${
                      !notif.isRead
                        ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--text)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                    }`}
                  >
                    <div className="flex gap-2.5 min-w-0 pr-2">
                      <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-[var(--text)] truncate">{notif.title}</p>
                        <p className="text-[11px] leading-relaxed text-[var(--text-muted)] line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-[var(--text-muted)] opacity-75 block">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 rounded-md hover:bg-[var(--surface)] text-[var(--primary)]"
                          title="Mark Read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 rounded-md hover:bg-[var(--surface)] text-rose-400"
                        title="Delete Notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer View All Link */}
            <div className="border-t border-[var(--border)] pt-2 text-center">
              <Link
                href="/activity"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
              >
                View Activity & Alerts Stream <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
