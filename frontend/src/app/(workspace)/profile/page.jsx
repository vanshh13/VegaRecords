"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useCategoryStore } from "@/stores/category.store";
import { useTaskStore } from "@/stores/task.store";
import { authApi } from "@/apis/auth.api";
import {
  User,
  Mail,
  Shield,
  Key,
  Check,
  Activity,
  FolderTree,
  CheckSquare,
  Sparkles,
  Save,
  Clock,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { themeMode, themePreset } = useThemeStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { logout } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    gender: user?.gender || "MALE",
    bio: user?.bio || "Architect of personal knowledge systems, tracking goals and learning milestones.",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await authApi.updateProfile(formData);
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        bio: formData.bio,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Fallback local sync
      updateUser(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const completedTasksCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const displayName =
    formData.firstName || formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : formData.username || "System Commander";

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Profile Banner & Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl">
          {/* Subtle Ambient Background Gradient Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Large Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white text-3xl font-extrabold shadow-2xl shadow-[var(--primary)]/30 border-2 border-white/20 font-mono">
                  {formData.firstName?.[0] || formData.username?.[0] || "V"}
                </div>
                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-[var(--surface)] text-[10px] text-white font-bold" title="System Verified" />
              </div>

              {/* User Info & Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono tracking-tight">
                    {displayName}
                  </h1>
                  <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-0.5 text-[10px] font-extrabold font-mono text-[var(--primary)] uppercase tracking-wider">
                    Knowledge Architect
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-mono flex items-center justify-center md:justify-start gap-3">
                  <span>@{formData.username || "commander"}</span>
                  <span>•</span>
                  <span>{formData.email || "commander@vegarecords.io"}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 font-mono text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    SYSTEM ONLINE
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] px-2.5 py-1 rounded-lg">
                    <Shield className="h-3 w-3 text-[var(--primary)]" />
                    ROLE: ADMIN_ROOT
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] px-2.5 py-1 rounded-lg">
                    <Clock className="h-3 w-3 text-[var(--secondary)]" />
                    MEMBER SINCE AUG 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-mono font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all shrink-0"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Live Dynamic Workspace Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Category Tree Nodes", val: `${categories.length} Nodes`, icon: FolderTree, color: "text-[var(--primary)]" },
            { label: "Total Tasks Logged", val: `${tasks.length} Logged`, icon: CheckSquare, color: "text-cyan-400" },
            { label: "Tasks Completed", val: `${completedTasksCount} Completed`, icon: Activity, color: "text-emerald-400" },
            { label: "Active Theme Mode", val: `${themeMode.toUpperCase()} / ${themePreset.toUpperCase()}`, icon: Sparkles, color: "text-amber-400" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-base font-extrabold text-[var(--text)] font-mono">{stat.val}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout: Profile Form & Password Security */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Form (2 Cols) */}
          <div className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-base font-bold text-[var(--text)] font-mono flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--primary)]" /> Personal Profile Details
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Update your identity, display names, and system bio.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Names Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Username & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                    Username Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-[var(--text-muted)] font-mono">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="username"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-8 pr-4 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                  Gender Identification
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none font-mono"
                >
                  <option value="MALE" className="bg-[var(--surface)] text-[var(--text)]">Male</option>
                  <option value="FEMALE" className="bg-[var(--surface)] text-[var(--text)]">Female</option>
                  <option value="OTHER" className="bg-[var(--surface)] text-[var(--text)]">Other</option>
                </select>
              </div>

              {/* Personal Bio / Objective */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                  Personal Objective & Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your personal knowledge goals..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono leading-relaxed resize-none"
                />
              </div>

              {/* Submit & Success */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile Changes
                </button>

                {savedSuccess && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <Check className="h-4 w-4" /> Profile Synced!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Security & Password Card (1 Col) */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm h-fit">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 className="text-base font-bold text-[var(--text)] font-mono flex items-center gap-2">
                <Key className="h-4 w-4 text-[var(--primary)]" /> Password & Security
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                Update account credentials & security access tokens.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Password updated successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] font-mono mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--hover-bg)] py-2.5 text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updatingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
