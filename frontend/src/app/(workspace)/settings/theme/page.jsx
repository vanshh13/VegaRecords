"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useThemeStore, PRESETS, MOTION_PRESETS, ICON_SHAPES } from "@/stores/theme.store";
import {
  Palette,
  Sparkles,
  Sun,
  Moon,
  Image as ImageIcon,
  Video,
  Activity,
  RotateCcw,
  Check,
  Zap,
  Boxes,
} from "lucide-react";

export default function ThemeSettingsPage() {
  const {
    themeMode,
    themePreset,
    backgroundType,
    motionPreset,
    iconShape,
    backgroundImage,
    backgroundVideo,
    setThemeMode,
    setThemePreset,
    setBackgroundType,
    setMotionPreset,
    setIconShape,
    setBackgroundImage,
    setBackgroundVideo,
    resetTheme,
  } = useThemeStore();

  const [imageUrl, setImageUrl] = useState(backgroundImage || "");
  const [videoUrl, setVideoUrl] = useState(backgroundVideo || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBackgrounds = () => {
    setBackgroundImage(imageUrl);
    setBackgroundVideo(videoUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2.5 font-mono">
              <Palette className="h-6 w-6 text-[var(--primary)]" />
              Theme & Motion Engine HUD
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              Configure personal operating system aesthetics, color tokens, motion simulations, icon particles, and live wallpaper engine.
            </p>
          </div>

          <button
            onClick={resetTheme}
            className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-rose-500/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Theme Modes (Dark Mode & Optimized Light Mode) */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
            <Sun className="h-4 w-4 text-[var(--primary)]" />
            Theme Mode
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { id: "dark", label: "Dark Mode", icon: Moon },
              { id: "light", label: "Light Mode", icon: Sun },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = themeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setThemeMode(mode.id)}
                  className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 text-xs font-medium font-mono transition-all ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] shadow-lg shadow-[var(--primary)]/15 font-bold"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? "text-[var(--primary)]" : ""}`} />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Presets */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            Color Theme Presets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(PRESETS).map(([key, preset]) => {
              const isSelected = themePreset === key;
              return (
                <div
                  key={key}
                  onClick={() => setThemePreset(key)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 shadow-xl shadow-[var(--primary)]/15 scale-[1.02]"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[var(--text)] font-mono">{preset.name}</span>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Color Palette Preview Strip */}
                  <div className="flex h-6 rounded-lg overflow-hidden border border-[var(--border)]">
                    <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                    <div className="flex-1" style={{ backgroundColor: preset.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: preset.background }} />
                    <div className="flex-1" style={{ backgroundColor: preset.surface }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Particle Icon Shape Selector */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
            <Boxes className="h-4 w-4 text-[var(--primary)]" />
            Particle Icon Shape Selector
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ICON_SHAPES.map((shape) => {
              const isSelected = iconShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => setIconShape(shape.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-xs font-mono transition-all ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] font-bold shadow-md"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <span>{shape.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-[var(--primary)]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Motion Options Selector */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
              <Zap className="h-4 w-4 text-[var(--primary)] animate-pulse" />
              Canvas Motion Simulations (7 Modes)
            </h2>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              60 FPS GPU-Accelerated Canvas Engine
            </span>
          </div>

          {/* Featured Highlight: Fluid Motion Wave & Cosmic Plasma Orbs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            {/* Fluid Motion Wave Card */}
            <div
              onClick={() => {
                setBackgroundType("animated");
                setMotionPreset("gradient");
              }}
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden group ${
                motionPreset === "gradient" && backgroundType === "animated"
                  ? "border-[var(--primary)] bg-gradient-to-r from-[var(--primary)]/25 via-[var(--secondary)]/20 to-transparent shadow-xl shadow-[var(--primary)]/20 scale-[1.01]"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-xs font-extrabold text-[var(--text)] font-mono">
                    Fluid Motion Wave
                  </span>
                </div>
                <span className="rounded-md bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40 px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                  FEATURED
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Dynamic pulsing multi-layered harmonic sine-wave mesh with liquid gradient flows.
              </p>
            </div>

            {/* Cosmic Plasma Orbs Card */}
            <div
              onClick={() => {
                setBackgroundType("animated");
                setMotionPreset("nebula");
              }}
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden group ${
                motionPreset === "nebula" && backgroundType === "animated"
                  ? "border-[var(--secondary)] bg-gradient-to-r from-[var(--secondary)]/25 via-[var(--primary)]/20 to-transparent shadow-xl shadow-[var(--secondary)]/20 scale-[1.01]"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--secondary)]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[var(--secondary)]" />
                  <span className="text-xs font-extrabold text-[var(--text)] font-mono">
                    Cosmic Plasma Orbs
                  </span>
                </div>
                <span className="rounded-md bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]/40 px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                  POPULAR
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Swirling ambient plasma nebula orbs with embedded cosmic stardust particles and mouse gravity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOTION_PRESETS.map((m) => {
              const isSelected = motionPreset === m.id && backgroundType === "animated";
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setBackgroundType("animated");
                    setMotionPreset(m.id);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/20 shadow-xl shadow-[var(--primary)]/20 scale-[1.02]"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--text)] font-mono">{m.name}</span>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full bg-[var(--primary)] animate-ping" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans">{m.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Background System Options */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
            <ImageIcon className="h-4 w-4 text-[var(--primary)]" />
            Background Engine Media Source
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: "none", label: "Clean / Solid", icon: Sun },
              { id: "animated", label: "Motion Canvas", icon: Activity },
              { id: "image", label: "Static Image", icon: ImageIcon },
              { id: "video", label: "Live MP4 Video", icon: Video },
            ].map((bg) => {
              const Icon = bg.icon;
              const isSelected = backgroundType === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundType(bg.id)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-medium font-mono transition-all ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)] shadow-lg"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? "text-[var(--primary)]" : ""}`} />
                  {bg.label}
                </button>
              );
            })}
          </div>

          {/* Background URL Inputs */}
          {backgroundType === "image" && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[var(--text)] font-mono">
                Wallpaper Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                />
                <button
                  onClick={handleSaveBackgrounds}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity font-mono"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {backgroundType === "video" && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[var(--text)] font-mono">
                Live Video Wallpaper URL (.mp4 / .webm)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/..."
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                />
                <button
                  onClick={handleSaveBackgrounds}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity font-mono"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {savedSuccess && (
            <p className="text-xs text-emerald-400 font-medium font-mono">
              Background settings saved successfully!
            </p>
          )}
        </div>

        {/* Live Theme Components Showcase & Sandbox */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--text)] tracking-wide uppercase flex items-center gap-2 font-mono">
                <Boxes className="h-4 w-4 text-[var(--primary)] animate-bounce" />
                Live Theme Components Sandbox
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                Verify real-time styling, contrast, and response of all system design components.
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30">
              {themeMode.toUpperCase()} MODE • {themePreset.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons & Actions Component Group */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                1. Button & Action Controls
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <button className="rounded-xl bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity font-mono">
                  Primary Action
                </button>
                <button className="rounded-xl border border-[var(--border)] bg-[var(--hover-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors font-mono">
                  Secondary
                </button>
                <button className="rounded-xl border border-transparent hover:bg-[var(--hover-bg)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors font-mono">
                  Ghost Button
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 font-mono">
                  <Zap className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Badges & HUD Status Pills */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                2. Badges & HUD Status Chips
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-2.5 py-1 text-[10px] font-bold text-[var(--primary)] font-mono">
                  PRIMARY HUD
                </span>
                <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE SYSTEM
                </span>
                <span className="rounded-lg bg-[var(--secondary)]/15 border border-[var(--secondary)]/30 px-2.5 py-1 text-[10px] font-bold text-[var(--secondary)] font-mono">
                  SECONDARY GLOW
                </span>
                <span className="rounded-lg bg-[var(--hover-bg)] border border-[var(--border)] px-2.5 py-1 text-[10px] font-mono text-[var(--text-muted)]">
                  CODE_TAG: 0x8F
                </span>
              </div>
            </div>

            {/* Form Inputs & Interactive Controls */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                3. Form Input Controls
              </h3>
              <input
                type="text"
                defaultValue="Sample styled input text..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[var(--text-muted)] font-mono">System Sync Toggle</span>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--primary)] p-1 cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
                </div>
              </div>
            </div>

            {/* Metrics & Progress Indicators */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                4. Metrics & Progress Gauges
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">Memory Allocation</span>
                  <span className="font-bold text-[var(--primary)]">84%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--hover-bg)] overflow-hidden border border-[var(--border)]">
                  <div className="h-full w-[84%] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
                </div>
              </div>
            </div>

            {/* Glassmorphic Surface Card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2">
              <h3 className="text-xs font-bold text-[var(--text)] font-mono uppercase tracking-wider">
                5. Glassmorphic Surface Card
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Tokens automatically cascade across cards, background surfaces, text headers, borders, and overlays.
              </p>
            </div>

            {/* Alert Banner Component */}
            <div className="rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 p-4 flex items-start gap-3">
              <Zap className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[var(--text)] font-mono">Theme Synchronization Complete</h4>
                <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  All design variables seamlessly adapt to theme changes without page reloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
