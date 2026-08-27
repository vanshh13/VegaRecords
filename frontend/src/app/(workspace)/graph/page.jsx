"use client";

import MainLayout from "@/components/layout/MainLayout";
import KnowledgeGraphCanvas from "@/components/graph/KnowledgeGraphCanvas";
import { motion } from "framer-motion";
import { Share2, Sparkles } from "lucide-react";

export default function GraphPage() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div style={{ marginBottom: 16 }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
            }}
          >
            <Share2 size={20} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text)",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Knowledge Graph
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "rgba(168, 85, 247, 0.15)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#a855f7",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={10} style={{ display: "inline", marginRight: 3 }} />
                Neural
              </span>
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Visualize connections between all your knowledge entities
            </p>
          </div>
        </motion.div>
      </div>

      {/* Graph Canvas - Full remaining height */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          height: "calc(100vh - 200px)",
          minHeight: 500,
          borderRadius: 20,
          border: "1px solid var(--border)",
          background: "var(--card)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <KnowledgeGraphCanvas />
      </motion.div>
    </MainLayout>
  );
}
