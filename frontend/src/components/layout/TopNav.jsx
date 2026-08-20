import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore, PRESETS } from "@/stores/theme.store";
import { useSearchStore } from "@/stores/search.store";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import {
  Search,
  X,
  Palette,
  Check,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Menu,
} from "lucide-react";

export default function TopNav({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { themeMode, themePreset, setThemeMode, setThemePreset } = useThemeStore();
  const { openCommandPalette } = useSearchStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  // Global ⌘K or / keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        openCommandPalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette]);

  return (
    <header className="sticky top-0 z-30 flex h-16 md:h-20 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-3 sm:px-6 backdrop-blur-2xl transition-colors duration-300 gap-2 font-mono">
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        title="Toggle Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Global Command Palette Trigger Search Input */}
      <div className="relative w-full max-w-xs sm:max-w-md">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text-muted)] hover:border-[var(--primary)]/50 transition-all shadow-inner font-mono text-left"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--primary)] shrink-0" />
            <span className="truncate">Search tasks, notes, trackers...</span>
          </div>

          <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--hover-bg)] px-2 py-0.5 rounded-md border border-[var(--border)] shrink-0">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Action Menu Items */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Quick Dark/Light Mode Toggle */}
        <button
          onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm"
          title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
        >
          {themeMode === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-[var(--primary)]" />
          )}
        </button>

        {/* Quick Theme Preset Selector */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm"
            title="Switch Theme Preset"
          >
            <Palette className="h-4 w-4 text-[var(--primary)]" />
          </button>

          {themeOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase px-2 mb-2">
                Color Presets
              </div>
              {Object.entries(PRESETS).map(([key, preset]) => {
                const isSelected = themePreset === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setThemePreset(key);
                      setThemeOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-mono transition-colors ${
                      isSelected
                        ? "bg-[var(--primary)]/15 text-[var(--text)] font-bold"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span>{preset.name}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[var(--primary)]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 pr-3 hover:border-[var(--primary)]/40 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-xs font-extrabold text-white shadow-md">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "V"}
            </div>
            <span className="text-xs font-semibold text-[var(--text)] font-mono hidden sm:inline">
              {user?.firstName || user?.username || "Commander"}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
              <div className="p-2 border-b border-[var(--border)]">
                <p className="text-xs font-bold text-[var(--text)] font-mono">{user?.firstName} {user?.lastName || user?.username}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">{user?.email}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 rounded-xl p-2 text-xs text-[var(--text)] hover:bg-[var(--hover-bg)] font-mono"
              >
                <User className="h-3.5 w-3.5 text-[var(--primary)]" /> My User Profile
              </Link>

              <Link
                href="/settings/theme"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 rounded-xl p-2 text-xs text-[var(--text)] hover:bg-[var(--hover-bg)] font-mono"
              >
                <Settings className="h-3.5 w-3.5 text-[var(--secondary)]" /> Theme Engine Settings
              </Link>

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl p-2 text-xs text-rose-400 hover:bg-rose-500/10 font-mono"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
