"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { motion } from "framer-motion";

import GlobalCommandPalette from "@/components/common/GlobalCommandPalette";

export default function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)]">
        {/* Responsive Sidebar (Desktop Fixed + Mobile Overlay Drawer) */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Right Content Column with isolated scroll */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
          <TopNav onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto max-w-7xl pb-12"
            >
              {children}
            </motion.div>
          </main>
        </div>

        {/* Global Command Palette Modal (Ctrl+K) */}
        <GlobalCommandPalette />
      </div>
    </ProtectedRoute>
  );
}
