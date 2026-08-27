"use client";

import { Clock, Plus, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProgressHistoryTimeline({ values = [] }) {
  if (!values || values.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center space-y-2 font-mono">
        <Clock className="h-6 w-6 text-[var(--primary)] opacity-40 mx-auto animate-pulse" />
        <h4 className="text-xs font-bold text-[var(--text)]">No Log History Yet</h4>
        <p className="text-[11px] text-[var(--text-muted)]">
          Increment episodes, pages, or modules to build a progress timeline log.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      <h3 className="text-xs font-extrabold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-[var(--primary)]" /> Progress Activity History Timeline
      </h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
        {values.map((item, idx) => {
          const valText = typeof item.valueJson === "string" ? item.valueJson : JSON.stringify(item.valueJson);
          const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) : "Just now";

          return (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              </div>

              {/* Log Card */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xs space-y-1 hover:border-[var(--primary)]/40 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold">
                  <span className="flex items-center gap-1 text-[var(--primary)]">
                    <CheckCircle2 className="h-3 w-3" /> Logged Action
                  </span>
                  <span>{dateStr}</span>
                </div>
                <p className="font-extrabold text-[var(--text)]">{valText || "Progress incremented"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
