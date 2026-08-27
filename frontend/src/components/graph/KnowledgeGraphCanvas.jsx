"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import { motion } from "framer-motion";
import { Share2, Loader2, Unplug } from "lucide-react";
import { useKnowledgeGraphStore } from "@/stores/knowledgeGraph.store";
import GraphNodeCard from "./GraphNodeCard";
import GraphToolbar from "./GraphToolbar";
import LinkCreatorModal from "./LinkCreatorModal";
import CategoryRightSidebar from "./CategoryRightSidebar";

import "./graph.css";




// Custom node types
const nodeTypes = { entityNode: GraphNodeCard };

// Edge color mapping by relation type
const EDGE_COLORS = {
  RELATED_TO: "rgba(99, 102, 241, 0.5)",
  DEPENDS_ON: "rgba(239, 68, 68, 0.5)",
  REFERENCES: "rgba(245, 158, 11, 0.5)",
  PART_OF: "rgba(16, 185, 129, 0.5)",
  LEARNING_PATH: "rgba(168, 85, 247, 0.5)",
};

// Minimap node color mapping
const MINIMAP_COLORS = {
  TASK: "#3b82f6",
  NOTE: "#10b981",
  RESOURCE: "#f59e0b",
  TRACKER: "#a855f7",
  CATEGORY: "#ec4899",
};

/**
 * Simple force-directed layout algorithm.
 * Distributes nodes in a circular/organic pattern to avoid
 * relying on external layout libraries.
 */
function computeLayout(nodes, edges) {
  if (nodes.length === 0) return [];

  const positioned = nodes.map((n, i) => ({ ...n }));

  // Initial circular placement
  const radius = Math.max(200, nodes.length * 40);
  const centerX = 400;
  const centerY = 300;

  positioned.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    node.position = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Build adjacency
  const idToIndex = {};
  positioned.forEach((n, i) => (idToIndex[n.id] = i));

  // Simple force-directed iterations
  const iterations = 80;
  const repulsionForce = 15000;
  const attractionForce = 0.02;
  const damping = 0.9;

  const vx = new Array(positioned.length).fill(0);
  const vy = new Array(positioned.length).fill(0);

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < positioned.length; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        const dx = positioned[i].position.x - positioned[j].position.x;
        const dy = positioned[i].position.y - positioned[j].position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsionForce / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        vx[i] += fx;
        vy[i] += fy;
        vx[j] -= fx;
        vy[j] -= fy;
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const si = idToIndex[edge.source];
      const ti = idToIndex[edge.target];
      if (si === undefined || ti === undefined) continue;

      const dx = positioned[ti].position.x - positioned[si].position.x;
      const dy = positioned[ti].position.y - positioned[si].position.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = attractionForce * dist;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      vx[si] += fx;
      vy[si] += fy;
      vx[ti] -= fx;
      vy[ti] -= fy;
    }

    // Apply velocities
    for (let i = 0; i < positioned.length; i++) {
      vx[i] *= damping;
      vy[i] *= damping;
      positioned[i].position.x += vx[i];
      positioned[i].position.y += vy[i];
    }
  }

  return positioned;
}

export default function KnowledgeGraphCanvas() {
  const {
    fetchGraph,
    isLoading,
    error,
    openLinkCreator,
    setSelectedNode,
    getFilteredData,
    deleteLink,
  } = useKnowledgeGraphStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const hasInitialized = useRef(false);

  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);

  // Subscribe to store changes for filtering
  const storeNodes = useKnowledgeGraphStore((s) => s.nodes);
  const storeEdges = useKnowledgeGraphStore((s) => s.edges);
  const activeFilters = useKnowledgeGraphStore((s) => s.activeFilters);
  const searchQuery = useKnowledgeGraphStore((s) => s.searchQuery);
  const selectedCategoryId = useKnowledgeGraphStore((s) => s.selectedCategoryId);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchGraph();
    }
  }, [fetchGraph]);

  // Recompute layout when data or filters change
  useEffect(() => {
    const { filteredNodes, filteredEdges } = getFilteredData();

    // Apply edge styling
    const styledEdges = filteredEdges.map((e) => ({
      ...e,
      style: {
        stroke: EDGE_COLORS[e.data?.relationType] || "rgba(99, 102, 241, 0.5)",
        strokeWidth: 1.5,
      },
      labelStyle: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace" },
      labelBgStyle: {
        fill: "var(--surface)",
        fillOpacity: 0.85,
      },
    }));

    const laid = computeLayout(filteredNodes, styledEdges);
    setRfNodes(laid);
    setRfEdges(styledEdges);
  }, [storeNodes, storeEdges, activeFilters, searchQuery, selectedCategoryId, getFilteredData, setRfNodes, setRfEdges]);

  const handleNodeClick = useCallback(
    (_, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const handleNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      openLinkCreator(node);
    },
    [openLinkCreator]
  );

  const handleEdgeClick = useCallback(
    (_, edge) => {
      if (window.confirm(`Delete this "${edge.label}" link?`)) {
        deleteLink(edge.id);
      }
    },
    [deleteLink]
  );

  const minimapNodeColor = useCallback((node) => {
    return MINIMAP_COLORS[node.data?.entityType] || "#6366f1";
  }, []);

  const handleRefresh = useCallback(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Loading state
  if (isLoading && rfNodes.length === 0) {
    return (
      <div className="knowledge-graph-container" style={{ height: "100%", position: "relative" }}>
        <div className="graph-empty-state">
          <Loader2 size={40} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading knowledge graph...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Empty state
  if (!isLoading && rfNodes.length === 0) {
    return (
      <div className="knowledge-graph-container" style={{ height: "100%", position: "relative" }}>
        <GraphToolbar
          onRefresh={handleRefresh}
          onToggleCategorySidebar={() => setIsCategorySidebarOpen((v) => !v)}
          isCategorySidebarOpen={isCategorySidebarOpen}
        />
        <div className="graph-empty-state">
          <div className="graph-empty-state__icon">
            <Share2 size={32} style={{ color: "var(--text-muted)" }} />
          </div>
          <h3 className="graph-empty-state__title">No Knowledge Links Yet</h3>
          <p className="graph-empty-state__subtitle">
            Start building your knowledge graph by creating links between your Tasks, Notes, Resources, Trackers, and Categories.
            Click the <strong>+ Link</strong> button to get started.
          </p>
          <button
            className="graph-toolbar__action-btn"
            onClick={() => openLinkCreator()}
            style={{ pointerEvents: "auto", marginTop: 8 }}
          >
            <Unplug size={14} />
            Create First Link
          </button>
        </div>
        <CategoryRightSidebar
          isOpen={isCategorySidebarOpen}
          onClose={() => setIsCategorySidebarOpen(false)}
        />
        <LinkCreatorModal />
      </div>
    );
  }

  return (
    <motion.div
      className="knowledge-graph-container flex w-full h-full relative overflow-hidden"
      style={{ height: "100%", position: "relative" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 relative h-full overflow-hidden">
        {/* Toolbar overlay */}
        <GraphToolbar
          onRefresh={handleRefresh}
          onToggleCategorySidebar={() => setIsCategorySidebarOpen((v) => !v)}
          isCategorySidebarOpen={isCategorySidebarOpen}
        />

        {/* React Flow Canvas */}
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 1.2 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="var(--text-muted)"
            style={{ opacity: 0.08 }}
          />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={minimapNodeColor}
            maskColor="rgba(0, 0, 0, 0.1)"
            pannable
            zoomable
          />
        </ReactFlow>

        {/* Stats overlay */}
        <div className="graph-stats">
          <div className="graph-stats__item">
            <span className="graph-stats__number">{rfNodes.length}</span> Nodes
          </div>
          <div className="graph-stats__item">
            <span className="graph-stats__number">{rfEdges.length}</span> Links
          </div>
        </div>

        {/* Error toast */}
        {error && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              zIndex: 20,
              padding: "8px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 10,
              color: "#ef4444",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              backdropFilter: "blur(12px)",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Dedicated Category Right Sidebar */}
      <CategoryRightSidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => setIsCategorySidebarOpen(false)}
      />

      {/* Link Creator Modal */}
      <LinkCreatorModal />
    </motion.div>
  );



}
