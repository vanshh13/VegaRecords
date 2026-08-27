"use client";

import { motion } from "framer-motion";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";
import { Play, Zap, CheckCircle2, Film, Tv, BookOpen, GraduationCap, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickContinueHub() {
    const router = useRouter();
    const { trackers, quickIncrementProgress } = useTrackerStore();

    // Filter active in-progress trackers
    const activeTrackers = trackers
        .filter((t) => t.status === "IN_PROGRESS" || t.status === "PLAN_TO_WATCH" || !t.status)
        .slice(0, 4);

    if (activeTrackers.length === 0) return null;

    return (
        <div className="space-y-3 font-mono">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[var(--primary)] animate-bounce" /> Quick Continue Hub
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeTrackers.map((t) => {
                    const { coverUrl, isOngoing: isMetaOngoing, targetCount: metaTarget, unitLabel: metaUnitLabel } = extractMediaMetadata(t);
                    const current = t.currentCount || 0;
                    const isOngoing = t.isOngoing || isMetaOngoing || t.targetCount === 0;
                    const target = !isOngoing ? (t.targetCount || metaTarget || 100) : 0;
                    const percent = isOngoing ? 100 : Math.min(Math.round((current / Math.max(target, 1)) * 100), 100);
                    const typeName = t.trackerType?.name || "Series";
                    const unitLabel = t.unitLabel || metaUnitLabel || "episodes";
                    const shortUnit = unitLabel.toLowerCase().startsWith("ep") ? "Ep" : (unitLabel.length > 8 ? "Unit" : unitLabel);

                    return (
                        <motion.div
                            key={t.id}
                            whileHover={{ y: -4, scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => router.push(`/trackers/${t.id}`)}
                            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md hover:border-[var(--primary)]/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                                        {typeName}
                                    </span>
                                    <span className="text-[10px] font-extrabold text-[var(--primary)]">
                                        {isOngoing ? "∞ ONGOING" : `${percent}% Complete`}
                                    </span>
                                </div>

                                {/* Poster Image + Title */}
                                <div className="flex gap-3 items-center">
                                    {coverUrl ? (
                                        <img
                                            src={coverUrl}
                                            alt={t.title}
                                            className="h-16 w-12 rounded-xl object-cover border border-[var(--border)] shrink-0 shadow-md group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="h-16 w-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--primary)] shrink-0 shadow-inner">
                                            <Layers className="h-5 w-5 opacity-60" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <span className="font-bold text-xs text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 block">
                                            {t.title}
                                        </span>
                                    </div>
                                </div>

                                {/* Live Progress Bar */}
                                <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-bold">
                                        <span>
                                            {unitLabel}: <strong className="text-[var(--text)]">{current}</strong> {isOngoing ? "(∞)" : `of ${target}`}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quick +1 Action */}
                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)] text-[10px]">
                                <span className="font-bold text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                                    View Timeline &rarr;
                                </span>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        quickIncrementProgress(t, 1);
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-1.5 text-[10px] font-bold text-white shadow-md hover:scale-105 transition-transform"
                                    title={`Add +1 ${unitLabel}`}
                                >
                                    +1 {shortUnit}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
