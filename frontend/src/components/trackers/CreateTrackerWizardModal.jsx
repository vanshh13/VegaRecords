"use client";

import { useState, useEffect } from "react";
import { useTrackerStore } from "@/stores/tracker.store";
import { useTrackerTypeStore } from "@/stores/trackerType.store";
import { useCategoryStore } from "@/stores/category.store";
import { mediaSearchService } from "@/services/mediaSearch.service";
import TrackerTypeGallery from "@/components/trackerTypes/TrackerTypeGallery";
import {
  Wand2,
  Sparkles,
  X,
  Search,
  CheckCircle2,
  Tv,
  Film,
  Book,
  GraduationCap,
  ArrowRight,
  Layers,
  Star,
  RefreshCw,
  Plus,
  Edit2,
  Image as ImageIcon,
  Heart,
  Briefcase,
  Database,
  Flame,
  Zap,
  LayoutTemplate,
  Folder,
} from "lucide-react";

export default function CreateTrackerWizardModal({ isOpen, onClose }) {
  const { createTracker } = useTrackerStore();
  const { trackerTypes, fetchTrackerTypes } = useTrackerTypeStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchTrackerTypes();
    fetchCategories();
  }, [fetchTrackerTypes, fetchCategories]);

  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [mediaQuery, setMediaQuery] = useState("");

  // Search Results State
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Custom Editable Fields State
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [targetCount, setTargetCount] = useState(12);
  const [unitLabel, setUnitLabel] = useState("episodes");
  const [isOngoing, setIsOngoing] = useState(false);
  const [initialStatus, setInitialStatus] = useState("IN_PROGRESS");
  const [initialCurrentCount, setInitialCurrentCount] = useState(0);
  const [customCategory, setCustomCategory] = useState("");
  const [customType, setCustomType] = useState("");
  const [rating, setRating] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced media search effect
  useEffect(() => {
    if (!mediaQuery || mediaQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await mediaSearchService.searchMedia(mediaQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [mediaQuery, prompt]);

  // Auto-populate when selecting a media search result
  const handleSelectMediaItem = (item) => {
    setSelectedMedia(item);
    setCustomTitle(item.title);
    if (item.coverImage) setCoverImage(item.coverImage);
    const isItemOngoing = item.totalUnits === 0 || item.status === "RELEASING" || item.status === "Currently Airing";
    setIsOngoing(isItemOngoing);
    if (item.totalUnits) setTargetCount(item.totalUnits);
    if (item.unitName) setUnitLabel(item.unitName.toLowerCase());
    if (item.synopsis) setCustomDescription(item.synopsis.slice(0, 300));
    if (item.rating != null) setRating(item.rating.toString());
  };

  const handleSelectChip = (chipText) => {
    setPrompt(chipText);
    setMediaQuery(chipText);
    setStep(2);
  };



  const handleProceedToStep2 = () => {
    if (!prompt.trim()) setPrompt("Movies");
    setMediaQuery(prompt);
    setStep(2);
  };

  const handleProceedToStep3 = (typeName = "Collection Tracker") => {
    const cat = categories.find((c) => c.name.toLowerCase().includes("media") || c.name.toLowerCase().includes("entertainment")) || categories[0];
    const type = trackerTypes.find((t) => t.name.toLowerCase().includes(typeName.toLowerCase())) || trackerTypes[0];

    if (!customCategory) setCustomCategory(cat?.id || "");
    if (!customType) setCustomType(type?.id || "");
    setStep(3);
  };

  const handleCreateTrackerSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedCatId = customCategory || categories[0]?.id;
      const selectedTypeId = customType || trackerTypes[0]?.id;

      const activeCoverUrl = coverImage || selectedMedia?.coverImage || null;

      // Construct verified structured metadata notes
      const notesParts = [];
      if (customDescription) notesParts.push(`Synopsis: ${customDescription}`);
      if (selectedMedia?.creator) notesParts.push(`Creator/Studio: ${selectedMedia.creator}`);
      if (selectedMedia?.rating) notesParts.push(`Rating: ${selectedMedia.rating}`);
      if (selectedMedia?.releaseYear) notesParts.push(`Year: ${selectedMedia.releaseYear}`);
      if (activeCoverUrl) notesParts.push(`CoverImage: ${activeCoverUrl}`);
      if (targetCount) notesParts.push(`TargetCount: ${targetCount}`);
      if (unitLabel) notesParts.push(`UnitLabel: ${unitLabel}`);
      if (isOngoing) notesParts.push(`Ongoing: true`);

      const formattedNotes = notesParts.length > 0 ? notesParts.join("\n") : "Configured via VegaRecords Media Engine";

      await createTracker({
        title: customTitle || "My Custom Tracker",
        notes: formattedNotes,
        description: formattedNotes,
        coverUrl: activeCoverUrl,
        coverImage: activeCoverUrl,
        status: initialStatus,
        currentCount: Number(initialCurrentCount) || 0,
        targetCount: isOngoing ? 0 : (Number(targetCount) || 10),
        unitLabel: unitLabel || "items",
        rating: rating !== "" ? Number(rating) : (selectedMedia?.rating ? Number(selectedMedia.rating) : null),
        isOngoing: isOngoing,
        categoryId: selectedCatId,
        categoryIds: selectedCatId ? [selectedCatId] : [],
        trackerTypeId: selectedTypeId,
        isFavorite: false,
      });

      onClose();
      setStep(1);
      setPrompt("");
      setMediaQuery("");
      setSelectedMedia(null);
      setCoverImage("");
      setCustomTitle("");
      setCustomDescription("");
      setRating("");
    } catch {
      alert("Failed to create tracker. Please verify input fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn font-mono cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl border border-[var(--primary)]/30 bg-[var(--surface)] p-6 sm:p-8 shadow-2xl shadow-[var(--primary)]/10 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar cursor-default"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-indigo-500 text-white shadow-lg shadow-[var(--primary)]/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-[var(--text)] flex items-center gap-2">
                Create New Tracker
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {step === 1 ? "Step 1/3 — Choose Category or Pre-built Template" : step === 2 ? "Step 2/3 — Search & Auto-Fill Media" : "Step 3/3 — Review & Launch Tracker"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--card)] hover:text-[var(--text)] transition-colors border border-transparent hover:border-[var(--border)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress Stepper Pills */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
              step === 1
                ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm"
                : step > 1
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] text-[10px]">1</span>
            Category & Template
          </button>

          <button
            onClick={() => step >= 2 && setStep(2)}
            disabled={step < 2}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
              step === 2
                ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm"
                : step > 2
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] opacity-60 cursor-not-allowed"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] text-[10px]">2</span>
            Media Search
          </button>

          <button
            onClick={() => step >= 3 && setStep(3)}
            disabled={step < 3}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
              step === 3
                ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] opacity-60 cursor-not-allowed"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] text-[10px]">3</span>
            Customize & Launch
          </button>
        </div>

        {/* STEP 1: Choose Tracker Category & Direct Search */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Direct Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-[var(--primary)]" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProceedToStep2()}
                placeholder="Search Anime, Movies, Books, Games directly..."
                className="w-full rounded-2xl border-2 border-[var(--primary)]/40 bg-[var(--card)] py-3 pl-12 pr-28 text-xs font-bold text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none shadow-md"
              />
              <button
                onClick={handleProceedToStep2}
                className="absolute right-1.5 top-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <TrackerTypeGallery
              onSelectType={(template) => handleSelectChip(template.badge || template.title)}
            />
          </div>
        )}

        {/* STEP 2: Live Autocomplete Media Search */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[var(--text)]">Search & Auto-Populate Media</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Live connection to external media APIs. Click any result to auto-fill fields.
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[var(--primary)] hover:underline"
              >
                ← Back to Selection
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={mediaQuery}
                onChange={(e) => setMediaQuery(e.target.value)}
                placeholder="Type title (e.g. One Piece, Inception, Harry Potter, Elden Ring)..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] pl-10 pr-4 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none font-bold"
              />
            </div>

            {/* Results Autocomplete Box */}
            {isSearching ? (
              <div className="flex items-center justify-center p-8 text-xs font-bold text-[var(--text-muted)] gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" /> Querying AniList, TMDB, Google Books & RAWG...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMediaItem(item)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedMedia?.id === item.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/15 shadow-md"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-16 w-12 rounded-xl object-cover border border-[var(--border)] shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shrink-0">
                        <Tv className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase text-[var(--primary)] truncate">
                          {item.mediaType} • {item.source}
                        </span>
                        {item.rating != null && (
                          <span className="flex items-center gap-0.5 text-[10px] font-black text-amber-400">
                            <Star className="h-3 w-3 fill-amber-400" /> {item.rating}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-[var(--text)] truncate">{item.title}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {item.totalUnits ? `${item.totalUnits} ${item.unitName || "Units"}` : "Ongoing"} • {item.creator || item.releaseYear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : mediaQuery.length >= 2 ? (
              <p className="text-xs text-center text-[var(--text-muted)] py-4 font-bold">
                No external API results found for "{mediaQuery}". You can still proceed manually!
              </p>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleProceedToStep3(selectedMedia?.mediaType || "Collection Tracker")}
                className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Proceed to Customization <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Customize & Launch */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[var(--text)]">Review & Customize Fields</h3>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-[var(--primary)] hover:underline">
                ← Back to Start
              </button>
            </div>

            {/* Live Tracker Card Preview Banner */}
            <div className="flex items-center gap-4 p-3 rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--card)] to-transparent shadow-sm">
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="h-16 w-12 rounded-xl object-cover border border-[var(--border)] shadow-md shrink-0" />
              ) : (
                <div className="h-16 w-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shrink-0 shadow-inner">
                  <Layers className="h-5 w-5 opacity-70" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase text-[var(--primary)] px-2 py-0.5 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                    {initialStatus.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">
                    {isOngoing ? "∞ ONGOING SERIES" : `${initialCurrentCount} of ${targetCount} ${unitLabel}`}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[var(--text)] truncate">
                  {customTitle || "My Custom Tracker"}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Tracker Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Manual Cover Image URL Override</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://image-url.jpg"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Ongoing Series / Unlimited Units
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">Check this if episodes/pages are continuously releasing (e.g. One Piece, Habits)</p>
                </div>
                <input
                  type="checkbox"
                  checked={isOngoing}
                  onChange={(e) => setIsOngoing(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
                />
              </div>

              {!isOngoing && (
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Target Units Count</label>
                  <input
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              )}

              {/* Status & Initial Watched Progress */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Status</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => {
                      const newStat = e.target.value;
                      setInitialStatus(newStat);
                      if (newStat === "COMPLETED" && targetCount > 0 && !isOngoing) {
                        setInitialCurrentCount(targetCount);
                      }
                    }}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="IN_PROGRESS" className="bg-[var(--surface)] text-[var(--text)]">Currently Watching / In Progress</option>
                    <option value="COMPLETED" className="bg-[var(--surface)] text-[var(--text)]">Completed / Archived</option>
                    <option value="PLAN_TO_WATCH" className="bg-[var(--surface)] text-[var(--text)]">Plan to Track</option>
                    <option value="PAUSED" className="bg-[var(--surface)] text-[var(--text)]">On Hold / Paused</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Already Watched / Read</label>
                  <input
                    type="number"
                    min="0"
                    value={initialCurrentCount}
                    onChange={(e) => setInitialCurrentCount(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                {!isOngoing && targetCount > 0 && initialStatus !== "COMPLETED" && (
                  <div className="col-span-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setInitialStatus("COMPLETED");
                        setInitialCurrentCount(targetCount);
                      }}
                      className="text-[10px] font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Click here if you have already completed this series ({targetCount} {unitLabel})
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                  <Folder className="h-3 w-3 text-[var(--primary)]" /> Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
                >
                  <option value="">Uncategorized / General</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[var(--surface)] text-[var(--text)]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Rating (1-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g. 8.2"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Unit Label</label>
                <input
                  type="text"
                  value={unitLabel}
                  onChange={(e) => setUnitLabel(e.target.value)}
                  placeholder="episodes, pages, hours, modules"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">Synopsis & Overview Notes</label>
              <textarea
                rows={3}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none custom-scrollbar"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrackerSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Launching...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Create Tracker
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
