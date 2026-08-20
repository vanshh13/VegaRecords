"use client";

import { useState } from "react";
import Link from "next/link";
import { UserStatusBadge, UserRoleBadge } from "./UserStatusBadge";
import RoleSelector from "./RoleSelector";
import AdminConfirmationModal from "./AdminConfirmationModal";
import { ExternalLink, UserCheck, UserX, Eye, Shield } from "lucide-react";

export default function UserTable({ users, onStatusToggle, onRoleChange, isLoading }) {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const handleStatusClick = (u) => {
    setTargetUser(u);
    setStatusModalOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!targetUser) return;
    await onStatusToggle(targetUser.id, targetUser.isActive);
    setStatusModalOpen(false);
  };

  if (!users || users.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center font-mono">
        <p className="text-xs text-[var(--text-muted)]">No users found matching query filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-3.5 px-4">User Identity</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-xs text-[var(--text)]">
            {users.map((u) => {
              const displayName =
                u.firstName || u.lastName
                  ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                  : `@${u.username}`;

              const formattedDate = u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Aug 2026";

              return (
                <tr key={u.id} className="hover:bg-[var(--hover-bg)] transition-colors group">
                  {/* User Identity Avatar & Username */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white text-xs font-bold shadow-sm">
                        {u.firstName?.[0] || u.username?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                          {displayName}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">@{u.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">{u.email}</td>

                  {/* Role Selector / Badge */}
                  <td className="py-3.5 px-4">
                    <RoleSelector userItem={u} onRoleChange={onRoleChange} isLoading={isLoading} />
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <UserStatusBadge isActive={u.isActive} />
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Inspect User Details */}
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all"
                        title="View User Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-[var(--primary)]" />
                        Details
                      </Link>

                      {/* Status Toggle Button */}
                      <button
                        onClick={() => handleStatusClick(u)}
                        disabled={isLoading}
                        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                          u.isActive
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                        title={u.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {u.isActive ? (
                          <>
                            <UserX className="h-3.5 w-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5" /> Activate
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog for Status Change */}
      {targetUser && (
        <AdminConfirmationModal
          isOpen={statusModalOpen}
          title={targetUser.isActive ? "Deactivate User Account?" : "Activate User Account?"}
          message={`Are you sure you want to ${
            targetUser.isActive ? "deactivate" : "activate"
          } user @${targetUser.username} (${targetUser.email})?`}
          warningMessage={
            targetUser.isActive
              ? "Deactivating this account invalidates active JWT refresh tokens and restricts user login access."
              : null
          }
          confirmText={targetUser.isActive ? "Deactivate Account" : "Activate Account"}
          confirmVariant={targetUser.isActive ? "danger" : "primary"}
          isLoading={isLoading}
          onConfirm={handleStatusConfirm}
          onClose={() => setStatusModalOpen(false)}
        />
      )}
    </>
  );
}
