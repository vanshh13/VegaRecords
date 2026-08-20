"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/stores/task.store";

const COLUMNS = [
  {
    id: "TODO",
    title: "Backlog",
    color: "#6b7280",
    accent: "rgba(107,114,128,0.08)",
    headerAccent: "rgba(107,114,128,0.15)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "#8b5cf6",
    accent: "rgba(139,92,246,0.06)",
    headerAccent: "rgba(139,92,246,0.12)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "COMPLETED",
    title: "Completed",
    color: "#34d399",
    accent: "rgba(52,211,153,0.05)",
    headerAccent: "rgba(52,211,153,0.12)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: "ARCHIVED",
    title: "Archived",
    color: "#4b5563",
    accent: "rgba(75,85,99,0.05)",
    headerAccent: "rgba(75,85,99,0.1)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
];

const PRIORITY_DOT = {
  URGENT: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#8b5cf6",
  LOW: "#6b7280",
};

const STATUS_ORDER = ["TODO", "IN_PROGRESS", "COMPLETED", "ARCHIVED"];

function BoardCard({ task, col }) {
  const { updateTaskStatus, openEditDrawer, deleteTask } = useTaskStore();
  const prio = PRIORITY_DOT[task.priority] || "#6b7280";
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.dueDate && task.dueDate < today && task.status !== "COMPLETED";

  const prevStatus = STATUS_ORDER[STATUS_ORDER.indexOf(col.id) - 1];
  const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(col.id) + 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.2 }}
      className={`board-card${task.status === "COMPLETED" ? " done" : ""}`}
    >
      {/* Card top: category + priority */}
      <div className="board-card-top">
        <div className="board-card-badges">
          {task.categoryName && (
            <span
              className="board-cat-pill"
              style={{
                backgroundColor: `${task.categoryColor || "#8b5cf6"}12`,
                color: task.categoryColor || "#8b5cf6",
              }}
            >
              {task.categoryName}
            </span>
          )}
        </div>
        <span
          className="board-prio-dot"
          style={{ backgroundColor: prio }}
          title={task.priority}
        />
      </div>

      {/* Title */}
      <h4 className="board-card-title">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="board-card-desc">{task.description}</p>
      )}

      {/* Footer */}
      <div className="board-card-footer">
        {task.dueDate ? (
          <span className={`board-due${isOverdue ? " overdue" : ""}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {task.dueDate}
          </span>
        ) : (
          <span />
        )}

        <div className="board-card-actions">
          {prevStatus && (
            <button
              onClick={() => updateTaskStatus(task.id, prevStatus)}
              className="board-move-btn"
              title="Move left"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => updateTaskStatus(task.id, nextStatus)}
              className="board-move-btn primary"
              title="Move right"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
          <button
            onClick={() => openEditDrawer(task)}
            className="board-move-btn"
            title="Edit"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskBoardView() {
  const { tasks, filters, openCreateDrawer } = useTaskStore();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority !== "ALL" && t.priority !== filters.priority) return false;
      if (filters.categoryId !== "ALL" && t.categoryId !== filters.categoryId) return false;
      if (filters.search.trim() && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="task-board-view">
      {COLUMNS.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.id);

        return (
          <div key={col.id} className="board-column" style={{ "--col-accent": col.accent, "--col-header": col.headerAccent }}>
            {/* Column Header */}
            <div className="board-col-header" style={{ "--col-color": col.color }}>
              <div className="board-col-header-left">
                <span style={{ color: col.color }}>{col.icon}</span>
                <span className="board-col-title" style={{ color: col.color }}>
                  {col.title}
                </span>
                <span className="board-col-count">{colTasks.length}</span>
              </div>
              <button
                onClick={() => openCreateDrawer()}
                className="board-col-add"
                title="Add task"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Cards */}
            <div className="board-col-cards">
              {colTasks.length === 0 ? (
                <div className="board-col-empty">
                  <div className="board-col-empty-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <p>Drop tasks here</p>
                </div>
              ) : (
                <AnimatePresence>
                  {colTasks.map((task) => (
                    <BoardCard key={task.id} task={task} col={col} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
