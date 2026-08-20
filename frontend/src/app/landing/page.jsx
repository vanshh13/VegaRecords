"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useThemeStore, MOTION_PRESETS } from "@/stores/theme.store";
import { useAuthStore } from "@/stores/auth.store";
import {
  Zap,
  Sparkles,
  FolderTree,
  Activity,
  LayoutDashboard,
  Palette,
  ArrowRight,
  Terminal,
  Search,
  Cpu,
  User,
} from "lucide-react";
import AnimatedBackground from "@/components/theme/AnimatedBackground";

export default function LandingPage() {
  const { motionPreset, setMotionPreset } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-500 relative overflow-x-hidden selection:bg-[var(--primary)] selection:text-white">
      <AnimatedBackground />

      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-6 sm:px-12 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white shadow-xl shadow-[var(--primary)]/30 border border-white/20">
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-[var(--text)] font-mono">
            VEGA<span className="text-[var(--primary)]">RECORDS</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-semibold text-[var(--text-muted)]">
          <a href="#features" className="hover:text-[var(--text)] transition-colors">FEATURES</a>
          <a href="#trackers" className="hover:text-[var(--text)] transition-colors">DYNAMIC TRACKERS</a>
          <a href="#motion-engine" className="hover:text-[var(--text)] transition-colors">MOTION ENGINE</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/50 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[10px]">
                  {user?.firstName?.[0] || <User className="h-3.5 w-3.5" />}
                </div>
                <span>{user?.username || "Profile"}</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-xs font-mono font-bold text-white shadow-xl shadow-[var(--primary)]/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors hidden sm:inline"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-xs font-mono font-bold text-white shadow-xl shadow-[var(--primary)]/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Sign Up <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 sm:px-12 text-center">
        {/* Futuristic Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-4 py-1.5 text-xs font-mono font-bold text-[var(--primary)] shadow-lg shadow-[var(--primary)]/10 mb-8"
        >
          <Sparkles className="h-4 w-4" /> PERSONAL KNOWLEDGE & PRODUCTIVITY OS
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text)] max-w-5xl mx-auto leading-tight"
        >
          Organize Knowledge, Track Progress & Master Tasks in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-purple-400 to-[var(--secondary)]">
            One Futuristic Workspace
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
        >
          VegaRecords combines Notion-style recursive category trees, dynamic custom trackers (Anime, Movies, Courses, Books, Projects), unified global search, event activity feeds, and a customizable theme engine into your personal operating hub.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-7 py-4 text-sm font-mono font-bold text-white shadow-2xl shadow-[var(--primary)]/40 hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Launch Workspace HUD <Zap className="h-5 w-5 fill-white" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-7 py-4 text-sm font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/50 transition-all backdrop-blur-xl"
              >
                My User Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-7 py-4 text-sm font-mono font-bold text-white shadow-2xl shadow-[var(--primary)]/40 hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Get Started Free <Zap className="h-5 w-5 fill-white" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-7 py-4 text-sm font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/50 transition-all backdrop-blur-xl"
              >
                Sign In to Account
              </Link>
            </>
          )}
        </motion.div>

        {/* Interactive Workspace Mockup Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-4 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-left border-indigo-500/30 max-w-5xl mx-auto"
        >
          {/* Top Mockup Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs font-mono text-slate-400">vegarecords-os://workspace</span>
            </div>

            {/* Interactive Mockup Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
              {[
                { id: "dashboard", label: "Dashboard HUD", icon: LayoutDashboard },
                { id: "trackers", label: "Dynamic Trackers", icon: Activity },
                { id: "categories", label: "Tree View", icon: FolderTree },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-[var(--primary)] text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Mockup Content Body */}
          <div className="p-6 pt-8 space-y-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">VEGARECORDS DASHBOARD HUD</h3>
                    <p className="text-xs text-slate-400">Real-time overview of tasks, notes, and activity</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 font-mono">
                    <Cpu className="h-4 w-4 text-emerald-400" /> NODE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">ACTIVE TRACKERS</span>
                    <p className="text-xl font-extrabold text-white font-mono">5 RUNNING</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">TASKS DUE TODAY</span>
                    <p className="text-xl font-extrabold text-amber-400 font-mono">3 PENDING</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">SYSTEM STATUS</span>
                    <p className="text-xl font-extrabold text-[var(--primary)] font-mono">SYNCHRONIZED</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "trackers" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-mono">CUSTOM DYNAMIC TRACKER ENGINE</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-[var(--primary)]/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white font-mono">🎬 One Piece Anime Series</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">EP 1095 / 1100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] w-[95%]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white font-mono">📚 Atomic Habits Book</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">CH 18 / 20</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <h3 className="text-lg font-bold text-white font-mono mb-4">NOTION-STYLE HIERARCHICAL KNOWLEDGE TREE</h3>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-[var(--primary)]" /> 📁 Software Engineering
                </div>
                <div className="pl-6 p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-slate-400">
                  ├─ ☕ Spring Boot Backend Architecture
                </div>
                <div className="pl-12 p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-emerald-400">
                  └─ ⚙️ Flyway Migrations & Neon PostgreSQL
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Live Motion Engine Interactive Switcher */}
      <section id="motion-engine" className="py-20 border-t border-[var(--border)] bg-black/20">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-mono flex items-center justify-center gap-3">
              <Zap className="h-7 w-7 text-[var(--primary)] animate-pulse" />
              Test Live Motion Engine Simulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-mono">
              Click any motion mode below to change the canvas background animation in real-time right here on this page!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {MOTION_PRESETS.map((m) => {
              const isSelected = motionPreset === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMotionPreset(m.id)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-mono transition-all ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white shadow-xl shadow-[var(--primary)]/20 scale-[1.05]"
                      : "border-[var(--border)] bg-[var(--surface)] text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className={`h-4 w-4 ${isSelected ? "text-[var(--primary)]" : ""}`} />
                  <span className="font-bold truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-24 border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              Engineered for Power & Aesthetic Perfection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Everything you need to capture ideas, organize data, and track progression in a futuristic environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Notion-Style Category Tree",
                desc: "Organize tasks, notes, resources, and trackers in recursive multi-level parent-child tree views.",
                icon: FolderTree,
                color: "text-[var(--primary)]",
              },
              {
                title: "Dynamic Custom Trackers",
                desc: "Create custom tracker types (Movies, Series, Books, Courses) with customizable dynamic field values.",
                icon: Activity,
                color: "text-emerald-400",
              },
              {
                title: "Futuristic HUD Navigation",
                desc: "Command your hub with a sticky sci-fi game-like sidebar HUD built with clean state management.",
                icon: Cpu,
                color: "text-amber-400",
              },
              {
                title: "Unified Global Search",
                desc: "Instant Notion-style Ctrl+K search across all entities, notes, trackers, tasks, and bookmarks.",
                icon: Search,
                color: "text-cyan-400",
              },
              {
                title: "Real-Time Activity Feed",
                desc: "Chronological event audit trail recording every creation, update, and milestone.",
                icon: Terminal,
                color: "text-purple-400",
              },
              {
                title: "Theme & Wallpaper Engine",
                desc: "Custom CSS color tokens, 7 canvas motion algorithms, static image backgrounds, and live MP4 video wallpapers.",
                icon: Palette,
                color: "text-rose-400",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 backdrop-blur-xl hover:border-[var(--primary)]/40 hover:shadow-2xl transition-all duration-300 space-y-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-[var(--border)]">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/90 py-12 px-6 sm:px-12 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white font-mono">
              VegaRecords OS v1.0
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Designed for Developers, Knowledge Seekers, & Power Users.
          </p>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-mono font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            Launch OS Now
          </Link>
        </div>
      </footer>
    </div>
  );
}
