"use client";

import { useResourceStore } from "@/stores/resource.store";
import {
  X,
  ExternalLink,
  Star,
  Edit2,
  Trash2,
  Calendar,
  Globe,
  Tag,
  FileText,
  Bookmark,
} from "lucide-react";

export default function ResourceDetailsPanel() {
  const { selectedResource, setSelectedResource, toggleFavorite, openDrawer, deleteResource } =
    useResourceStore();

  if (!selectedResource) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center font-mono">
        <Bookmark className="h-10 w-10 text-[var(--text-muted)] opacity-30 mb-3" />
        <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">No Resource Selected</h4>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[200px]">
          Click any resource card or row to inspect its full bookmark details & notes.
        </p>
      </div>
    );
  }

  const getDomain = (urlStr) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "web resource";
    }
  };

  const formattedDate = selectedResource.createdAt
    ? new Date(selectedResource.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] font-mono shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--card)]">
        <span className="rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] uppercase">
          {selectedResource.resourceType || "LINK"}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(selectedResource)}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-amber-400 transition-colors"
          >
            <Star
              className={`h-4 w-4 ${
                selectedResource.isFavorite ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setSelectedResource(null)}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-[var(--text)] leading-snug">
            {selectedResource.title}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Globe className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>{getDomain(selectedResource.url)}</span>
          </div>
        </div>

        {/* Primary CTA: Open Link */}
        <a
          href={selectedResource.url.startsWith("http") ? selectedResource.url : `https://${selectedResource.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[var(--primary)]/90 transition-all"
        >
          Open External Resource <ExternalLink className="h-4 w-4" />
        </a>

        {/* Notes */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[var(--primary)]" /> Notes & Excerpt
          </h4>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed">
            {selectedResource.notes || "No notes added for this bookmark."}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-[var(--primary)]" /> Connected Categories
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedResource.categories && selectedResource.categories.length > 0 ? (
              selectedResource.categories.map((c) => (
                <span
                  key={c.id}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-bold text-[var(--text)]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color || "#6366f1" }} />
                  {c.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--text-muted)] font-italic">Uncategorized</span>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span>Bookmark ID:</span>
            <span className="font-mono text-[10px] truncate max-w-[120px]">{selectedResource.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Added On:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--card)] flex items-center gap-2">
        <button
          onClick={() => openDrawer(selectedResource)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this bookmark?")) deleteResource(selectedResource.id);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
