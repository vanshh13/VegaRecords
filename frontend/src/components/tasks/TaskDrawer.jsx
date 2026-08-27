"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/stores/task.store";
import { useCategoryStore } from "@/stores/category.store";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", color: "#6b7280" },
  { value: "MEDIUM", label: "Medium", color: "#8b5cf6" },
  { value: "HIGH", label: "High", color: "#f97316" },
  { value: "URGENT", label: "Urgent", color: "#ef4444" },
];

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

function FormField({ label, children, required }) {
  return (
    <div className="drawer-field">
      <label className="drawer-field-label">
        {label}
        {required && <span className="drawer-field-required">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function TaskDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    editingTask,
    closeDrawer,
    addTask,
    updateTask,
  } = useTaskStore();
  const { categories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [keepAfterCompletion, setKeepAfterCompletion] = useState(true);

  useEffect(() => {
    if (drawerMode === "edit" && editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setCategoryId(editingTask.categoryId || "");
      setPriority(editingTask.priority || "MEDIUM");
      setStatus(editingTask.status || "TODO");
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "");
      setKeepAfterCompletion(editingTask.keepAfterCompletion ?? true);
    } else {
      setTitle("");
      setDescription("");
      setCategoryId(editingTask?.categoryId || categories[0]?.id || "");
      setPriority("MEDIUM");
      setStatus("TODO");
      setDueDate(new Date().toISOString().split("T")[0]);
      setKeepAfterCompletion(true);
    }
  }, [drawerMode, editingTask, categories, isDrawerOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCat = categories.find((c) => c.id === categoryId);
    let formattedDueDate = null;
    if (dueDate) {
      formattedDueDate = dueDate.includes("T") ? dueDate : `${dueDate}T00:00:00`;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      categoryId: categoryId || null,
      categoryName: matchedCat ? matchedCat.name : null,
      categoryColor: matchedCat ? matchedCat.color : "#8b5cf6",
      priority,
      status,
      dueDate: formattedDueDate,
      keepAfterCompletion,
    };


    if (drawerMode === "edit" && editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
    }
  };

  const selectedPrio = PRIORITY_OPTIONS.find((p) => p.value === priority);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-8 sm:pl-16 z-[101]">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="task-drawer"
            >
              {/* Drawer header */}
              <div className="task-drawer-header">
                <div className="task-drawer-header-left">
                  <div className="task-drawer-icon">
                    {drawerMode === "edit" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className="task-drawer-title">
                      {drawerMode === "edit" ? "Edit Mission" : "New Mission"}
                    </h2>
                    <p className="task-drawer-subtitle">
                      {drawerMode === "edit"
                        ? "Update task parameters"
                        : "Configure your task parameters"}
                    </p>
                  </div>
                </div>
                <button onClick={closeDrawer} className="task-drawer-close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form
                id="taskDrawerForm"
                onSubmit={handleSubmit}
                className="task-drawer-body"
              >
                <FormField label="Mission Title" required>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Implement JWT refresh token flow"
                    className="drawer-input"
                    autoFocus
                  />
                </FormField>

                <FormField label="Description & Notes">
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details, acceptance criteria, or links..."
                    className="drawer-input drawer-textarea"
                  />
                </FormField>

                <FormField label="Category">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="drawer-input drawer-select"
                  >
                    <option value="" className="bg-[var(--surface)] text-[var(--text)]">Uncategorized</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[var(--surface)] text-[var(--text)]">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Priority selector - visual */}
                <FormField label="Priority">
                  <div className="drawer-priority-grid">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`drawer-prio-btn${priority === p.value ? " active" : ""}`}
                        style={{
                          "--prio-color": p.color,
                          borderColor: priority === p.value ? p.color : undefined,
                          backgroundColor: priority === p.value ? `${p.color}15` : undefined,
                          color: priority === p.value ? p.color : undefined,
                        }}
                      >
                        <span className="drawer-prio-dot" style={{ backgroundColor: p.color }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </FormField>

                <div className="drawer-row">
                  <FormField label="Status">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="drawer-input drawer-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[var(--surface)] text-[var(--text)]">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Due Date">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="drawer-input"
                    />
                  </FormField>
                </div>

                {/* Keep toggle */}
                <label className="drawer-toggle-row">
                  <div className={`drawer-toggle${keepAfterCompletion ? " on" : ""}`} onClick={() => setKeepAfterCompletion((v) => !v)}>
                    <div className="drawer-toggle-thumb" />
                  </div>
                  <span className="drawer-toggle-label">Keep in log after completion</span>
                </label>
              </form>

              {/* Footer */}
              <div className="task-drawer-footer">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="drawer-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="taskDrawerForm"
                  className="drawer-submit-btn"
                >
                  {drawerMode === "edit" ? "Save Changes" : "Create Mission"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
