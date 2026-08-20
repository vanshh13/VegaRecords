"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserStatusBadge, UserRoleBadge } from "@/components/admin/UserStatusBadge";
import RoleSelector from "@/components/admin/RoleSelector";
import AdminConfirmationModal from "@/components/admin/AdminConfirmationModal";
import { useAdminStore } from "@/stores/admin.store";
import {
  User,
  Mail,
  Shield,
  Clock,
  ArrowLeft,
  UserCheck,
  UserX,
  Activity,
  CheckCircle2,
  Calendar,
  Key,
} from "lucide-react";

export default function AdminUserDetailPage({ params }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const { selectedUser, fetchUserById, toggleUserStatus, updateUserRole, isLoading } = useAdminStore();

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  const userItem = selectedUser || {
    id: userId,
    username: "user_commander",
    email: "user@vegarecords.io",
    firstName: "Vega",
    lastName: "User",
    role: "USER",
    isActive: true,
    createdAt: "2026-08-01T10:00:00Z",
  };

  const displayName =
    userItem.firstName || userItem.lastName
      ? `${userItem.firstName || ""} ${userItem.lastName || ""}`.trim()
      : `@${userItem.username}`;

  const formattedDate = userItem.createdAt
    ? new Date(userItem.createdAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "August 2026";

  const handleStatusConfirm = async () => {
    await toggleUserStatus(userItem.id, userItem.isActive);
    setStatusModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 font-mono">
        {/* Back Link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--primary)]" /> Back to Users List
        </Link>

        {/* Profile Card Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white text-2xl font-extrabold shadow-xl">
                {userItem.firstName?.[0] || userItem.username?.[0] || "U"}
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
                    {displayName}
                  </h1>
                  <UserRoleBadge role={userItem.role} />
                  <UserStatusBadge isActive={userItem.isActive} />
                </div>

                <p className="text-xs text-[var(--text-muted)] flex items-center justify-center md:justify-start gap-3">
                  <span>@{userItem.username}</span>
                  <span>•</span>
                  <span>{userItem.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Status Button */}
            <button
              onClick={() => setStatusModalOpen(true)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                userItem.isActive
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              {userItem.isActive ? (
                <>
                  <UserX className="h-4 w-4" /> Deactivate Account
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" /> Activate Account
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Basic Information & Account Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--primary)]" /> Basic User Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">User ID</span>
                  <p className="font-mono font-bold text-[var(--text)] truncate">{userItem.id}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Username Handle</span>
                  <p className="font-mono font-bold text-[var(--text)]">@{userItem.username}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Email Address</span>
                  <p className="font-mono font-bold text-[var(--text)]">{userItem.email}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Gender</span>
                  <p className="font-mono font-bold text-[var(--text)]">{userItem.gender || "Not Specified"}</p>
                </div>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--primary)]" /> Account Lifecycle & Status
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Account Joined Date</span>
                  <p className="font-mono font-bold text-[var(--text)]">{formattedDate}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Account State</span>
                  <div className="pt-1">
                    <UserStatusBadge isActive={userItem.isActive} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Role Management & Recent Activity (1 Col) */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--primary)]" /> System Role Management
              </h2>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Promote or demote user permissions. Admins possess full system control.
              </p>

              <div className="pt-2">
                <RoleSelector userItem={userItem} onRoleChange={updateUserRole} isLoading={isLoading} />
              </div>
            </div>

            {/* Recent Activity Summary Placeholder */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--primary)]" /> Recent Activity Summary
              </h2>

              <div className="space-y-2.5 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2 rounded-xl bg-[var(--card)] border border-[var(--border)] p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Account Session Verified</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[var(--card)] border border-[var(--border)] p-2.5">
                  <Clock className="h-4 w-4 text-[var(--primary)] shrink-0" />
                  <span>Last active in Workspace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={statusModalOpen}
        title={userItem.isActive ? "Deactivate User Account?" : "Activate User Account?"}
        message={`Are you sure you want to ${userItem.isActive ? "deactivate" : "activate"} user @${userItem.username}?`}
        confirmText={userItem.isActive ? "Deactivate Account" : "Activate Account"}
        confirmVariant={userItem.isActive ? "danger" : "primary"}
        isLoading={isLoading}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusModalOpen(false)}
      />
    </AdminLayout>
  );
}
