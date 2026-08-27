"use client";

import { useState, useEffect } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { useCategoryStore } from "@/stores/category.store";
import { X, Save, Activity, Image, Star, Hash, Layers, Folder, Sparkles } from "lucide-react";

export default function TrackerDrawer() {
    const { drawerOpen, closeDrawer, editingTracker, createTracker, updateTracker } =
        useTrackerStore();
    const { trackerTypes, fetchTrackerTypes } = useTrackerTypeStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [title, setTitle] = useState("");
    const [trackerTypeId, setTrackerTypeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("IN_PROGRESS");
    const [currentCount, setCurrentCount] = useState(0);
    const [targetCount, setTargetCount] = useState(100);
    const [isOngoing, setIsOngoing] = useState(false);
    const [rating, setRating] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTrackerTypes();
        fetchCategories();
    }, [fetchTrackerTypes, fetchCategories]);

    useEffect(() => {
        if (!drawerOpen) return;
        if (editingTracker) {
            setTitle(editingTracker.title || "");
            setTrackerTypeId(editingTracker.trackerType?.id || editingTracker.trackerTypeId || "");

            const resolvedCatId =
                editingTracker.categoryId ||
                editingTracker.category?.id ||
                (Array.isArray(editingTracker.categories) && editingTracker.categories.length > 0
                    ? typeof editingTracker.categories[0] === "object"
                        ? editingTracker.categories[0].id
                        : editingTracker.categories[0]
                    : null) ||
                (Array.isArray(editingTracker.categoryIds) && editingTracker.categoryIds.length > 0
                    ? editingTracker.categoryIds[0]
                    : null) ||
                "";

            setCategoryId(resolvedCatId);
            setStatus(editingTracker.status || "IN_PROGRESS");
            setCurrentCount(editingTracker.currentCount || 0);
            setTargetCount(editingTracker.targetCount || 100);
            setIsOngoing(editingTracker.isOngoing || editingTracker.targetCount === 0);
            setRating(editingTracker.rating != null ? editingTracker.rating : "");
            setCoverUrl(editingTracker.coverUrl || "");
            setNotes(editingTracker.notes || "");
            setIsFavorite(editingTracker.isFavorite || false);
        } else {
            setTitle("");
            setTrackerTypeId(trackerTypes[0]?.id || "");
            setCategoryId(categories[0]?.id || "");
            setStatus("IN_PROGRESS");
            setCurrentCount(0);
            setTargetCount(100);
            setIsOngoing(false);
            setRating("");
            setCoverUrl("");
            setNotes("");
            setIsFavorite(false);
        }
    }, [editingTracker, drawerOpen, trackerTypes, categories]);

    // Handle ESC key to close
    useEffect(() => {
            const handleKeyDown = (e) => {
                if (e.key === "Escape" && drawerOpen) {
                    closeDrawer();
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, [drawerOpen, closeDrawer]);

        if (!drawerOpen) return null;

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!title.trim()) return;

            setSubmitting(true);
            try {
                const payload = {
                    title: title.trim(),
                    trackerTypeId: trackerTypeId || (trackerTypes[0]?.id ?? null),
                    categoryId: categoryId || null,
                    categoryIds: categoryId ? [categoryId] : [],
                    status,
                    currentCount: Number(currentCount) || 0,
                    targetCount: isOngoing ? 0 : (Number(targetCount) || 100),
                    isOngoing: isOngoing,
                    isFavorite: isFavorite,
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
            <div
                onClick={closeDrawer}
                className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-sm font-mono animate-fadeIn cursor-pointer"
            >
                <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-screen max-w-md border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col justify-between cursor-default"
                    >

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

                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                                        <Folder className="h-3 w-3 text-[var(--primary)]" /> Workspace Category
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[var(--surface)] text-[var(--text)]">
                                            Uncategorized / General
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id} className="bg-[var(--surface)] text-[var(--text)]">
                                                {c.name}
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
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            placeholder="e.g. 8.2"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Pin as Favorite Toggle */}
                                <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                                            <Star className={`h-3.5 w-3.5 ${isFavorite ? "text-amber-400 fill-amber-400" : "text-[var(--text-muted)]"}`} /> Pin as Favorite
                                        </h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Pin this tracker to high-priority & favorite filters</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isFavorite}
                                        onChange={(e) => setIsFavorite(e.target.checked)}
                                        className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                                    />
                                </div>

                                {/* Ongoing Tracker Checkbox */}
                                <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Ongoing Series / Unlimited Units
                                        </h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Check if total count is unknown/continuous (e.g. One Piece, Habits)</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isOngoing}
                                        onChange={(e) => setIsOngoing(e.target.checked)}
                                        className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
                                    />
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

                                    {!isOngoing && (
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
                                    )}
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