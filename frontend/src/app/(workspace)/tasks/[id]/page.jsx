"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { useTaskStore } from "@/stores/task.store";
import { taskApi } from "@/apis/task.api";
import { formatDueDate, formatFullDateTime } from "@/utils/dateUtils";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  Clock,
  Edit2,
  Trash2,
  Sparkles,
  MessageSquare,
  Activity,
  ShieldAlert,
} from "lucide-react";
import TaskDrawer from "@/components/tasks/TaskDrawer";

export default function TaskDetailPage({ params }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const { tasks, toggleTaskStatus, deleteTask, openEditDrawer } = useTaskStore();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeTask = tasks.find((t) => t.id === taskId);
    if (storeTask) {
      setTask(storeTask);
      setLoading(false);
    } else {
      taskApi.getById(taskId).then((fetched) => {
        setTask(fetched);
        setLoading(false);
      });
    }
  }, [taskId, tasks]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center font-mono text-xs text-[var(--text-muted)]">
          Loading task details...
        </div>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-4">
          <ShieldAlert className="mx-auto h-8 w-8 text-rose-400" />
          <h2 className="text-base font-bold text-[var(--text)] font-mono">Task Not Found</h2>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-mono font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Tasks
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isCompleted = task.status === "COMPLETED";

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Action Board
        </Link>

        {/* Task Header HUD Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <Circle className="h-6 w-6 text-[var(--text-muted)] hover:text-[var(--primary)]" />
                )}
              </button>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className={`text-xl sm:text-2xl font-extrabold font-mono tracking-tight ${
                    isCompleted ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"
                  }`}>
                    {task.title}
                  </h1>

                  {task.categoryName && (
                    <span
                      className="rounded-md border px-2.5 py-0.5 text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: `${task.categoryColor || "#6366f1"}20`,
                        borderColor: `${task.categoryColor || "#6366f1"}40`,
                        color: task.categoryColor || "#6366f1",
                      }}
                    >
                      {task.categoryName}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Due: {task.dueDate ? formatDueDate(task.dueDate) : "No deadline"}
                  </span>
                  <span>•</span>
                  <span className="uppercase font-bold text-[var(--primary)]">PRIORITY: {task.priority}</span>
                  <span>•</span>
                  <span className="uppercase font-bold text-emerald-400">STATUS: {task.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => openEditDrawer(task)}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this task?")) {
                    deleteTask(task.id);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Details & Description */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4 text-[var(--primary)]" /> Detailed Specifications & Notes
          </h3>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs font-mono text-[var(--text)] leading-relaxed min-h-[100px]">
            {task.description || "No specific details or description attached to this task item."}
          </div>
        </div>

        {/* Activity & Audit History */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--secondary)]" /> Activity Timeline
          </h3>

          <div className="space-y-3 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-cyan-400" /> Task Created
              </span>
              <span>{task.createdAt ? formatFullDateTime(task.createdAt) : "AUG 2026"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Completion Progress
              </span>
              <span className="font-bold text-emerald-400">{task.progress || 0}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <TaskDrawer />
    </MainLayout>
  );
}
