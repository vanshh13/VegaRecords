"use client";

import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { useAuthStore } from "@/stores/auth.store";
import {
  FolderTree,
  Edit2,
  Trash2,
  Layers,
  PlusCircle,
  Film,
  Tv,
  BookOpen,
  GraduationCap,
  Gamepad2,
  Award,
  Activity,
  Calendar,
  Globe,
  User,
} from "lucide-react";

const TYPE_ICONS = {
  Movie: Film,
  Series: Tv,
  Anime: Tv,
  Book: BookOpen,
  Course: GraduationCap,
  Game: Gamepad2,
  Certification: Award,
  Fitness: Activity,
};

export default function TrackerTypeCard({ trackerType }) {
  const { openDrawer, openFieldBuilder, deleteTrackerType } = useTrackerTypeStore();
  const { user } = useAuthStore();

  const userRole = (typeof user?.role === "string" ? user.role : user?.role?.roleName)?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  const IconComp = TYPE_ICONS[trackerType.name] || FolderTree;
  const fieldsCount = trackerType.fields?.length || 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 font-mono shadow-md hover:border-[var(--primary)]/50 hover:shadow-xl transition-all duration-300">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl border shadow-inner"
              style={{
                backgroundColor: `${trackerType.color || "#6366f1"}15`,
                borderColor: `${trackerType.color || "#6366f1"}40`,
                color: trackerType.color || "#6366f1",
              }}
            >
              <IconComp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                  {trackerType.name}
                </h3>
                {trackerType.isSystem ? (
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[var(--primary)]/15 border border-[var(--primary)]/40 text-[var(--primary)] font-mono flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" /> SYSTEM
                  </span>
                ) : (
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono flex items-center gap-1">
                    <User className="h-2.5 w-2.5" /> USER
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                <Layers className="h-3 w-3 text-[var(--primary)]" /> {fieldsCount} custom schema fields
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
          {trackerType.description || "No description provided."}
        </p>

        {/* Dynamic Schema Fields Badges */}
        {trackerType.fields && trackerType.fields.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {trackerType.fields.map((f) => (
              <span
                key={f.id}
                className="flex items-center gap-1 rounded-md bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)]"
              >
                <span className="text-[var(--primary)]">[{f.fieldType}]</span> {f.fieldName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-4 text-[10px] text-[var(--text-muted)]">
        <button
          onClick={() => openFieldBuilder(trackerType)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Schema Builder
        </button>

        <div className="flex items-center gap-1.5">
          <button
            disabled={trackerType.isSystem && !isAdmin}
            onClick={() => {
              if (trackerType.isSystem && !isAdmin) {
                alert("System tracker types cannot be modified by user role. Only admin can modify system tracker types.");
                return;
              }
              openDrawer(trackerType);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              trackerType.isSystem && !isAdmin
                ? "opacity-40 cursor-not-allowed border-gray-500/20 text-gray-500"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            title={trackerType.isSystem && !isAdmin ? "System tracker type - Only admin can edit" : "Edit Type"}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={trackerType.isSystem && !isAdmin}
            onClick={() => {
              if (trackerType.isSystem && !isAdmin) {
                alert("System tracker types can't be removed by user role. Only admin can remove tracker types with isSystem as true.");
                return;
              }
              if (confirm(`Delete tracker type "${trackerType.name}"?`)) deleteTrackerType(trackerType.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              trackerType.isSystem && !isAdmin
                ? "opacity-40 cursor-not-allowed border-gray-500/20 text-gray-500"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
            }`}
            title={trackerType.isSystem && !isAdmin ? "System tracker type - Only admin can remove" : "Delete Type"}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
