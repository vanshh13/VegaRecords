/**
 * Utility functions for clean date formatting across VegaRecords tasks and modules.
 */

export function formatDueDate(dateStr) {
  if (!dateStr) return "";
  try {
    // Extract date part if ISO string e.g. "2026-08-26T00:00:00" or "2026-08-26"
    const rawDatePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const parts = rawDatePart.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const targetDate = new Date(year, month, day);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays === -1) return "Yesterday";

      return targetDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: year !== now.getFullYear() ? "numeric" : undefined,
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function formatFullDateTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
