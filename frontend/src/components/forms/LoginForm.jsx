"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await login({ email: data.email, password: data.password });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
          {errorMessage}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text)] mb-1.5 font-mono">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
        </div>
        {errors.email && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-[var(--text)] font-mono">Password</label>
          <Link
            href="/forgot-password"
            className="text-[11px] font-medium text-[var(--primary)] hover:underline font-mono"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-10 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-1">
        <input
          {...register("rememberMe")}
          type="checkbox"
          id="rememberMe"
          className="h-4 w-4 rounded border-[var(--border)] bg-[var(--card)] text-[var(--primary)] focus:ring-0 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-xs text-[var(--text-muted)] select-none cursor-pointer font-mono">
          Remember me on this device
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 font-mono"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-[var(--text-muted)] pt-2 font-mono">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline font-mono">
          Create one now
        </Link>
      </p>
    </form>
  );
}
