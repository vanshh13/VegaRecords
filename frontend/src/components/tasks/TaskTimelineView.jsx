"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/stores/task.store";
import Link from "next/link";

const GROUPS = [
  {
    id: "overdue",
    title: "Overdue",
    color: "#f87171",
    bgAccent: "rgba(248,113,113,0.07)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    filter: (tasks, today) =>
      tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== "COMPLETED"),
  },
  {
    id: "today",
    title: "Due Today",
    color: "#fb923c",
    bgAccent: "rgba(251,146,60,0.07)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    filter: (tasks, today) =>
      tasks.filter((t) => t.dueDate === today && t.status !== "COMPLETED"),
  },
  {
    id: "upcoming",
    title: "Upcoming",
    color: "#8b5cf6",
    bgAccent: "rgba(139,92,246,0.06)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    filter: (tasks, today) =>
      tasks.filter((t) => t.dueDate && t.dueDate > today && t.status !== "COMPLETED"),
  },
  {
    id: "backlog",
    title: "Backlog",
    color: "#6b7280",
    bgAccent: "rgba(107,114,128,0.06)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    filter: (tasks) =>
      tasks.filter((t) => !t.dueDate && t.status !== "COMPLETED"),
  },
  {
    id: "completed",
    title: "Completed",
    color: "#34d399",
    bgAccent: "rgba(52,211,153,0.05)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    filter: (tasks) => tasks.filter((t) => t.status === "COMPLETED"),
  },
];

function TimelineRow({ task, isLast }) {
  const { toggleTaskStatus } = useTaskStore();
  const isDone = task.status === "COMPLETED";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="timeline-row"
    >
      {/* Node */}
      <div className="timeline-node-wrap">
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className="timeline-node-btn"
          title={isDone ? "Mark incomplete" : "Mark complete"}
        >
          {isDone ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="timeline-check-circle">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </button>
        {!isLast && <div className="timeline-connector" />}
      </div>

      {/* Card */}
      <div className={`timeline-card${isDone ? " done" : ""}`}>
        <div className="timeline-card-top">
          <span className={`timeline-card-title${isDone ? " done-text" : ""}`}>
            {task.title}
          </span>
          {task.categoryName && (
            <span
              className="task-cat-pill"
              style={{
                backgroundColor: `${task.categoryColor || "#8b5cf6"}12`,
                color: task.categoryColor || "#8b5cf6",
              }}
            >
              {task.categoryName}
            </span>
          )}
        </div>
        {task.description && (
          <p className="timeline-card-desc">{task.description}</p>
        )}
        <div className="timeline-card-footer">
          <span className="timeline-due">
            {task.dueDate
              ? `Due ${task.dueDate}`
              : task.status === "COMPLETED"
              ? "Completed"
              : "No date"}
          </span>
          <Link
            href={`/tasks/${task.id}`}
            className="task-action-btn"
            title="Open task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskTimelineView() {
  const { tasks, filters } = useTaskStore();

  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority !== "ALL" && t.priority !== filters.priority) return false;
      if (filters.categoryId !== "ALL" && t.categoryId !== filters.categoryId) return false;
      if (filters.search.trim() && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filters]);

  const hasAny = GROUPS.some((g) => g.filter(filtered, today).length > 0);

  if (!hasAny) {
    return (
      <div className="task-empty-state">
        <div className="task-empty-illustration">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="8" width="48" height="48" rx="10" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.15)" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2="44" stroke="rgba(139,92,246,0.2)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="24" r="4" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
            <circle cx="20" cy="36" r="4" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
            <rect x="28" y="22" width="20" height="4" rx="2" fill="rgba(139,92,246,0.15)" />
            <rect x="28" y="34" width="14" height="4" rx="2" fill="rgba(139,92,246,0.1)" />
          </svg>
        </div>
        <h3 className="task-empty-title">Timeline is clear</h3>
        <p className="task-empty-desc">No missions to display. Add due dates to tasks to populate the timeline.</p>
      </div>
    );
  }

  return (
    <div className="task-timeline-view">
      {GROUPS.map((group) => {
        const items = group.filter(filtered, today);
        if (items.length === 0) return null;

        return (
          <div key={group.id} className="timeline-group" style={{ "--group-color": group.color, "--group-bg": group.bgAccent }}>
            {/* Group header */}
            <div className="timeline-group-header">
              <div className="timeline-group-icon" style={{ color: group.color }}>
                {group.icon}
              </div>
              <span className="timeline-group-title" style={{ color: group.color }}>
                {group.title}
              </span>
              <span className="timeline-group-count">{items.length}</span>
            </div>

            {/* Timeline rows */}
            <div className="timeline-rows">
              {items.map((task, i) => (
                <TimelineRow key={task.id} task={task} isLast={i === items.length - 1} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
