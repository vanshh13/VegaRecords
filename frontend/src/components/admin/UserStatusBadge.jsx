"use client";

import { Shield, User, CheckCircle2, XCircle } from "lucide-react";

export function UserStatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider ${
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-rose-500/30 bg-rose-500/10 text-rose-400"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 text-rose-400" />
          Inactive
        </>
      )}
    </span>
  );
}

export function UserRoleBadge({ role }) {
  const isAdmin = role?.toUpperCase() === "ADMIN" || role?.toUpperCase() === "ROLE_ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider ${
        isAdmin
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]"
      }`}
    >
      {isAdmin ? (
        <>
          <Shield className="h-3 w-3 text-[var(--primary)]" />
          ADMIN
        </>
      ) : (
        <>
          <User className="h-3 w-3 text-[var(--text-muted)]" />
          USER
        </>
      )}
    </span>
  );
}
