"use client";
import "@/components/tasks/tasks.css";

import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaskCategorySidebar from "@/components/tasks/TaskCategorySidebar";
import TaskStatsHeader from "@/components/tasks/TaskStatsHeader";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskListView from "@/components/tasks/TaskListView";
import TaskBoardView from "@/components/tasks/TaskBoardView";
import TaskTimelineView from "@/components/tasks/TaskTimelineView";
import TaskDrawer from "@/components/tasks/TaskDrawer";
import CategoryDrawer from "@/components/categories/CategoryDrawer";
import { useTaskStore } from "@/stores/task.store";
import { useCategoryStore } from "@/stores/category.store";

export default function TasksPage() {
  const { fetchTasks, viewMode } = useTaskStore();
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  return (
    <MainLayout>
      {/* Subtle grid blueprint background */}
      <div className="task-workspace-root">
        {/* Page Header */}
        <div className="task-page-header">
          <div className="task-page-header-left">
            <div className="task-page-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div>
              <h1 className="task-page-title">Mission Control</h1>
              <p className="task-page-subtitle">Task Operations Workspace</p>
            </div>
          </div>
          <div className="task-page-header-badge">
            <span className="task-status-dot" />
            LIVE
          </div>
        </div>

        {/* Stats Strip */}
        <TaskStatsHeader />

        {/* Toolbar */}
        <TaskToolbar />

        {/* Main View Area */}
        <div className="task-view-area">
          {viewMode === "list" && <TaskListView />}
          {viewMode === "board" && <TaskBoardView />}
          {viewMode === "timeline" && <TaskTimelineView />}
        </div>
      </div>

      {/* Overlays */}
      <TaskCategorySidebar />
      <TaskDrawer />
      <CategoryDrawer />
    </MainLayout>
  );
}
