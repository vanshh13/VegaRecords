"use client";

import Link from "next/link";
import {
  ExternalLink,
  Star,
  Edit2,
  Trash2,
  Video,
  Code2,
  FileText,
  Globe,
  BookOpen,
  GraduationCap,
  Bookmark,
  Calendar,
} from "lucide-react";
import { useResourceStore } from "@/stores/resource.store";

const TYPE_ICONS = {
  YOUTUBE: { icon: Video, color: "text-red-400 bg-red-500/10 border-red-500/30" },
  GITHUB: { icon: Code2, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  DOCUMENTATION: { icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  ARTICLE: { icon: BookOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  BLOG: { icon: FileText, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  COURSE: { icon: GraduationCap, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
  WEBSITE: { icon: Globe, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
};

export default function ResourceCard({ resource }) {
  const { toggleFavorite, openDrawer, deleteResource, setSelectedResource, selectedResource } =
    useResourceStore();

  const isSelected = selectedResource?.id === resource.id;

  const getDomain = (urlStr) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "web resource";
    }
  };

  const typeConfig = TYPE_ICONS[resource.resourceType] || {
    icon: Bookmark,
    color: "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/30",
  };
  const IconComp = typeConfig.icon;

  const formattedDate = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  return (
    <div
      onClick={() => setSelectedResource(resource)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 font-mono transition-all cursor-pointer ${
        isSelected
          ? "border-[var(--primary)] bg-[var(--card)] shadow-lg shadow-[var(--primary)]/10 ring-1 ring-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--hover-bg)]"
      }`}
    >
      <div className="space-y-3">
        {/* Top bar: Type badge, domain & favorite star */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase ${typeConfig.color}`}
            >
              <IconComp className="h-3 w-3" />
              {resource.resourceType || "LINK"}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[120px]">
              {getDomain(resource.url)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(resource);
            }}
            className="p-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
            title={resource.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star
              className={`h-4 w-4 ${
                resource.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Notes preview */}
        {resource.notes && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)]">
            {resource.notes}
          </p>
        )}

        {/* Categories Pills */}
        {resource.categories && resource.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {resource.categories.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1 rounded-md bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)]"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color || "#6366f1" }} />
                {c.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer actions */}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-4 text-[10px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {formattedDate}
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <a
            href={resource.url.startsWith("http") ? resource.url : `https://${resource.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all"
            title="Open external link"
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={() => openDrawer(resource)}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="Edit Resource"
          >
            <Edit2 className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              if (confirm("Delete this resource bookmark?")) deleteResource(resource.id);
            }}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Delete Resource"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
