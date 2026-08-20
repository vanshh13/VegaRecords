"use client";

import Link from "next/link";
import { Star, Edit2, Trash2, Calendar, Clock, FileText, Tag, Maximize2 } from "lucide-react";
import { useNoteStore } from "@/stores/note.store";

export default function NoteCard({ note }) {
  const { toggleFavorite, openDrawer, deleteNote, setSelectedNote, selectedNote } = useNoteStore();

  const isSelected = selectedNote?.id === note.id;

  // Calculate word count & reading time
  const wordCount = note.content ? note.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const updatedDate = note.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  return (
    <div
      onClick={() => setSelectedNote(note)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 font-mono transition-all cursor-pointer ${
        isSelected
          ? "border-[var(--primary)] bg-[var(--card)] shadow-lg shadow-[var(--primary)]/10 ring-1 ring-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--hover-bg)]"
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Category Tag & Favorite */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 rounded-md bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">
            <Tag className="h-3 w-3" />
            {note.categoryName || "Uncategorized"}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(note);
            }}
            className="p-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
            title={note.isFavorite ? "Remove Favorite" : "Mark Favorite"}
          >
            <Star
              className={`h-4 w-4 ${
                note.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {note.title}
        </h3>

        {/* Content Excerpt Preview */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] font-sans">
          {note.content ? note.content.replace(/<[^>]*>?/gm, "") : "Empty note content..."}
        </p>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-4 text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" /> {wordCount} words
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readingTime} min
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/notes/${note.id}`}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
            title="Open Note Workspace Editor"
          >
            <Maximize2 className="h-3 w-3" />
          </Link>

          <button
            onClick={() => openDrawer(note)}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="Edit Note Metadata"
          >
            <Edit2 className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              if (confirm("Delete this note permanently?")) deleteNote(note.id);
            }}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Delete Note"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
