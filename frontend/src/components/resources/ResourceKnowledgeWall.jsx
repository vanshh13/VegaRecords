"use client";

import ResourceCard from "./ResourceCard";
import { Sparkles } from "lucide-react";

export default function ResourceKnowledgeWall({ resources }) {
  // Group resources by type for knowledge wall spatial visualization
  const grouped = resources.reduce((acc, r) => {
    const key = r.resourceType || "OTHER";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const typeKeys = Object.keys(grouped);

  if (typeKeys.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 font-mono">
      {typeKeys.map((type) => (
        <div key={type} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              {type} ({grouped[type].length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[type].map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
