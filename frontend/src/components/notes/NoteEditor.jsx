"use client";

import { useState, useEffect, useRef } from "react";
import { useNoteStore } from "@/stores/note.store";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Save,
  Check,
  FileText,
  Clock,
  Sparkles,
  Tag,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

export default function NoteEditor({ note, onSave }) {
  const { updateNote, focusMode, toggleFocusMode, setSelectedNote } = useNoteStore();


  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  // Calculate metrics
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async () => {
    if (!note || !title.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content,
        categoryId: note.categoryId,
        trackerId: note.trackerId,
        isFavorite: note.isFavorite,
      };
      await updateNote(note.id, payload);
      setLastSaved(new Date());
      if (onSave) onSave();
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to insert markdown elements at cursor position
  const insertFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const replacement = `${prefix}${selectedText || "text"}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 50);
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center font-mono">
        <Sparkles className="h-12 w-12 text-[var(--primary)] opacity-30 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-[var(--text)]">No Note Selected</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs">
          Select a note from the list or create a new note to open the Obsidian-style workspace editor.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] font-mono shadow-sm overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-[var(--border)] bg-[var(--card)]">
        {/* Formatting Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => insertFormatting("# ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("## ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("### ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />

          <button
            onClick={() => insertFormatting("**", "**")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors font-bold"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("*", "*")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors italic"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("```\n", "\n```")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("> ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />

          <button
            onClick={() => insertFormatting("- ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("1. ", "")}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Save Status & Actions */}
        <div className="flex items-center gap-2">
          {/* Focus Mode Button */}
          <button
            onClick={toggleFocusMode}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              focusMode
                ? "border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] shadow-sm"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title={focusMode ? "Exit Fullscreen Focus Mode" : "Enter Fullscreen Focus Mode"}
          >
            {focusMode ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit Focus</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Focus</span>
              </>
            )}
          </button>

          <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
            {isSaving ? (
              <span className="text-[var(--primary)] font-bold animate-pulse">Saving...</span>
            ) : lastSaved ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="h-3 w-3" /> Saved
              </span>
            ) : null}
          </span>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>

          <button
            onClick={() => setSelectedNote(null)}
            className="p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors"
            title="Close Editor (Return to Full Grid View)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>


      {/* Editor Body */}
      <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
        {/* Title Field */}
        <input
          type="text"
          placeholder="Untitled Note..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-xl sm:text-2xl font-extrabold text-[var(--text)] border-b border-[var(--border)] pb-2 focus:border-[var(--primary)] focus:outline-none placeholder:opacity-40"
        />

        {/* Category Pill Tag */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] px-2.5 py-1 text-xs font-bold text-[var(--primary)]">
            <Tag className="h-3.5 w-3.5" /> {note.categoryName || "Uncategorized"}
          </span>
        </div>

        {/* Markdown Content Area */}
        <textarea
          ref={textareaRef}
          rows={15}
          placeholder="Start writing note content in Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full bg-transparent text-xs sm:text-sm text-[var(--text)] focus:outline-none resize-none leading-relaxed font-mono"
        />
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between p-3 border-t border-[var(--border)] bg-[var(--card)] text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-[var(--primary)]" /> {wordCount} Words
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[var(--primary)]" /> {readingTime} min read
          </span>
        </div>

        <span>Obsidian Markdown Engine</span>
      </div>
    </div>
  );
}
