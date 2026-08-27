"use client";

import { useState } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { extractMediaMetadata } from "@/utils/mediaMetadata";
import ProgressHistoryTimeline from "./ProgressHistoryTimeline";
import EpisodeSelectorGrid from "./media/EpisodeSelectorGrid";
import {
  ArrowLeft,
  Plus,
  Star,
  Activity,
  Edit2,
  Trash2,
  Tv,
  Film,
  Book,
  GraduationCap,
  Sparkles,
  User,
  Share2,
  FileText,
  Bookmark,
  CheckSquare,
  Network,
  Globe,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function TrackerDetailsView({ tracker, values = [] }) {
  const { trackerValues, quickIncrementProgress, setCustomProgressCount, updateStatus, deleteTracker, openDrawer } = useTrackerStore();
  const [jumpVal, setJumpVal] = useState("");

  const activeValues = (trackerValues && trackerValues.length > 0) ? trackerValues : values;

  if (!tracker) return null;

  const { rating, creator, synopsis, coverUrl, isOngoing, targetCount, unitLabel: metaUnitLabel } = extractMediaMetadata(tracker);

  const current = tracker.currentCount || 0;
  const target = targetCount || tracker.targetCount || 0;
  const isInfinite = isOngoing || target === 0;
  const percent = isInfinite ? 100 : Math.min(Math.round((current / Math.max(target, 1)) * 100), 100);
  const typeName = (tracker.trackerType?.name || "MEDIA").toUpperCase();

  // Source Transparency resolution
  let importSource = "User Configured";
  if (typeName.includes("ANIME")) importSource = "Imported from AniList";
  else if (typeName.includes("MOVIE") || typeName.includes("SERIES") || typeName.includes("TV")) importSource = "Imported from TMDB";
  else if (typeName.includes("BOOK")) importSource = "Imported from Google Books";
  else if (typeName.includes("GAME")) importSource = "Imported from RAWG Games";

  const getMediaIcon = (name) => {
    if (name.includes("ANIME") || name.includes("SERIES") || name.includes("TV")) return Tv;
    if (name.includes("MOVIE") || name.includes("FILM")) return Film;
    if (name.includes("BOOK")) return Book;
    if (name.includes("COURSE")) return GraduationCap;
    return Activity;
  };
  const MediaIcon = getMediaIcon(typeName);

  const getUnitLabel = (name) => {
    if (name.includes("ANIME") || name.includes("SERIES") || name.includes("TV")) return "Episode";
    if (name.includes("BOOK")) return "Page";
    if (name.includes("COURSE")) return "Module";
    if (name.includes("GAME")) return "Hour";
    return "Unit";
  };
  const unitLabel = getUnitLabel(typeName);

  return (
    <div className="max-w-5xl mx-auto font-mono space-y-6">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/trackers"
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--primary)]" /> Back to Tracker Hub
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/graph"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3.5 py-2 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all shadow-sm"
          >
            <Network className="h-4 w-4" /> Open Knowledge Graph
          </Link>

          <button
            onClick={() => openDrawer(tracker)}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5 text-[var(--primary)]" /> Edit Details
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete media tracker "${tracker.title}"?`)) deleteTracker(tracker.id);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Rich Media Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover Showcase */}
          <div className="relative h-64 w-44 rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl shrink-0 group">
            <img
              src={coverUrl}
              alt={tracker.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          {/* Title & Source Transparency Header */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/15 px-3 py-1 text-[10px] font-extrabold text-[var(--primary)] uppercase">
                <MediaIcon className="h-3.5 w-3.5" /> {typeName}
              </span>

              {/* Source Transparency Badge */}
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3 py-1 text-[10px] font-bold text-cyan-300">
                <Globe className="h-3 w-3 text-cyan-400" /> {importSource}
              </span>

              {/* Ongoing Series Badge */}
              {isInfinite && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-[10px] font-extrabold text-emerald-300 animate-pulse">
                  <Sparkles className="h-3 w-3 text-emerald-400" /> Ongoing Series (∞)
                </span>
              )}

              {/* Status Selector */}
              <select
                value={tracker.status || "IN_PROGRESS"}
                onChange={(e) => updateStatus(tracker.id, e.target.value)}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                <option value="IN_PROGRESS" className="bg-[var(--surface)] text-[var(--text)]">In Progress</option>
                <option value="COMPLETED" className="bg-[var(--surface)] text-[var(--text)]">Completed</option>
                <option value="PAUSED" className="bg-[var(--surface)] text-[var(--text)]">Paused</option>
                <option value="DROPPED" className="bg-[var(--surface)] text-[var(--text)]">Dropped</option>
                <option value="PLAN_TO_WATCH" className="bg-[var(--surface)] text-[var(--text)]">Plan to Track</option>
              </select>

              <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 text-xs font-black text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {rating} / 10
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[var(--primary)] font-extrabold flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {creator}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] leading-tight">
                {tracker.title}
              </h1>
            </div>

            {synopsis && (
              <div className="space-y-1 bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Synopsis / Overview
                </span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{synopsis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Interactive Progress Ring & Counter */}
        <div className="rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 via-slate-900/40 to-[var(--secondary)]/10 p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[var(--primary)]" /> Progress Tracker
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Logged {unitLabel}s: <span className="font-extrabold text-[var(--primary)]">{current}</span> {isInfinite ? "(Ongoing Series / ∞)" : `of ${target}`}
              </p>
            </div>

            {/* Animated SVG Progress Ring */}
            <div className="relative flex items-center justify-center h-16 w-16">
              <svg className="h-16 w-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={163}
                  strokeDashoffset={isInfinite ? 0 : 163 - (163 * percent) / 100}
                  className="text-[var(--primary)] transition-all duration-700 ease-out"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">{isInfinite ? "∞" : `${percent}%`}</span>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Quick Increment & Mid-Series Jump Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => quickIncrementProgress(tracker, 1)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" /> +1 {unitLabel}
            </button>
            <button
              onClick={() => quickIncrementProgress(tracker, 5)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            >
              +5 {unitLabel}s
            </button>
            <button
              onClick={() => quickIncrementProgress(tracker, 10)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors"
            >
              +10 {unitLabel}s
            </button>

            {/* Direct Jump / Set Progress Input */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Jump / Set {unitLabel}:</span>
              <input
                type="number"
                min="0"
                placeholder={current}
                value={jumpVal}
                onChange={(e) => setJumpVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && jumpVal !== "") {
                    setCustomProgressCount(tracker, jumpVal, "Direct episode jump / Mid-series start");
                    setJumpVal("");
                  }
                }}
                className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-extrabold text-[var(--primary)] focus:outline-none"
              />
              <button
                onClick={() => {
                  if (jumpVal !== "") {
                    setCustomProgressCount(tracker, jumpVal, "Direct episode jump / Mid-series start");
                    setJumpVal("");
                  }
                }}
                className="rounded-lg bg-[var(--primary)]/20 px-3 py-1 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)]/30 transition-colors"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Episode / Unit Selector Grid */}
        <EpisodeSelectorGrid tracker={tracker} unitLabel={unitLabel} />

        {/* Linked Entities & Knowledge Graph Preview */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <h3 className="text-xs font-extrabold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
            <Network className="h-4 w-4 text-[var(--primary)]" /> Connected Life Knowledge Nodes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/notes"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)]/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-indigo-400" />
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Related Notes</h4>
                <p className="text-[10px] text-[var(--text-muted)]">3 linked markdown notes</p>
              </div>
            </Link>

            <Link
              href="/resources"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)]/50 transition-colors"
            >
              <Bookmark className="h-5 w-5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Related Resources</h4>
                <p className="text-[10px] text-[var(--text-muted)]">2 saved web links</p>
              </div>
            </Link>

            <Link
              href="/tasks"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)]/50 transition-colors"
            >
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Related Tasks</h4>
                <p className="text-[10px] text-[var(--text-muted)]">1 linked sprint task</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Progress History Timeline */}
        <div className="pt-4 border-t border-[var(--border)]">
          <ProgressHistoryTimeline values={activeValues} />
        </div>
      </div>
    </div>
  );
}
