"use client";

import { useState, useEffect } from "react";
import { useNoteStore } from "@/stores/note.store";
import { Search, BookOpen, Plus, X, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette({ isOpen, onClose }) {
  const { notes, openDrawer, setSelectedNote } = useNoteStore();
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setSearch("");
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (note) => {
    setSelectedNote(note);
    onClose();
    router.push(`/notes/${note.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 font-mono">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 bg-[var(--card)]">
          <Search className="h-5 w-5 text-[var(--primary)] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search notes (Ctrl+K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-[var(--text)] focus:outline-none placeholder:text-[var(--text-muted)] font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Shortcut */}
        <div className="px-4 pt-1">
          <button
            onClick={() => {
              onClose();
              openDrawer();
            }}
            className="w-full flex items-center justify-between rounded-xl border border-dashed border-[var(--primary)]/50 bg-[var(--primary)]/10 p-3 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create New Note
            </div>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto px-4 pb-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] py-2">
            Notes ({filteredNotes.length})
          </div>

          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleSelect(note)}
              className="w-full flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-[var(--card)] border border-transparent hover:border-[var(--border)]"
            >
              <div className="space-y-0.5 truncate pr-2">
                <div className="font-bold text-xs text-[var(--text)] flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                  <span className="truncate">{note.title}</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate pl-5">
                  {note.categoryName ? `[${note.categoryName}] ` : ""}
                  {note.content ? note.content.substring(0, 60) : ""}
                </div>
              </div>

              {note.isFavorite && (
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
              )}
            </button>
          ))}

          {filteredNotes.length === 0 && (
            <p className="text-center py-6 text-xs text-[var(--text-muted)]">
              No matching notes found. Press Esc to exit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
