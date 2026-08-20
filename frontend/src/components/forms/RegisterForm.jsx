"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserCheck } from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    gender: z.string().min(1, "Please select gender"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      gender: "MALE",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        gender: data.gender,
        password: data.password,
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
          {errorMessage}
        </div>
      )}

      {/* Name Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">First Name</label>
          <input
            {...register("firstName")}
            type="text"
            placeholder="John"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          {errors.firstName && (
            <p className="mt-1 text-[10px] text-rose-400 font-mono">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Last Name</label>
          <input
            {...register("lastName")}
            type="text"
            placeholder="Doe"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
        </div>
      </div>

      {/* Email & Username Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          {errors.email && (
            <p className="mt-1 text-[10px] text-rose-400 font-mono">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Username</label>
          <input
            {...register("username")}
            type="text"
            placeholder="johndoe"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          {errors.username && (
            <p className="mt-1 text-[10px] text-rose-400 font-mono">{errors.username.message}</p>
          )}
        </div>
      </div>

      {/* Gender Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Gender</label>
        <select
          {...register("gender")}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
        >
          <option value="MALE" className="bg-[var(--surface)] text-[var(--text)]">Male</option>
          <option value="FEMALE" className="bg-[var(--surface)] text-[var(--text)]">Female</option>
          <option value="OTHER" className="bg-[var(--surface)] text-[var(--text)]">Other</option>
        </select>
      </div>

      {/* Passwords Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Password</label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          {errors.password && (
            <p className="mt-1 text-[10px] text-rose-400 font-mono">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1 font-mono">Confirm</label>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 px-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-[10px] text-rose-400 font-mono">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 mt-3 font-mono"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-xs text-[var(--text-muted)] pt-1 font-mono">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline font-mono">
          Sign In
        </Link>
      </p>
    </form>
  );
}
