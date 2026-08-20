"use client";

import { useState, useMemo, useEffect } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useCategoryStore } from "@/stores/category.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import {
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  X,
  Layers,
  Activity,
  Film,
  Heart,
  Database,
  Briefcase,
  Book,
  Globe,
  Coffee,
  Zap,
  CheckSquare,
  Award,
  Grid,
  List,
  Calendar,
  BarChart3,
  Flame,
  LayoutTemplate,
} from "lucide-react";

// Preset Prompt Templates mapping
const PRESET_TEMPLATES = [
  {
    keyword: "movies",
    title: "Movies & Cinema Collection",
    categoryName: "Entertainment",
    typeName: "Collection Tracker",
    icon: Film,
    color: "#ec4899",
    description: "Catalog watched movies, ratings, cinema dates, and watchlist.",
    fields: [
      { fieldName: "Title", fieldType: "TEXT", isRequired: true },
      { fieldName: "Status", fieldType: "SELECT", isRequired: true, options: "Plan to Watch, Watching, Completed" },
      { fieldName: "Rating (1-5)", fieldType: "NUMBER", isRequired: false },
      { fieldName: "Watch Date", fieldType: "DATE", isRequired: false },
      { fieldName: "Review / Notes", fieldType: "TEXT", isRequired: false },
    ],
    views: ["Grid", "List", "Timeline"],
    metrics: ["Total Movies Watched", "Average Rating", "Monthly Watch Rate"],
    progressLogic: "Count of items marked 'Completed'",
  },
  {
    keyword: "weight loss",
    title: "Weight & Body Composition",
    categoryName: "Health & Fitness",
    typeName: "Progress Tracker",
    icon: Heart,
    color: "#ef4444",
    description: "Track body weight trends, body fat %, and fitness targets over time.",
    fields: [
      { fieldName: "Entry Date", fieldType: "DATE", isRequired: true },
      { fieldName: "Weight (kg)", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Body Fat %", fieldType: "NUMBER", isRequired: false },
      { fieldName: "Calories Target", fieldType: "NUMBER", isRequired: false },
      { fieldName: "Workout Notes", fieldType: "TEXT", isRequired: false },
    ],
    views: ["Progress Chart", "Table", "Analytics"],
    metrics: ["Current Weight vs Goal", "Net Weight Change (kg)", "Streak Days"],
    progressLogic: "Numeric Delta towards Target Weight Goal",
  },
  {
    keyword: "job applications",
    title: "Career Job Search Pipeline",
    categoryName: "Career",
    typeName: "Project Tracker",
    icon: Briefcase,
    color: "#3b82f6",
    description: "Manage job interviews, company contacts, salaries, and follow-up deadlines.",
    fields: [
      { fieldName: "Company Name", fieldType: "TEXT", isRequired: true },
      { fieldName: "Role Title", fieldType: "TEXT", isRequired: true },
      { fieldName: "Status", fieldType: "SELECT", isRequired: true, options: "Applied, Screening, Interviewing, Offer, Rejected" },
      { fieldName: "Target Salary", fieldType: "NUMBER", isRequired: false },
      { fieldName: "Applied Date", fieldType: "DATE", isRequired: true },
      { fieldName: "Follow-up Date", fieldType: "DATE", isRequired: false },
    ],
    views: ["Kanban Board", "Table", "Timeline"],
    metrics: ["Total Applied", "Interview Rate %", "Pending Responses"],
    progressLogic: "Kanban Stage Progression",
  },
  {
    keyword: "books",
    title: "Reading & Book Library",
    categoryName: "Learning",
    typeName: "Collection Tracker",
    icon: Book,
    color: "#8b5cf6",
    description: "Track books read, page progress, author notes, and annual reading goals.",
    fields: [
      { fieldName: "Book Title", fieldType: "TEXT", isRequired: true },
      { fieldName: "Author", fieldType: "TEXT", isRequired: true },
      { fieldName: "Pages Read", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Total Pages", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Status", fieldType: "SELECT", isRequired: true, options: "Want to Read, Reading, Finished" },
      { fieldName: "Rating", fieldType: "NUMBER", isRequired: false },
    ],
    views: ["Library Grid", "Reading Progress", "Table"],
    metrics: ["Books Finished This Year", "Total Pages Read", "Completion %"],
    progressLogic: "(Pages Read / Total Pages) * 100",
  },
  {
    keyword: "expenses",
    title: "Daily Expenses & Budget Log",
    categoryName: "Finance",
    typeName: "Expense Tracker",
    icon: Database,
    color: "#10b981",
    description: "Log daily spending, categorize transactions, and monitor monthly budgets.",
    fields: [
      { fieldName: "Expense Name", fieldType: "TEXT", isRequired: true },
      { fieldName: "Amount ($)", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Category", fieldType: "SELECT", isRequired: true, options: "Food, Rent, Transport, Utilities, Entertainment, Health" },
      { fieldName: "Payment Method", fieldType: "SELECT", isRequired: false, options: "Credit Card, Debit Card, Cash, UPI" },
      { fieldName: "Transaction Date", fieldType: "DATE", isRequired: true },
    ],
    views: ["Table", "Monthly Analytics", "Calendar"],
    metrics: ["Total Spent This Month", "Daily Average Spend", "Top Expense Category"],
    progressLogic: "Sum of Amounts vs Budget Limit",
  },
  {
    keyword: "habits",
    title: "Daily Routine & Habit Streaks",
    categoryName: "Health & Fitness",
    typeName: "Habit Tracker",
    icon: Flame,
    color: "#f59e0b",
    description: "Build positive routines, track streak counters, and stay consistent.",
    fields: [
      { fieldName: "Habit Name", fieldType: "TEXT", isRequired: true },
      { fieldName: "Frequency", fieldType: "SELECT", isRequired: true, options: "Daily, Weekly, Weekdays" },
      { fieldName: "Target Days", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Current Streak", fieldType: "NUMBER", isRequired: false },
      { fieldName: "Reminder Time", fieldType: "TEXT", isRequired: false },
    ],
    views: ["Calendar Heatmap", "Streak Counter", "Statistics"],
    metrics: ["Current Streak Days", "Completion Rate %", "Best Streak"],
    progressLogic: "Consecutive Days Completed",
  },
  {
    keyword: "subscriptions",
    title: "Recurring Subscriptions Tracker",
    categoryName: "Finance",
    typeName: "Subscription Tracker",
    icon: Zap,
    color: "#06b6d4",
    description: "Keep track of active software, streaming, and membership recurring bills.",
    fields: [
      { fieldName: "Service Name", fieldType: "TEXT", isRequired: true },
      { fieldName: "Monthly Cost ($)", fieldType: "NUMBER", isRequired: true },
      { fieldName: "Billing Cycle", fieldType: "SELECT", isRequired: true, options: "Monthly, Yearly, Quarterly" },
      { fieldName: "Renewal Date", fieldType: "DATE", isRequired: true },
      { fieldName: "Auto Renew?", fieldType: "SELECT", isRequired: false, options: "Yes, No" },
    ],
    views: ["Calendar", "Monthly Summary", "Table"],
    metrics: ["Total Monthly Subscription Cost", "Active Services Count", "Next Upcoming Renewal"],
    progressLogic: "Sum of Monthly Active Subscriptions",
  },
];

const SUGGESTION_CHIPS = [
  "Movies",
  "Weight Loss",
  "Job Applications",
  "Books",
  "Expenses",
  "Habits",
  "Subscriptions",
  "Gym Progress",
  "Anime Watchlist",
  "Investments",
];

export default function CreateTrackerWizardModal({ isOpen, onClose }) {
  const { createTracker } = useTrackerStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { trackerTypes, fetchTrackerTypes } = useTrackerTypeStore();

  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Editable Template Customizer State for Step 3
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customType, setCustomType] = useState("");
  const [targetCount, setTargetCount] = useState(10);
  const [unitLabel, setUnitLabel] = useState("items");
  const [customFields, setCustomFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTrackerTypes();
  }, [fetchCategories, fetchTrackerTypes]);

  // Smart Prompt Matching Engine
  const matchedPreset = useMemo(() => {
    if (!prompt.trim()) return PRESET_TEMPLATES[0];
    const query = prompt.toLowerCase().trim();
    const found = PRESET_TEMPLATES.find(
      (t) =>
        t.keyword.includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.categoryName.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
    if (found) return found;

    // Generic Fallback Matcher
    return {
      keyword: query,
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Tracker`,
      categoryName: "Productivity",
      typeName: "Custom Tracker",
      icon: Activity,
      color: "#6366f1",
      description: `Custom tracking system configured for "${prompt}".`,
      fields: [
        { fieldName: "Item Title / Entry", fieldType: "TEXT", isRequired: true },
        { fieldName: "Log Date", fieldType: "DATE", isRequired: true },
        { fieldName: "Notes & Tags", fieldType: "TEXT", isRequired: false },
      ],
      views: ["Grid", "List", "Table"],
      metrics: ["Total Entries Logged", "Monthly Activity"],
      progressLogic: "Total Entry Count",
    };
  }, [prompt]);

  const handleSelectChip = (chipText) => {
    setPrompt(chipText);
    setStep(2);
  };

  const handleProceedToStep2 = () => {
    if (!prompt.trim()) setPrompt("Movies");
    setStep(2);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCustomTitle(preset.title);
    setCustomDescription(preset.description);

    // Match backend IDs for category & trackerType
    const cat = categories.find((c) => c.name.toLowerCase() === preset.categoryName.toLowerCase()) || categories[0];
    const type = trackerTypes.find((t) => t.name.toLowerCase() === preset.typeName.toLowerCase()) || trackerTypes[0];

    setCustomCategory(cat?.id || "");
    setCustomType(type?.id || "");
    setCustomFields(preset.fields ? [...preset.fields] : []);
    setStep(3);
  };

  const handleAddField = () => {
    setCustomFields([
      ...customFields,
      { fieldName: `Field ${customFields.length + 1}`, fieldType: "TEXT", isRequired: false },
    ]);
  };

  const handleRemoveField = (index) => {
    setCustomFields(customFields.filter((_, idx) => idx !== index));
  };

  const handleFieldChange = (index, key, val) => {
    const updated = [...customFields];
    updated[index][key] = val;
    setCustomFields(updated);
  };

  const handleCreateTrackerSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedCatId = customCategory || categories[0]?.id;
      const selectedTypeId = customType || trackerTypes[0]?.id;

      await createTracker({
        title: customTitle || "My Custom Tracker",
        description: customDescription || "Configured via Smart Template Engine",
        status: "IN_PROGRESS",
        currentCount: 0,
        targetCount: Number(targetCount) || 10,
        unitLabel: unitLabel || "items",
        categoryId: selectedCatId,
        trackerTypeId: selectedTypeId,
        isFavorite: false,
      });

      onClose();
      // Reset wizard
      setStep(1);
      setPrompt("");
    } catch {
      alert("Failed to create tracker. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--text)]">Smart Tracker Setup Engine</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Step {step} of 3 — {step === 1 ? "Goal Intent" : step === 2 ? "Template Match" : "Customize & Launch"}
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

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full ${step >= 1 ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
          <div className={`h-1.5 rounded-full ${step >= 2 ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
          <div className={`h-1.5 rounded-full ${step >= 3 ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
        </div>

        {/* STEP 1: What do you want to track? */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2 py-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight">
                What do you want to track?
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                No need to manually define categories first. Type your goal or pick a suggested topic below.
              </p>
            </div>

            {/* Main Prompt Input Box */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-4 h-5 w-5 text-[var(--primary)]" />
              <input
                type="text"
                autoFocus
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProceedToStep2()}
                placeholder="e.g. Movies, Weight Loss, Expenses, Gym Progress..."
                className="w-full rounded-2xl border-2 border-[var(--primary)]/40 bg-[var(--card)] py-3.5 pl-12 pr-28 text-sm text-[var(--text)] placeholder-[var(--text-muted)] shadow-xl focus:border-[var(--primary)] focus:outline-none"
              />
              <button
                onClick={handleProceedToStep2}
                className="absolute right-2 top-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block text-center">
                Popular Quick Templates
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSelectChip(chip)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:border-[var(--primary)]/60 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-200 shadow-sm"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Auto-suggested Template & Schema Match */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[var(--text)]">Recommended Template Match</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Based on "{prompt || "Movies"}", we automatically configured the optimal schema and views.
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Prompt
              </button>
            </div>

            {/* Featured Suggested Template Card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--primary)]/50 bg-[var(--card)] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner"
                    style={{
                      backgroundColor: `${matchedPreset.color}20`,
                      borderColor: `${matchedPreset.color}40`,
                      color: matchedPreset.color,
                    }}
                  >
                    <matchedPreset.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text)]">{matchedPreset.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] uppercase border border-[var(--primary)]/30">
                        Category: {matchedPreset.categoryName}
                      </span>
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase border border-emerald-500/30">
                        Type: {matchedPreset.typeName}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPreset(matchedPreset)}
                  className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Use Template <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>

              {/* Default Fields Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[var(--primary)]" /> Auto-Configured Schema Fields
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {matchedPreset.fields.map((f, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-[var(--text-muted)] text-[10px]">
                        <span>Field #{i + 1}</span>
                        <span className="text-[var(--primary)] uppercase font-bold">[{f.fieldType}]</span>
                      </div>
                      <span className="font-bold text-[var(--text)] block truncate mt-0.5">{f.fieldName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Views & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                    <Grid className="h-3 w-3 text-cyan-400" /> Supported Views
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {matchedPreset.views.map((v) => (
                      <span key={v} className="rounded bg-[var(--card)] px-2 py-0.5 text-[10px] text-[var(--text)] border border-[var(--border)] font-bold">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                    <BarChart3 className="h-3 w-3 text-amber-400" /> Auto Metrics & Analytics
                  </span>
                  <p className="text-[11px] font-bold text-[var(--text)] truncate">
                    {matchedPreset.metrics.join(" • ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Alternative Templates */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Or Browse Alternative Pre-Built Templates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_TEMPLATES.filter((p) => p.title !== matchedPreset.title)
                  .slice(0, 4)
                  .map((preset) => (
                    <div
                      key={preset.title}
                      onClick={() => handleSelectPreset(preset)}
                      className="group cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl border"
                          style={{
                            backgroundColor: `${preset.color}15`,
                            borderColor: `${preset.color}30`,
                            color: preset.color,
                          }}
                        >
                          <preset.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                            {preset.title}
                          </h5>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {preset.categoryName} • {preset.fields.length} Fields
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Allow Users to Customize & Launch */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[var(--text)]">Customize & Finalize Schema</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Fine-tune custom fields, target metrics, or start instantly.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Templates
              </button>
            </div>

            <div className="space-y-4">
              {/* Tracker Name & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">Tracker Title *</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">Category & Type</label>
                  <div className="flex gap-2">
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                    >
                      {trackerTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Progress Target Goal */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">Goal Target Count</label>
                  <input
                    type="number"
                    min={1}
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    placeholder="e.g. movies, kg, books, $"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Interactive Field Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders className="h-4 w-4 text-[var(--primary)]" /> Custom Field Builder ({customFields.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Field
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {customFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5"
                    >
                      <input
                        type="text"
                        value={field.fieldName}
                        onChange={(e) => handleFieldChange(idx, "fieldName", e.target.value)}
                        placeholder="Field Name"
                        className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                      />
                      <select
                        value={field.fieldType}
                        onChange={(e) => handleFieldChange(idx, "fieldType", e.target.value)}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none font-bold"
                      >
                        <option value="TEXT">TEXT</option>
                        <option value="NUMBER">NUMBER</option>
                        <option value="DATE">DATE</option>
                        <option value="SELECT">SELECT</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCreateTrackerSubmit}
                className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-[var(--primary)]/30 hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" /> Launch Tracker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
