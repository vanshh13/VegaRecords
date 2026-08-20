"use client";

import { useState } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import {
  LayoutTemplate,
  Search,
  Sparkles,
  Film,
  Heart,
  Database,
  Briefcase,
  Book,
  Globe,
  Coffee,
  Zap,
  Flame,
  X,
  CheckCircle2,
  Layers,
  BarChart3,
  Grid,
} from "lucide-react";

const MARKETPLACE_TEMPLATES = [
  {
    id: "tpl-1",
    title: "Letterboxd Movie Log & Ratings",
    categoryName: "Entertainment",
    typeName: "Collection Tracker",
    icon: Film,
    color: "#ec4899",
    description: "Letterboxd-style movie log with watch statuses, ratings, reviews, and cinema timeline.",
    fields: ["Title", "Status", "Rating (1-5)", "Watch Date", "Notes"],
    views: ["Poster Grid", "Log Table", "Timeline"],
    metrics: ["Movies Finished", "Average Rating", "Monthly Watch Streak"],
    targetCount: 50,
    unitLabel: "movies",
  },
  {
    id: "tpl-2",
    title: "Weight Loss & Fitness Journey",
    categoryName: "Health & Fitness",
    typeName: "Progress Tracker",
    icon: Heart,
    color: "#ef4444",
    description: "Track body weight (kg), body fat percentage, calorie goals, and workout progress.",
    fields: ["Entry Date", "Weight (kg)", "Body Fat %", "Calories Target", "Workout Notes"],
    views: ["Progress Chart", "Table", "Analytics"],
    metrics: ["Goal Progress %", "Net Change", "Streak Days"],
    targetCount: 15,
    unitLabel: "kg loss",
  },
  {
    id: "tpl-3",
    title: "Job Application Pipeline",
    categoryName: "Career",
    typeName: "Project Tracker",
    icon: Briefcase,
    color: "#3b82f6",
    description: "Notion-like kanban tracker for job applications, interviews, salaries, and follow-ups.",
    fields: ["Company Name", "Role Title", "Status", "Target Salary", "Applied Date", "Follow-up Date"],
    views: ["Kanban Board", "Table List", "Deadline Calendar"],
    metrics: ["Total Applied", "Interview Conversion %", "Pending Actions"],
    targetCount: 30,
    unitLabel: "applications",
  },
  {
    id: "tpl-4",
    title: "Reading & Book Library",
    categoryName: "Learning",
    typeName: "Collection Tracker",
    icon: Book,
    color: "#8b5cf6",
    description: "Track books read, page completion, ratings, author notes, and annual reading goals.",
    fields: ["Book Title", "Author", "Pages Read", "Total Pages", "Status", "Rating"],
    views: ["Bookshelf Grid", "Reading Progress", "Table"],
    metrics: ["Books Completed", "Total Pages Read", "Genre Diversity"],
    targetCount: 24,
    unitLabel: "books",
  },
  {
    id: "tpl-5",
    title: "Daily Expenses & Monthly Budget",
    categoryName: "Finance",
    typeName: "Expense Tracker",
    icon: Database,
    color: "#10b981",
    description: "Log daily spending, analyze expense categories, payment methods, and receipt notes.",
    fields: ["Expense Name", "Amount ($)", "Category", "Payment Method", "Transaction Date"],
    views: ["Table List", "Category Pie Chart", "Monthly Calendar"],
    metrics: ["Total Monthly Spend", "Top Category Spend", "Daily Average"],
    targetCount: 1000,
    unitLabel: "dollars",
  },
  {
    id: "tpl-6",
    title: "Habitica Daily Routine Streaks",
    categoryName: "Health & Fitness",
    typeName: "Habit Tracker",
    icon: Flame,
    color: "#f59e0b",
    description: "Habitica-style habit streak builder with completion rewards, heatmaps, and stats.",
    fields: ["Habit Name", "Frequency", "Target Days", "Current Streak", "Reminder Time"],
    views: ["Calendar Heatmap", "Streak Counter", "Statistics"],
    metrics: ["Active Streaks", "Completion %", "Longest Streak"],
    targetCount: 30,
    unitLabel: "days streak",
  },
  {
    id: "tpl-7",
    title: "Recurring Subscriptions Monitor",
    categoryName: "Finance",
    typeName: "Subscription Tracker",
    icon: Zap,
    color: "#06b6d4",
    description: "Track monthly streaming, software, and membership bills with renewal date alerts.",
    fields: ["Service Name", "Monthly Cost ($)", "Billing Cycle", "Renewal Date", "Auto Renew?"],
    views: ["Monthly Spend Table", "Renewal Calendar", "Analytics"],
    metrics: ["Total Monthly Subscriptions", "Active Services Count", "Next Bill Due"],
    targetCount: 12,
    unitLabel: "services",
  },
  {
    id: "tpl-8",
    title: "Anime Watchlist & Episode Counter",
    categoryName: "Entertainment",
    typeName: "Collection Tracker",
    icon: Film,
    color: "#a855f7",
    description: "Keep track of watched episodes, season ratings, release schedules, and notes.",
    fields: ["Anime Title", "Episodes Watched", "Total Episodes", "Rating", "Studio"],
    views: ["Grid", "Progress Ring", "Table"],
    metrics: ["Total Episodes Watched", "Completed Anime", "Average Score"],
    targetCount: 100,
    unitLabel: "episodes",
  },
];

const CATEGORY_FILTERS = ["All", "Entertainment", "Health & Fitness", "Finance", "Career", "Learning"];

export default function TemplateMarketplaceModal({ isOpen, onClose }) {
  const { createTracker } = useTrackerStore();
  const { categories } = useCategoryStore();
  const { trackerTypes } = useTrackerTypeStore();

  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cloningId, setCloningId] = useState(null);

  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCat === "All" || tpl.categoryName === selectedCat;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCloneTemplate = async (tpl) => {
    setCloningId(tpl.id);
    try {
      const cat = categories.find((c) => c.name.toLowerCase() === tpl.categoryName.toLowerCase()) || categories[0];
      const type = trackerTypes.find((t) => t.name.toLowerCase() === tpl.typeName.toLowerCase()) || trackerTypes[0];

      await createTracker({
        title: tpl.title,
        description: tpl.description,
        status: "IN_PROGRESS",
        currentCount: 0,
        targetCount: tpl.targetCount,
        unitLabel: tpl.unitLabel,
        categoryId: cat?.id || categories[0]?.id,
        trackerTypeId: type?.id || trackerTypes[0]?.id,
        isFavorite: false,
      });

      onClose();
    } catch {
      alert("Failed to clone template.");
    } finally {
      setCloningId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-[var(--primary)] text-white shadow-lg">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--text)]">Public Templates Marketplace</h2>
              <p className="text-xs text-[var(--text-muted)]">
                1-Click clone pre-configured tracking systems inspired by Notion, Letterboxd & Habitica.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => {
            const IconComp = tpl.icon;
            const isCloning = cloningId === tpl.id;

            return (
              <div
                key={tpl.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm hover:border-[var(--primary)]/50 hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-inner"
                        style={{
                          backgroundColor: `${tpl.color}15`,
                          borderColor: `${tpl.color}40`,
                          color: tpl.color,
                        }}
                      >
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                          {tpl.title}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {tpl.categoryName} • {tpl.typeName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)]">
                    {tpl.description}
                  </p>

                  {/* Schema Badges */}
                  <div className="flex flex-wrap gap-1">
                    {tpl.fields.map((f, i) => (
                      <span
                        key={i}
                        className="rounded bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-[10px]">
                  <span className="text-[var(--text-muted)]">Target: {tpl.targetCount} {tpl.unitLabel}</span>
                  <button
                    disabled={isCloning}
                    onClick={() => handleCloneTemplate(tpl)}
                    className="rounded-xl bg-[var(--primary)] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isCloning ? (
                      "Cloning..."
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> 1-Click Launch
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
