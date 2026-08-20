"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth.store";
import {
    LayoutDashboard,
    FolderTree,
    CheckSquare,
    Activity,
    Bookmark,
    FileText,
    Clock,
    Bell,
    Search,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap,
    Layers,
    User,
    Shield,
    X,
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: "CORE" },
    { name: "Categories", href: "/categories", icon: FolderTree, badge: "TREE" },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, badge: "BOARD" },
    { name: "Trackers", href: "/trackers", icon: Activity, badge: "LIVE" },
    { name: "Tracker Types", href: "/tracker-types", icon: Layers, badge: "SCHEMA" },
    { name: "Resources", href: "/resources", icon: Bookmark },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Activity", href: "/activity", icon: Clock },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Search", href: "/search", icon: Search },
];

export default function Sidebar({ mobileOpen = false, onMobileClose = () => { } }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAuthStore();

    const userRole = user?.role?.toUpperCase() || "";
    const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex h-full w-full flex-col select-none">
            {/* HUD Header Bar */}
            <div className="flex h-16 md:h-20 items-center justify-between px-4 border-b border-[var(--border)] relative overflow-hidden bg-[var(--hover-bg)]">
                {/* Subtle Cyberpunk HUD Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

                <Link
                    href="/dashboard"
                    onClick={() => isMobile && onMobileClose()}
                    className="flex items-center gap-3 overflow-hidden"
                >
                    <div className="relative flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white shadow-xl shadow-[var(--primary)]/40 border border-white/20">
                        <Zap className="h-5 w-5 md:h-6 md:w-6 animate-pulse text-white" />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[var(--surface)] text-[9px] font-extrabold">
                            ✓
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold tracking-tight text-[var(--text)] font-mono">
                                VEGA
                            </span>
                            <span className="rounded bg-[var(--primary)]/20 px-1.5 py-0.5 text-[9px] font-extrabold text-[var(--primary)] font-mono border border-[var(--primary)]/30">
                                SaaS
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
                            KNOWLEDGE HUB
                        </span>
                    </div>
                </Link>

                {/* Desktop Collapse Toggle / Mobile Close Button */}
                {isMobile ? (
                    <button
                        onClick={onMobileClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors shadow-sm"
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {/* Navigation List */}
            <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto custom-scrollbar">
                {isAdmin && (
                    <Link
                        href="/admin"
                        onClick={() => isMobile && onMobileClose()}
                        className={cn(
                            "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold transition-all mb-3",
                            pathname.startsWith("/admin")
                                ? "bg-rose-500/20 border border-rose-500/50 text-rose-400 shadow-md"
                                : "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-rose-400 shrink-0" />
                            {(!collapsed || isMobile) && <span>Admin HQ</span>}
                        </div>
                        {(!collapsed || isMobile) && (
                            <span className="rounded bg-rose-500/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase shrink-0 whitespace-nowrap leading-none">
                                PANEL
                            </span>
                        )}
                    </Link>
                )}

                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && onMobileClose()}
                            className={cn(
                                "group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-mono font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[var(--hover-bg)] text-[var(--primary)] font-bold shadow-sm"
                                    : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <div className="flex items-center gap-3.5 min-w-0">
                                <Icon
                                    className={cn(
                                        "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                                        isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                                    )}
                                />
                                {(!collapsed || isMobile) && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </div>

                            {(!collapsed || isMobile) && item.badge && (
                                <span
                                    className={cn(
                                        "rounded-md px-1.5 py-0.5 text-[9px] font-mono font-extrabold uppercase tracking-wider shrink-0 whitespace-nowrap leading-none",
                                        isActive
                                            ? "bg-[var(--primary)] text-white shadow-sm"
                                            : "bg-[var(--card)] text-[var(--text-muted)] border border-[var(--border)]"
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
                {!collapsed || isMobile ? (
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/profile"
                            onClick={() => isMobile && onMobileClose()}
                            className={cn(
                                "flex items-center gap-2 rounded-xl p-2.5 text-xs font-mono font-bold border transition-all",
                                pathname === "/profile"
                                    ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)] shadow-sm"
                                    : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"
                            )}
                        >
                            <User className="h-4 w-4 text-[var(--primary)] shrink-0" />
                            <span className="truncate">Profile</span>
                        </Link>

                        <Link
                            href="/settings/theme"
                            onClick={() => isMobile && onMobileClose()}
                            className={cn(
                                "flex items-center gap-2 rounded-xl p-2.5 text-xs font-mono font-bold border transition-all",
                                pathname.startsWith("/settings")
                                    ? "bg-[var(--secondary)]/20 border-[var(--secondary)]/50 text-[var(--secondary)] shadow-sm"
                                    : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--secondary)]/40"
                            )}
                        >
                            <Settings className="h-4 w-4 text-[var(--secondary)] shrink-0" />
                            <span className="truncate">Settings</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href="/profile"
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl border transition-all",
                                pathname === "/profile"
                                    ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)] shadow-sm"
                                    : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                            )}
                            title="User Profile"
                        >
                            <User className="h-4 w-4 text-[var(--primary)]" />
                        </Link>

                        <Link
                            href="/settings/theme"
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl border transition-all",
                                pathname.startsWith("/settings")
                                    ? "bg-[var(--secondary)]/20 border-[var(--secondary)]/50 text-[var(--secondary)] shadow-sm"
                                    : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                            )}
                            title="Theme & Engine Settings"
                        >
                            <Settings className="h-4 w-4 text-[var(--secondary)]" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 84 : 275 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex sticky top-0 left-0 h-screen shrink-0 z-40 flex-col border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
                <SidebarContent isMobile={false} />
            </motion.aside>

            {/* Mobile Sidebar Overlay Drawer (visible on mobile when mobileOpen is true) */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* Slide-out Mobile Panel */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 250 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl flex flex-col md:hidden"
                        >
                            <SidebarContent isMobile={true} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
