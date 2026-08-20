"use client";

import { useMemo } from "react";
import { useTaskStore } from "@/stores/task.store";
import { motion } from "framer-motion";

const StatCard = ({ label, value, sub, icon, accent, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.3 }}
    className="task-stat-card"
  >
    <div className="task-stat-icon" style={{ color: accent }}>
      {icon}
    </div>
    <div className="task-stat-content">
      <span className="task-stat-value" style={{ color: accent }}>{value}</span>
      <span className="task-stat-label">{label}</span>
    </div>
    {sub && <div className="task-stat-sub">{sub}</div>}
  </motion.div>
);

export default function TaskStatsHeader() {
  const { tasks } = useTaskStore();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter((t) => t.status === "TODO").length;

    const today = new Date().toISOString().split("T")[0];
    const overdue = tasks.filter(
      (t) => t.dueDate && t.dueDate < today && t.status !== "COMPLETED"
    ).length;

    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
    // XP: 100 per completed, 20 per in-progress, -10 per overdue
    const xp = completed * 100 + inProgress * 20 - overdue * 10;
    // Streak: simplified — tasks completed recently (mock based on data)
    const streak = Math.min(completed, 7);

    return { total, completed, inProgress, todo, overdue, efficiency, xp, streak };
  }, [tasks]);

  const statItems = [
    {
      label: "Active",
      value: stats.inProgress,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      accent: "var(--primary)",
      sub: `${stats.todo} queued`,
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      accent: "#34d399",
      sub: `of ${stats.total} total`,
    },
    {
      label: "Streak",
      value: `${stats.streak}d`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      accent: "#f59e0b",
      sub: "daily run",
    },
    {
      label: "Efficiency",
      value: `${stats.efficiency}%`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      accent: "var(--primary)",
      sub: (
        <div className="task-efficiency-bar">
          <div
            className="task-efficiency-fill"
            style={{ width: `${stats.efficiency}%` }}
          />
        </div>
      ),
    },
    {
      label: "XP Earned",
      value: Math.max(0, stats.xp),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      accent: "#a78bfa",
      sub: `${stats.overdue > 0 ? `-${stats.overdue * 10} overdue` : "on track"}`,
    },
  ];

  return (
    <div className="task-stats-strip">
      {statItems.map((stat, i) => (
        <StatCard key={stat.label} index={i} {...stat} />
      ))}
    </div>
  );
}
