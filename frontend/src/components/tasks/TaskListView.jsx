"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/stores/task.store";
import Link from "next/link";

const PRIORITY_CONFIG = {
  URGENT: { label: "Urgent", color: "#f87171", dot: "#ef4444" },
  HIGH: { label: "High", color: "#fb923c", dot: "#f97316" },
  MEDIUM: { label: "Med", color: "#a78bfa", dot: "#8b5cf6" },
  LOW: { label: "Low", color: "#6b7280", dot: "#6b7280" },
};

const STATUS_CONFIG = {
  TODO: { label: "To Do", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  IN_PROGRESS: { label: "Active", color: "var(--primary)", bg: "rgba(139,92,246,0.1)" },
  COMPLETED: { label: "Done", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
  ARCHIVED: { label: "Archived", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
};

function EmptyListState({ hasFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="task-empty-state"
    >
      <div className="task-empty-illustration">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="10" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.15)" strokeWidth="1.5" />
          <rect x="18" y="22" width="28" height="3" rx="1.5" fill="rgba(139,92,246,0.2)" />
          <rect x="18" y="30" width="20" height="3" rx="1.5" fill="rgba(139,92,246,0.12)" />
          <rect x="18" y="38" width="24" height="3" rx="1.5" fill="rgba(139,92,246,0.12)" />
          <circle cx="48" cy="48" r="10" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
          <line x1="44" y1="48" x2="52" y2="48" stroke="rgba(139,92,246,0.6)" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="44" x2="48" y2="52" stroke="rgba(139,92,246,0.6)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="task-empty-title">
        {hasFilters ? "No missions match your filters" : "No missions yet"}
      </h3>
      <p className="task-empty-desc">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Create your first task and start tracking progress."}
      </p>
    </motion.div>
  );
}

function TaskRow({ task, index }) {
  const { toggleTaskStatus, openEditDrawer, deleteTask } = useTaskStore();
  const isDone = task.status === "COMPLETED";
  const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.LOW;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;

  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.dueDate && task.dueDate < today && !isDone;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
      className={`task-list-row${isDone ? " done" : ""}${isOverdue ? " overdue" : ""}`}
    >
      {/* Priority indicator line */}
      <div className="task-list-row-accent" style={{ backgroundColor: prio.dot }} />

      {/* Checkbox */}
      <button
        onClick={() => toggleTaskStatus(task.id)}
        className="task-list-check"
        title={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="task-check-circle">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="task-list-content">
        <div className="task-list-top">
          <span className={`task-list-title${isDone ? " done-text" : ""}`}>
            {task.title}
          </span>
          {task.categoryName && (
            <span
              className="task-cat-pill"
              style={{
                backgroundColor: `${task.categoryColor || "#8b5cf6"}12`,
                color: task.categoryColor || "#8b5cf6",
                border: `1px solid ${task.categoryColor || "#8b5cf6"}25`,
              }}
            >
              {task.categoryName}
            </span>
          )}
        </div>
        {task.description && (
          <p className="task-list-desc">{task.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="task-list-meta">
        {/* Status badge */}
        <span
          className="task-status-badge"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>

        {/* Priority */}
        <span className="task-prio-badge" style={{ color: prio.color }}>
          <span className="task-prio-dot" style={{ backgroundColor: prio.dot }} />
          {prio.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className={`task-due-date${isOverdue ? " overdue" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {task.dueDate}
          </span>
        )}

        {/* Actions */}
        <div className="task-list-actions">
          <Link
            href={`/tasks/${task.id}`}
            className="task-action-btn"
            title="Open task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <button
            onClick={() => openEditDrawer(task)}
            className="task-action-btn"
            title="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
            }}
            className="task-action-btn danger"
            title="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskListView() {
  const { tasks, filters } = useTaskStore();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.status !== "ALL" && t.status !== filters.status) return false;
      if (filters.priority !== "ALL" && t.priority !== filters.priority) return false;
      if (filters.categoryId !== "ALL" && t.categoryId !== filters.categoryId) return false;
      if (
        filters.search.trim() &&
        !t.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tasks, filters]);

  const hasFilters =
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.categoryId !== "ALL" ||
    filters.search.trim() !== "";

  if (filteredTasks.length === 0) {
    return <EmptyListState hasFilters={hasFilters} />;
  }

  return (
    <div className="task-list-view">
      {/* Column headers */}
      <div className="task-list-header-row">
        <span />
        <span className="task-list-col-label">Mission</span>
        <span className="task-list-col-label task-list-col-meta">Status · Priority · Due · Actions</span>
      </div>

      <AnimatePresence>
        {filteredTasks.map((task, i) => (
          <TaskRow key={task.id} task={task} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
