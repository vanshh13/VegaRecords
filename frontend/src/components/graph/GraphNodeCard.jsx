"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  CheckSquare,
  FileText,
  Bookmark,
  Activity,
  FolderTree,
} from "lucide-react";

const ENTITY_CONFIG = {
  TASK: { icon: CheckSquare, label: "Task", color: "#3b82f6" },
  NOTE: { icon: FileText, label: "Note", color: "#10b981" },
  RESOURCE: { icon: Bookmark, label: "Resource", color: "#f59e0b" },
  TRACKER: { icon: Activity, label: "Tracker", color: "#a855f7" },
  CATEGORY: { icon: FolderTree, label: "Category", color: "#ec4899" },
};

function GraphNodeCard({ data, selected }) {
  const config = ENTITY_CONFIG[data.entityType] || ENTITY_CONFIG.TASK;
  const Icon = config.icon;

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 8, height: 8 }} />

      <div className={`entity-node entity-node--${data.entityType} ${selected ? "selected" : ""}`}>
        <div className="entity-node__header">
          <div className="entity-node__icon">
            <Icon size={16} />
          </div>
          <span className="entity-node__label">{data.label || "Untitled"}</span>
        </div>
        <div className="entity-node__badge">{config.label}</div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 8, height: 8 }} />
    </>
  );
}

export default memo(GraphNodeCard);
