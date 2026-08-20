"use client";

import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import AnimatedBackground from "@/components/theme/AnimatedBackground";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-[var(--background)] text-[var(--text)] transition-colors duration-500 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-xl shadow-[var(--primary)]/30 mb-4 border border-white/20">
            <Zap className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2 font-mono">
            VegaRecords <Sparkles className="h-4 w-4 text-[var(--primary)]" />
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{subtitle || "Personal OS & Knowledge Hub"}</p>
        </div>

        {/* Auth Content */}
        {children}
      </motion.div>
    </div>
  );
}

