"use client";

import { ExternalLink, Star, Edit2, Trash2, Calendar } from "lucide-react";
import { useResourceStore } from "@/stores/resource.store";

export default function ResourceCompactList({ resources }) {
  const { toggleFavorite, openDrawer, deleteResource, setSelectedResource, selectedResource } =
    useResourceStore();

  const getDomain = (urlStr) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "web resource";
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] font-mono shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <th className="py-3 px-4 w-8">Fav</th>
            <th className="py-3 px-4">Title & Domain</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Categories</th>
            <th className="py-3 px-4">Added</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-xs">
          {resources.map((r) => {
            const isSelected = selectedResource?.id === r.id;
            return (
              <tr
                key={r.id}
                onClick={() => setSelectedResource(r)}
                className={`transition-colors cursor-pointer ${
                  isSelected ? "bg-[var(--primary)]/10 font-bold" : "hover:bg-[var(--card)]"
                }`}
              >
                {/* Favorite */}
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleFavorite(r)}>
                    <Star
                      className={`h-4 w-4 ${
                        r.isFavorite ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
                      }`}
                    />
                  </button>
                </td>

                {/* Title & Domain */}
                <td className="py-3 px-4">
                  <div className="font-bold text-[var(--text)]">{r.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{getDomain(r.url)}</div>
                </td>

                {/* Type */}
                <td className="py-3 px-4">
                  <span className="rounded-md bg-[var(--card)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    {r.resourceType || "LINK"}
                  </span>
                </td>

                {/* Categories */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap items-center gap-1">
                    {r.categories && r.categories.length > 0 ? (
                      r.categories.map((c) => (
                        <span
                          key={c.id}
                          className="rounded px-1.5 py-0.2 text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20"
                        >
                          {c.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)]">-</span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-[var(--text-muted)] text-[11px]">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={r.url.startsWith("http") ? r.url : `https://${r.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-1.5 text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                      title="Open Link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => openDrawer(r)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete resource?")) deleteResource(r.id);
                      }}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
