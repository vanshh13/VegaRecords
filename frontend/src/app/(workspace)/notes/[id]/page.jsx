"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { noteApi } from "@/apis/note.api";
import NoteEditor from "@/components/notes/NoteEditor";
import { ArrowLeft, BookOpen, Star, Tag, Calendar, Clock } from "lucide-react";

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      noteApi
        .getById(id)
        .then((data) => setNote(data))
        .catch(() => setError("Note not found"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
          Opening note editor...
        </div>
      </MainLayout>
    );
  }

  if (error || !note) {
    return (
      <MainLayout>
        <div className="p-6 font-mono space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Notes
          </button>
          <p className="text-xs text-rose-400 font-bold">Note not found or access denied.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] font-mono flex flex-col space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--primary)]" /> Back to Workspace
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              Full-Screen Editor View
            </span>
          </div>
        </div>

        {/* Editor Component */}
        <div className="flex-1 h-full overflow-hidden">
          <NoteEditor note={note} onSave={() => router.refresh()} />
        </div>
      </div>
    </MainLayout>
  );
}
