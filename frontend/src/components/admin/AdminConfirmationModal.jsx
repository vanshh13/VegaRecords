"use client";

import { AlertTriangle, ShieldAlert, CheckCircle2, X } from "lucide-react";

export default function AdminConfirmationModal({
  isOpen,
  title,
  message,
  warningMessage,
  confirmText = "Confirm Action",
  confirmVariant = "danger", // "danger" | "primary" | "warning"
  isLoading = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30",
    warning: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30",
    primary: "bg-[var(--primary)] hover:opacity-90 text-white shadow-[var(--primary)]/30",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5 font-mono">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header & Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">{title}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Confirmation Required</p>
          </div>
        </div>

        {/* Body Message */}
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{message}</p>

        {/* Warning Highlight Box */}
        {warningMessage && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{warningMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-5 py-2 text-xs font-bold shadow-lg transition-all ${variantStyles[confirmVariant]} disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading && <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
