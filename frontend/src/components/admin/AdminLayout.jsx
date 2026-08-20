"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import AdminSidebar from "./AdminSidebar";
import AnimatedBackground from "@/components/theme/AnimatedBackground";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const userRole = user?.role?.toUpperCase() || "";
      const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

      if (!isAuthenticated || !isAdmin) {
        setAuthorized(false);
        const timer = setTimeout(() => {
          router.replace("/dashboard");
        }, 1800);
        return () => clearTimeout(timer);
      } else {
        setAuthorized(true);
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)] font-mono text-xs text-[var(--text-muted)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <span>Verifying Admin Authority...</span>
        </div>
      </div>
    );
  }

  const userRole = user?.role?.toUpperCase() || "";
  const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)] p-4 font-mono">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-rose-500/40 bg-[var(--surface)] p-8 text-center shadow-2xl space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text)]">ACCESS RESTRICTED</h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            You do not have administrative privilege to access the VegaHQ Admin Panel.
          </p>
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-[11px] text-rose-400 font-bold">
            Redirecting to User Workspace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--text)] antialiased relative">
      <AnimatedBackground />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Viewport */}
      <main className="pl-64 transition-all duration-300 min-h-screen relative z-10">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--primary)]" />
            <h1 className="text-sm font-extrabold font-mono text-[var(--text)] uppercase tracking-wider">
              Administration Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono font-bold text-emerald-400">
              SECURE ADMIN SESSION
            </span>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
