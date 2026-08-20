"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { resourceApi } from "@/apis/resource.api";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Globe,
  Tag,
  FileText,
  Calendar,
  Bookmark,
  Clock,
} from "lucide-react";

export default function ResourceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      resourceApi
        .getById(id)
        .then((data) => setResource(data))
        .catch(() => setError("Resource not found"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-[var(--text-muted)]">
          Loading resource bookmark...
        </div>
      </MainLayout>
    );
  }

  if (error || !resource) {
    return (
      <MainLayout>
        <div className="p-6 font-mono space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </button>
          <p className="text-xs text-rose-400 font-bold">Resource not found or access denied.</p>
        </div>
      </MainLayout>
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

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto font-mono space-y-6">
        {/* Top Back Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--primary)]" /> Back to Vault
        </button>

        {/* Main Container */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1 text-xs font-bold text-[var(--primary)] uppercase">
                {resource.resourceType || "LINK"}
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-[var(--primary)]" /> {getDomain(resource.url)}
              </span>
            </div>

            {resource.isFavorite && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> Favorite Bookmark
              </span>
            )}
          </div>

          {/* Resource Title */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--text)] leading-tight">
            {resource.title}
          </h1>

          {/* Action Button: Open Link */}
          <a
            href={resource.url.startsWith("http") ? resource.url : `https://${resource.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-all"
          >
            Open Resource Link <ExternalLink className="h-4 w-4" />
          </a>

          {/* Categories Section */}
          {resource.categories && resource.categories.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[var(--primary)]" /> Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {resource.categories.map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text)]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color || "#6366f1" }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Summary Section */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[var(--primary)]" /> Notes & Takeaways
            </h4>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed shadow-inner">
              {resource.notes || "No additional notes saved for this resource bookmark."}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Added: {new Date(resource.createdAt).toLocaleDateString()}
            </span>
            <span className="font-mono text-[11px]">ID: {resource.id}</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
