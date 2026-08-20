"use client";

import { useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/stores/admin.store";
import { useCategoryStore } from "@/stores/category.store";
import {
  Users,
  UserCheck,
  UserX,
  FolderTree,
  Shield,
  ArrowRight,
  Sparkles,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { adminStats, fetchAdminStats, fetchUsers, users } = useAdminStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchAdminStats();
    fetchUsers(0);
    fetchCategories();
  }, [fetchAdminStats, fetchUsers, fetchCategories]);

  const systemCatCount =
    categories.filter((c) => c.isSystem || c.isSystem === undefined).length ||
    adminStats.totalSystemCategories ||
    6;

  const STAT_CARDS = [
    {
      title: "Total Registered Users",
      value: adminStats.totalUsers || users.length || 1,
      subtitle: "System User Accounts",
      icon: Users,
      color: "text-[var(--primary)]",
      bg: "bg-[var(--primary)]/10 border-[var(--primary)]/30",
    },
    {
      title: "Active Users",
      value: adminStats.activeUsers || users.filter((u) => u.isActive !== false).length || 1,
      subtitle: "Verified Login Privilege",
      icon: UserCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Inactive Users",
      value: adminStats.inactiveUsers || users.filter((u) => u.isActive === false).length || 0,
      subtitle: "Deactivated / Restricted",
      icon: UserX,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      title: "Total System Categories",
      value: systemCatCount,
      subtitle: "Global System Taxonomy",
      icon: FolderTree,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 font-mono">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-3xl" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-1 text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                ADMINISTRATION OVERVIEW
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
              VegaHQ System Control Panel
            </h1>
            <p className="text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Lightweight operational center for managing user access, system category taxonomies, and platform security.
            </p>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAT_CARDS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-sm hover:border-[var(--primary)]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold text-[var(--text)] tracking-tight">{stat.value}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Quick-Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management Quick Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">User Account Control</h3>
                <p className="text-xs text-[var(--text-muted)]">Search, filter, activate/deactivate, and promote user roles.</p>
              </div>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all group"
            >
              <span>Manage User Roster</span>
              <ArrowRight className="h-4 w-4 text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* System Category Quick Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">System Category Taxonomy</h3>
                <p className="text-xs text-[var(--text-muted)]">Maintain global categories (Education, Tech, Career, Health...).</p>
              </div>
            </div>
            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-xs font-bold text-[var(--text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all group"
            >
              <span>Manage System Categories</span>
              <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
