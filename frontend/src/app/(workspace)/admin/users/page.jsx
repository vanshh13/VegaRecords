"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserTable from "@/components/admin/UserTable";
import { useAdminStore } from "@/stores/admin.store";
import { Search, Filter, Users, Shield, RefreshCw } from "lucide-react";

export default function AdminUsersPage() {
  const {
    users,
    fetchUsers,
    setFilter,
    filters,
    isLoading,
    toggleUserStatus,
    updateUserRole,
  } = useAdminStore();

  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter("search", searchInput);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-mono">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] flex items-center gap-2.5">
              <Users className="h-6 w-6 text-[var(--primary)]" /> User Management
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Inspect user identities, filter by status or role, manage account privileges, and toggle activation states.
            </p>
          </div>

          <button
            onClick={() => fetchUsers(0)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh Roster
          </button>
        </div>

        {/* Filter Controls & Search Input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by username, email, or name..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>

            {/* Status Filter */}
            {[
              { id: "ALL", label: "All Status" },
              { id: "ACTIVE", label: "Active" },
              { id: "INACTIVE", label: "Inactive" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter("statusFilter", f.id)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                  filters.statusFilter === f.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {f.label}
              </button>
            ))}

            <div className="h-4 w-px bg-[var(--border)] mx-1" />

            {/* Role Filter */}
            {[
              { id: "ALL", label: "All Roles" },
              { id: "ADMIN", label: "Admin Only" },
              { id: "USER", label: "Users Only" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setFilter("roleFilter", r.id)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                  filters.roleFilter === r.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <UserTable
          users={users}
          onStatusToggle={toggleUserStatus}
          onRoleChange={updateUserRole}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
