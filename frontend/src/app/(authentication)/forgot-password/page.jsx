"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout subtitle="Reset your account password">
      {submitted ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-[var(--text)] font-mono">Reset Link Sent!</p>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            If an account exists for <span className="text-[var(--text)] font-medium font-mono">{email}</span>, you will receive password reset instructions shortly.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline pt-2 font-mono"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5 font-mono">
              Account Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-95 active:scale-[0.99] transition-all font-mono"
          >
            Send Reset Instructions
          </button>

          <p className="text-center text-xs text-[var(--text-muted)] pt-2 font-mono">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline font-mono">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
