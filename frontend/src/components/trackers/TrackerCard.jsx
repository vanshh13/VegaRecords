"use client";

import Link from "next/link";
import {
    Star,
    Edit2,
    Trash2,
    CheckCircle2,
    Clock,
    Film,
    Tv,
    BookOpen,
    GraduationCap,
    Gamepad2,
    Activity,
    Layers,
    Share2,
    Folder,
} from "lucide-react";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";

const STATUS_CONFIG = {
    IN_PROGRESS: { label: "In Progress", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    COMPLETED: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    PAUSED: { label: "Paused", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
    DROPPED: { label: "Dropped", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
    PLAN_TO_WATCH: { label: "Plan to Track", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
};

import { useRouter } from "next/navigation";

export default function TrackerCard({ tracker }) {
    const router = useRouter();
    const { quickIncrementProgress, openDrawer, deleteTracker, setSelectedTracker, selectedTracker, toggleFavoriteTracker } =
        useTrackerStore();

    const isSelected = selectedTracker?.id === tracker.id;

    const { coverUrl, isOngoing: isMetaOngoing, targetCount: metaTarget, unitLabel: metaUnitLabel } = extractMediaMetadata(tracker);

    const current = tracker.currentCount || 0;
    const isInfinite = tracker.isOngoing || isMetaOngoing || tracker.targetCount === 0;
    const target = !isInfinite ? (tracker.targetCount || metaTarget || 0) : 0;
    const percent = isInfinite ? 100 : Math.min(Math.round((current / Math.max(target, 1)) * 100), 100);

    const statusInfo = STATUS_CONFIG[tracker.status] || STATUS_CONFIG.IN_PROGRESS;
    const categoryName = tracker.category?.name || tracker.categoryName || (tracker.categories && tracker.categories[0]?.name);
    const typeName = tracker.trackerType?.name || "Custom";

    const rawUnitLabel = tracker.unitLabel || metaUnitLabel || "units";
    const shortUnit = rawUnitLabel.toLowerCase().startsWith("ep") ? "Ep" : (rawUnitLabel.length > 8 ? "Unit" : rawUnitLabel);

    const handleCardClick = () => {
        setSelectedTracker(tracker);
        router.push(`/trackers/${tracker.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`group relative flex flex-col justify-between rounded-2xl border p-4 font-mono transition-all cursor-pointer ${isSelected
                ? "border-[var(--primary)] bg-[var(--card)] shadow-lg ring-1 ring-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 hover:bg-[var(--hover-bg)] shadow-md"
                }`}
        >
            <div className="space-y-3">
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${statusInfo.color}`}
                    >
                        {statusInfo.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {categoryName && (
                            <span className="rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] flex items-center gap-1">
                                <Folder className="h-3 w-3" /> {categoryName}
                            </span>
                        )}
                        <span className="rounded-lg bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">
                            {typeName}
                        </span>
                    </div>
                </div>

                {/* Poster / Cover or Title */}
                <div className="flex gap-3">
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={tracker.title}
                            className="h-20 w-16 rounded-xl object-cover border border-[var(--border)] shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        />
                    ) : (
                        <div className="h-20 w-16 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center text-[var(--primary)] shrink-0 shadow-inner">
                            <Layers className="h-6 w-6 opacity-60" />
                        </div>
                    )}

                    <div className="flex-1 space-y-1 min-w-0">
                        <Link
                            href={`/trackers/${tracker.id}`}
                            className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2"
                        >
                            {tracker.title}
                        </Link>

                        {/* Rating Stars if available */}
                        {tracker.rating != null && (
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                <Star className="h-3.5 w-3.5 fill-amber-400" />
                                <span className="font-bold">{tracker.rating} / 10</span>
                            </div>
                        )}

                        {tracker.notes && (
                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 italic">
                                {tracker.notes}
                            </p>
                        )}
                    </div>
                </div>

                {/* Progress Bar & Counter */}
                <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)]">
                        <span>
                            {rawUnitLabel}: <strong className="text-[var(--text)]">{current}</strong> {isInfinite ? "(Ongoing / ∞)" : `of ${target}`}
                        </span>
                        <span className="text-[var(--primary)] font-extrabold">{isInfinite ? "∞" : `${percent}%`}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div
                className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-4 text-[10px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => quickIncrementProgress(tracker, 1)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-1.5 text-[10px] font-bold text-white shadow-md hover:scale-105 transition-transform"
                >
                    +1 {shortUnit}
                </button>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => toggleFavoriteTracker(tracker)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                            tracker.isFavorite
                                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-amber-400"
                        }`}
                        title={tracker.isFavorite ? "Unpin Favorite" : "Pin as Favorite"}
                    >
                        <Star className={`h-3 w-3 ${tracker.isFavorite ? "fill-amber-400" : ""}`} />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(`${window.location.origin}/trackers/${tracker.id}`);
                                alert("Share link copied to clipboard!");
                            }
                        }}
                        className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                        title="Share Tracker"
                    >
                        <Share2 className="h-3 w-3" />
                    </button>
                    <button
                        onClick={() => openDrawer(tracker)}
                        className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                        title="Edit Tracker"
                    >
                        <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                        onClick={() => {
                            if (confirm(`Delete tracker "${tracker.title}"?`)) deleteTracker(tracker.id);
                        }}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete Tracker"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
