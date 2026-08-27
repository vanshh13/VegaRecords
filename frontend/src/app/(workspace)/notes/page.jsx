"use client";

import { useEffect, useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNoteStore } from "@/stores/note.store";
import NoteHeader from "@/components/notes/NoteHeader";
import NoteCategorySidebar from "@/components/notes/NoteCategorySidebar";
import NoteCard from "@/components/notes/NoteCard";
import NoteEditor from "@/components/notes/NoteEditor";
import NoteDrawer from "@/components/notes/NoteDrawer";
import CommandPalette from "@/components/notes/CommandPalette";
import { BookOpen, RefreshCw, Edit3, Star, Sparkles, Minimize2, Eye } from "lucide-react";

export default function NotesPage() {
  const { notes, isLoading, fetchNotes, viewMode, selectedNote, focusMode, toggleFocusMode } = useNoteStore();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("editor"); // 'list' | 'editor'

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Press ESC to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && focusMode) {
        toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode, toggleFocusMode]);

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = notes.length;
    const favorites = notes.filter((n) => n.isFavorite).length;
    const totalWords = notes.reduce((acc, n) => {
      const words = (n.content || "").trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
    return { total, favorites, totalWords };
  }, [notes]);

  return (
    <MainLayout>
      <div className="task-workspace-root flex flex-col space-y-4 font-mono min-h-0">
        {/* Focus Mode Exit Header Banner */}
        {focusMode && (
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--primary)]/40 rounded-2xl p-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
              <Eye className="h-4 w-4 text-[var(--primary)] animate-pulse" />
              <span>DISTRACTION-FREE FOCUS MODE</span>
              <span className="text-[10px] text-[var(--text-muted)] font-normal hidden sm:inline">
                (Press ESC or click button to exit)
              </span>
            </div>

            <button
              onClick={toggleFocusMode}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              <Minimize2 className="h-4 w-4" /> Exit Focus
            </button>
          </div>
        )}

        {/* Header Bar */}
        {!focusMode && <NoteHeader onOpenCommandPalette={() => setCmdPaletteOpen(true)} />}

        {/* Tactical Stat Strip */}
        {!focusMode && (
          <div className="task-stats-strip">
            <div className="task-stat-card">
              <div className="task-stat-icon text-[#8b5cf6]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="task-stat-content">
                <span className="task-stat-value text-white">{stats.total}</span>
                <span className="task-stat-label">Knowledge Notes</span>
                <span className="task-stat-sub">Vault documents</span>
              </div>
            </div>

            <div className="task-stat-card">
              <div className="task-stat-icon text-amber-400">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
              <div className="task-stat-content">
                <span className="task-stat-value text-amber-400">{stats.favorites}</span>
                <span className="task-stat-label">Pinned Favorites</span>
                <span className="task-stat-sub">Important references</span>
              </div>
            </div>

            <div className="task-stat-card">
              <div className="task-stat-icon text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="task-stat-content">
                <span className="task-stat-value text-cyan-400">{stats.totalWords.toLocaleString()}</span>
                <span className="task-stat-label">Words Logged</span>
                <span className="task-stat-sub">Markdown content</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile / Tablet Tab Switcher (< lg screens & not focusMode) */}
        {!focusMode && (
          <div className="flex lg:hidden items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1.5 gap-1">
            <button
              onClick={() => setMobileTab("list")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                mobileTab === "list"
                  ? "bg-[#8b5cf6] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Notes List
            </button>
            <button
              onClick={() => setMobileTab("editor")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                mobileTab === "editor"
                  ? "bg-[#8b5cf6] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </button>
          </div>
        )}

        {/* Responsive Workspace Layout: Full 12-col Grid when no note selected | 5-col / 7-col split when note is active */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 lg:h-[calc(100vh-18rem)]">
          {/* Note List Container */}
          <div
            className={`${
              focusMode || !selectedNote
                ? "col-span-12"
                : mobileTab === "list"
                ? "block"
                : "hidden lg:block lg:col-span-5"
            } flex flex-col h-[500px] lg:h-full overflow-y-auto custom-scrollbar rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-4`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-xs font-bold text-[var(--text-muted)] gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="task-empty-state h-full my-auto">
                <div className="task-page-icon mb-2">
                  <BookOpen className="h-6 w-6 text-[#8b5cf6]" />
                </div>
                <h3 className="task-empty-title">Knowledge Base Empty</h3>
                <p className="task-empty-desc">
                  Create markdown notes to build your personal wiki & knowledge system.
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  !selectedNote
                    ? viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                    : "grid-cols-1"
                }`}
              >

                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </div>

          {/* Right Editor Panel - Only rendered when a note is active and not in focus mode */}
          {!focusMode && selectedNote && (
            <div
              className={`${
                mobileTab === "editor" ? "block" : "hidden lg:block"
              } lg:col-span-7 h-[550px] lg:h-full overflow-hidden`}
            >
              <NoteEditor note={selectedNote} />
            </div>
          )}
        </div>


        {/* Right Slide-over Category Sidebar */}
        <NoteCategorySidebar />

        {/* Slide-over drawer for metadata or new note */}
        <NoteDrawer />

        {/* Ctrl+K Command Palette Modal */}
        <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
      </div>
    </MainLayout>
  );
}
