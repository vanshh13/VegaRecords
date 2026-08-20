"use client";

import { useState, useEffect } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { X, Save, Activity, Image, Star, Hash, Layers } from "lucide-react";

export default function TrackerDrawer() {
  const { drawerOpen, closeDrawer, editingTracker, createTracker, updateTracker } =
    useTrackerStore();
  const { trackerTypes, fetchTrackerTypes } = useTrackerTypeStore();

  const [title, setTitle] = useState("");
  const [trackerTypeId, setTrackerTypeId] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [currentCount, setCurrentCount] = useState(0);
  const [targetCount, setTargetCount] = useState(100);
  const [rating, setRating] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrackerTypes();
  }, [fetchTrackerTypes]);

  useEffect(() => {
    if (editingTracker) {
      setTitle(editingTracker.title || "");
      setTrackerTypeId(editingTracker.trackerType?.id || "");
      setStatus(editingTracker.status || "IN_PROGRESS");
      setCurrentCount(editingTracker.currentCount || 0);
      setTargetCount(editingTracker.targetCount || 100);
      setRating(editingTracker.rating != null ? editingTracker.rating : "");
      setCoverUrl(editingTracker.coverUrl || "");
      setNotes(editingTracker.notes || "");
    } else {
      setTitle("");
      setTrackerTypeId(trackerTypes[0]?.id || "");
      setStatus("IN_PROGRESS");
      setCurrentCount(0);
      setTargetCount(100);
      setRating("");
      setCoverUrl("");
      setNotes("");
    }
  }, [editingTracker, drawerOpen, trackerTypes]);

  if (!drawerOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        trackerTypeId: trackerTypeId || (trackerTypes[0]?.id ?? null),
        status,
        currentCount: Number(currentCount) || 0,
        targetCount: Number(targetCount) || 100,
        rating: rating !== "" ? Number(rating) : null,
        coverUrl: coverUrl.trim() || null,
        notes: notes.trim() || null,
      };

      if (editingTracker) {
        await updateTracker(editingTracker.id, payload);
      } else {
        await createTracker(payload);
      }
      closeDrawer();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-base font-extrabold text-[var(--text)]">
                  {editingTracker ? "Edit Tracker" : "Create New Tracker"}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form id="tracker-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Tracker Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. One Piece, Clean Code, Spring Boot 3 Masterclass..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Tracker Type
                </label>
                <select
                  value={trackerTypeId}
                  onChange={(e) => setTrackerTypeId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                >
                  {trackerTypes.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[var(--surface)] text-[var(--text)]">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DROPPED">Dropped</option>
                    <option value="PLAN_TO_WATCH">Plan to Track</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    Rating (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Progress Count Counters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    Current Progress
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentCount}
                    onChange={(e) => setCurrentCount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    Target Total Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Image className="h-3 w-3 text-[var(--primary)]" /> Cover Poster Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Notes & Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Personal review, chapter reflections, or course syllabus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="tracker-form"
              disabled={submitting || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
