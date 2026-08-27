"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Loader2 } from "lucide-react";
import { useKnowledgeGraphStore } from "@/stores/knowledgeGraph.store";
import { taskApi } from "@/apis/task.api";
import { noteApi } from "@/apis/note.api";
import { resourceApi } from "@/apis/resource.api";
import { trackerApi } from "@/apis/tracker.api";
import { categoryApi } from "@/apis/category.api";

const ENTITY_TYPES = ["TASK", "NOTE", "RESOURCE", "TRACKER", "CATEGORY"];
const RELATION_TYPES = [
  { value: "RELATED_TO", label: "Related To" },
  { value: "DEPENDS_ON", label: "Depends On" },
  { value: "REFERENCES", label: "References" },
  { value: "PART_OF", label: "Part Of" },
  { value: "LEARNING_PATH", label: "Learning Path" },
];

async function fetchEntitiesByType(type) {
  if (!type) return [];
  try {
    switch (type) {
      case "TASK": {
        const res = await taskApi.getAll({ size: 100 });
        const list = Array.isArray(res) ? res : res?.content || [];
        return list.map((item) => ({ id: item.id, label: item.title }));
      }
      case "NOTE": {
        const res = await noteApi.getAll({ size: 100 });
        const list = Array.isArray(res) ? res : res?.content || [];
        return list.map((item) => ({ id: item.id, label: item.title }));
      }
      case "RESOURCE": {
        const res = await resourceApi.getAll({ size: 100 });
        const list = Array.isArray(res) ? res : res?.content || [];
        return list.map((item) => ({ id: item.id, label: item.title }));
      }
      case "TRACKER": {
        const res = await trackerApi.getAll({ size: 100 });
        const list = Array.isArray(res) ? res : res?.content || [];
        return list.map((item) => ({ id: item.id, label: item.title }));
      }
      case "CATEGORY": {
        const res = await categoryApi.getAll();
        const list = Array.isArray(res) ? res : res?.content || [];
        return list.map((item) => ({ id: item.id, label: item.name }));
      }
      default:
        return [];
    }
  } catch (err) {
    console.error(`Failed to fetch ${type} entities:`, err);
    return [];
  }
}

export default function LinkCreatorModal() {
  const { linkCreatorOpen, linkCreatorSource, closeLinkCreator, createLink } =
    useKnowledgeGraphStore();

  const [sourceType, setSourceType] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetId, setTargetId] = useState("");
  const [relationType, setRelationType] = useState("RELATED_TO");

  const [sourceOptions, setSourceOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const effectiveSourceType = linkCreatorSource?.data?.entityType || sourceType;
  const effectiveSourceId = linkCreatorSource?.id || sourceId;

  // Fetch source entities when sourceType changes
  useEffect(() => {
    if (linkCreatorSource) return; // pre-filled
    if (!sourceType) {
      setSourceOptions([]);
      return;
    }
    setLoadingSources(true);
    fetchEntitiesByType(sourceType).then((opts) => {
      setSourceOptions(opts);
      setLoadingSources(false);
    });
  }, [sourceType, linkCreatorSource]);

  // Fetch target entities when targetType changes
  useEffect(() => {
    if (!targetType) {
      setTargetOptions([]);
      return;
    }
    setLoadingTargets(true);
    fetchEntitiesByType(targetType).then((opts) => {
      setTargetOptions(opts);
      setLoadingTargets(false);
    });
  }, [targetType]);

  const handleSubmit = async () => {
    setError("");
    if (!effectiveSourceType || !effectiveSourceId || !targetType || !targetId) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await createLink({
        sourceType: effectiveSourceType,
        sourceId: effectiveSourceId,
        targetType,
        targetId,
        relationType,
      });
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create link");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSourceType("");
    setSourceId("");
    setTargetType("");
    setTargetId("");
    setRelationType("RELATED_TO");
    setSourceOptions([]);
    setTargetOptions([]);
    setError("");
    closeLinkCreator();
  };

  return (
    <AnimatePresence>
      {linkCreatorOpen && (
        <motion.div
          className="link-creator-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="link-creator-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <Link2 size={18} style={{ color: "var(--primary)" }} />
                Create Knowledge Link
              </h3>
              <button
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "8px 12px",
                  marginBottom: 16,
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 8,
                  color: "#ef4444",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {error}
              </div>
            )}

            {/* Source */}
            <label>Source Entity Type</label>
            {linkCreatorSource ? (
              <input
                type="text"
                value={`${effectiveSourceType}: ${linkCreatorSource.data?.label || effectiveSourceId}`}
                disabled
                style={{ opacity: 0.7 }}
              />
            ) : (
              <>
                <select value={sourceType} onChange={(e) => { setSourceType(e.target.value); setSourceId(""); }}>
                  <option value="">Select type...</option>
                  {ENTITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {sourceType && (
                  <>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Source Entity
                      {loadingSources && <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />}
                    </label>
                    <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} disabled={loadingSources}>
                      <option value="">
                        {loadingSources ? "Loading entities..." : sourceOptions.length === 0 ? "No entities found" : "Select entity..."}
                      </option>
                      {sourceOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* Target */}
            <label>Target Entity Type</label>
            <select value={targetType} onChange={(e) => { setTargetType(e.target.value); setTargetId(""); }}>
              <option value="">Select type...</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {targetType && (
              <>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Target Entity
                  {loadingTargets && <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />}
                </label>
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)} disabled={loadingTargets}>
                  <option value="">
                    {loadingTargets ? "Loading entities..." : targetOptions.length === 0 ? "No entities found" : "Select entity..."}
                  </option>
                  {targetOptions
                    .filter((opt) => opt.id !== effectiveSourceId)
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                </select>
              </>
            )}

            {/* Relation */}
            <label>Relation Type</label>
            <select value={relationType} onChange={(e) => setRelationType(e.target.value)}>
              {RELATION_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Actions */}
            <div className="link-creator-modal__actions">
              <button className="link-creator-modal__btn link-creator-modal__btn--cancel" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="link-creator-modal__btn link-creator-modal__btn--create"
                onClick={handleSubmit}
                disabled={submitting || !effectiveSourceId || !targetId}
              >
                {submitting ? "Creating..." : "Create Link"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

