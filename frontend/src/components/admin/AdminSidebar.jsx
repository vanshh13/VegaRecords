"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  ArrowLeft,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, badge: "CORE" },
  { name: "Users", href: "/admin/users", icon: Users, badge: "MANAGEMENT" },
  { name: "System Categories", href: "/admin/categories", icon: FolderTree, badge: "SYSTEM" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all">
      {/* Sci-Fi Admin HQ Header */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-[var(--primary)]/30 border border-white/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-[var(--text)] font-mono tracking-wider">
                VEGA HQ
              </span>
              <span className="rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-400">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">System Control Center</p>
          </div>
        </div>
      </div>

      {/* Admin User Info Strip */}
      <div className="mx-3 my-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 space-y-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-muted)]">Active Admin:</span>
          <span className="font-bold text-[var(--primary)] truncate max-w-[100px]">
            @{user?.username || "root"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>FULL ACCESS GRANTED</span>
        </div>
      </div>

      {/* Admin Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Admin Management
        </div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold transition-all ${
                isActive
                  ? "border border-[var(--primary)]/50 bg-[var(--primary)]/20 text-[var(--primary)] shadow-md shadow-[var(--primary)]/10"
                  : "border border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-[var(--primary)] animate-pulse" : ""}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-1.5 py-0.5 text-[9px] font-mono text-[var(--primary)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back To Workspace Link */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--primary)]" />
          <span>Back To Workspace</span>
        </Link>
      </div>
    </aside>
  );
}
