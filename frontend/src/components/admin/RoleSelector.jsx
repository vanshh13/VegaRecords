"use client";

import { useState } from "react";
import { UserRoleBadge } from "./UserStatusBadge";
import AdminConfirmationModal from "./AdminConfirmationModal";
import { Shield, User, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function RoleSelector({ userItem, onRoleChange, isLoading = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState(null);

  const currentRole = userItem?.role?.toUpperCase() || "USER";
  const isAdmin = currentRole === "ADMIN" || currentRole === "ROLE_ADMIN";

  const handleRoleClick = (newRole) => {
    if (newRole === currentRole) return;
    setTargetRole(newRole);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetRole) return;
    await onRoleChange(userItem.id, targetRole);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 font-mono">
        <UserRoleBadge role={currentRole} />

        <div className="flex items-center gap-1">
          {!isAdmin ? (
            <button
              onClick={() => handleRoleClick("ADMIN")}
              disabled={isLoading}
              title="Promote User To Admin"
              className="flex items-center gap-1 rounded-lg border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-2 py-1 text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all"
            >
              <ArrowUpRight className="h-3 w-3" />
              Promote to Admin
            </button>
          ) : (
            <button
              onClick={() => handleRoleClick("USER")}
              disabled={isLoading}
              title="Demote Admin To Regular User"
              className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              <ArrowDownRight className="h-3 w-3" />
              Demote to User
            </button>
          )}
        </div>
      </div>

      {/* Role Change Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={modalOpen}
        title={targetRole === "ADMIN" ? "Promote User to Admin?" : "Demote Admin to Regular User?"}
        message={`Are you sure you want to change @${userItem.username}'s system role from ${currentRole} to ${targetRole}?`}
        warningMessage={
          targetRole === "USER"
            ? "WARNING: Demoting an admin removes their access to the administration panel. System requires at least one active ADMIN."
            : "Admins gain full management access over users and system categories."
        }
        confirmText={targetRole === "ADMIN" ? "Promote to Admin" : "Demote to User"}
        confirmVariant={targetRole === "ADMIN" ? "primary" : "warning"}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
