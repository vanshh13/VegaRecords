"use client";

import { useEffect, useState } from "react";
import { useThemeStore, PRESETS } from "@/stores/theme.store";
import AnimatedBackground from "./AnimatedBackground";

export default function ThemeProvider({ children }) {
  const { themeMode, themePreset } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isLight = themeMode === "light";
    const preset = PRESETS[themePreset] || PRESETS.default;
    const colors = preset[themeMode] || (isLight ? PRESETS.default.light : PRESETS.default.dark);

    if (isLight) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--surface", colors.surface);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-hover", colors.cardHover || colors.card);
    root.style.setProperty("--text", colors.text);
    root.style.setProperty("--text-muted", colors.textMuted);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--hover-bg", colors.hoverBg);
  }, [themeMode, themePreset]);

  return (
    <>
      {mounted && <AnimatedBackground />}
      {children}
    </>
  );
}

