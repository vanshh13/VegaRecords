"use client";

import { motion } from "framer-motion";
import {
  Film,
  Tv,
  BookOpen,
  GraduationCap,
  Gamepad2,
  Dumbbell,
  Flame,
  Zap,
  Briefcase,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";

const TRACKER_GALLERY_TEMPLATES = [
  {
    id: "anime",
    title: "Anime Tracker",
    icon: Tv,
    badge: "ANIME",
    color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400",
    description: "Track episodes, MAL/AniList scores, studio releases & rewatch counts.",
    usageCount: 1420,
    preview: "1132 / 1200 Episodes • AniList Metadata",
  },
  {
    id: "series",
    title: "Series / TV Tracker",
    icon: Tv,
    badge: "SERIES",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    description: "Track seasons, episodes, streaming platforms & ongoing release schedules.",
    usageCount: 2150,
    preview: "Season 4 Ep 8 • TMDB TV Database",
  },
  {
    id: "movie",
    title: "Movie Tracker",
    icon: Film,
    badge: "CINEMA",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
    description: "Letterboxd-style film diary, director tags, runtime, ratings & watchlists.",
    usageCount: 2890,
    preview: "Watched 124m • TMDB Ratings",
  },
  {
    id: "book",
    title: "Book Tracker",
    icon: BookOpen,
    badge: "READING",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    description: "Log reading pages, chapters, author notes, and completion estimates.",
    usageCount: 950,
    preview: "Page 240 of 380 • Google Books",
  },
  {
    id: "course",
    title: "Course Tracker",
    icon: GraduationCap,
    badge: "LEARNING",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    description: "Monitor module completion, study hours, platforms & certificates.",
    usageCount: 680,
    preview: "Module 6 of 12 • Certificate Track",
  },
  {
    id: "game",
    title: "Game Tracker",
    icon: Gamepad2,
    badge: "STEAM",
    color: "from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400",
    description: "Steam-style library, hours played, achievement unlocks & status.",
    usageCount: 1120,
    preview: "48 Hours Played • RAWG Database",
  },
  {
    id: "project",
    title: "Project Tracker",
    icon: Briefcase,
    badge: "WORK",
    color: "from-sky-500/20 to-indigo-500/20 border-sky-500/30 text-sky-400",
    description: "Kanban milestone progression, deliverables & task pipelines.",
    usageCount: 1780,
    preview: "8 of 12 Tasks Completed • Pipeline",
  },
  {
    id: "fitness",
    title: "Fitness Tracker",
    icon: Dumbbell,
    badge: "HEALTH",
    color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400",
    description: "Log workouts, weight goals, daily calorie targets & rep sets.",
    usageCount: 840,
    preview: "4 Workouts This Week • Daily Logs",
  },
  {
    id: "habit",
    title: "Habit Tracker",
    icon: Flame,
    badge: "STREAK",
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400",
    description: "Duolingo-style streak counters, daily routines & milestone rewards.",
    usageCount: 3100,
    preview: "24-Day Streak 🔥 • Daily Check-In",
  },
  {
    id: "custom",
    title: "Custom Tracker",
    icon: Zap,
    badge: "FLEXIBLE",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
    description: "Blank canvas dynamic schema with flexible field definitions.",
    usageCount: 4200,
    preview: "Custom EAV Schema • Custom Fields",
  },
];

export default function TrackerTypeGallery({ onSelectType }) {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[var(--text)] flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)] animate-pulse" /> Specialized Tracker Type Gallery
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Select a specialized visual renderer template to configure your tracking engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACKER_GALLERY_TEMPLATES.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-b ${item.color} bg-[var(--surface)] p-5 shadow-lg backdrop-blur-xl transition-all font-mono hover:shadow-xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-current bg-black/20 backdrop-blur-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-current bg-black/20 px-2.5 py-0.5 text-[9px] font-black uppercase">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text)] group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Preview pill */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-[10px] font-bold text-[var(--text-muted)] truncate">
                  {item.preview}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]/40 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] font-bold">
                  {item.usageCount.toLocaleString()} created
                </span>

                <button
                  onClick={() => onSelectType && onSelectType(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-current bg-black/30 px-3 py-1.5 text-xs font-extrabold hover:bg-black/50 transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Quick Create
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
