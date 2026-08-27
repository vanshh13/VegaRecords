"use client";

import { useState, useEffect } from "react";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import {
  X,
  Plus,
  Layers,
  Type,
  Hash,
  CheckSquare,
  Calendar,
  List,
  Link2,
  FileText,
  Sparkles,
} from "lucide-react";

const SUPPORTED_FIELD_TYPES = [
  { value: "TEXT", label: "Text", icon: Type },
  { value: "NUMBER", label: "Number", icon: Hash },
  { value: "BOOLEAN", label: "Checkbox / Boolean", icon: CheckSquare },
  { value: "DATE", label: "Date", icon: Calendar },
  { value: "SELECT", label: "Single Select", icon: List },
  { value: "MULTI_SELECT", label: "Multi Select", icon: List },
  { value: "URL", label: "URL Link", icon: Link2 },
  { value: "LONG_TEXT", label: "Long Text / Notes", icon: FileText },
];

export default function FieldBuilderModal() {
  const { fieldBuilderOpen, closeFieldBuilder, activeFieldType, addFieldToType } =
    useTrackerTypeStore();

  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("TEXT");
  const [options, setOptions] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && fieldBuilderOpen) {
        closeFieldBuilder();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fieldBuilderOpen, closeFieldBuilder]);

  if (!fieldBuilderOpen || !activeFieldType) return null;

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    setSubmitting(true);
    try {
      await addFieldToType(activeFieldType.id, {
        fieldName: fieldName.trim(),
        fieldType,
        options: options.trim() ? options.trim() : null,
        isRequired,
      });
      setFieldName("");
      setOptions("");
      setIsRequired(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={closeFieldBuilder}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-6 cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--text)] flex items-center gap-2">
                Airtable & Notion Schema Builder
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Customizing fields for: <span className="font-bold text-[var(--primary)]">{activeFieldType.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeFieldBuilder}
            className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Existing Schema Fields List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[var(--primary)]" /> Current Schema Attributes
          </h4>
          {activeFieldType.fields && activeFieldType.fields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
              {activeFieldType.fields.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs"
                >
                  <span className="font-bold text-[var(--text)]">{f.fieldName}</span>
                  <span className="rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-bold">
                    {f.fieldType}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic bg-[var(--card)] p-3 rounded-xl border border-[var(--border)]">
              No schema fields configured yet. Add your first field below.
            </p>
          )}
        </div>

        {/* Add New Field Form */}
        <form onSubmit={handleAddField} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-[var(--primary)]" /> Add New Dynamic Field
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Field Label Name</label>
              <input
                type="text"
                placeholder="e.g. Current Episode, Watch Status..."
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Field Data Type</label>
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
              >
                {SUPPORTED_FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[var(--surface)] text-[var(--text)]">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(fieldType === "SELECT" || fieldType === "MULTI_SELECT") && (
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                Options (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Plan to Watch, Watching, Completed, Dropped"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-0 cursor-pointer"
              />
              Mandatory field
            </label>

            <button
              type="submit"
              disabled={submitting || !fieldName.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Save Field to Schema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
