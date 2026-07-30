"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";

interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showStrengthMeter?: boolean;
  label?: string;
}

export function PasswordInput({
  id = "password",
  name = "password",
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
  showStrengthMeter = false,
  label = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Strength checks
  const hasMinLen = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasUpper = /[A-Z]/.test(value);

  const score = [hasMinLen, hasNumber, hasSpecial, hasUpper].filter(Boolean).length;

  const strengthLabel =
    value.length === 0
      ? ""
      : score <= 1
      ? "Weak"
      : score === 2 || score === 3
      ? "Medium"
      : "Strong";

  const strengthColor =
    score <= 1 ? "bg-red-500" : score <= 3 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-10 pr-10 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Live Strength Meter */}
      {showStrengthMeter && value.length > 0 && (
        <div className="space-y-1.5 pt-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Password Strength:</span>
            <span
              className={
                score <= 1
                  ? "text-red-500"
                  : score <= 3
                  ? "text-amber-500"
                  : "text-emerald-500"
              }
            >
              {strengthLabel}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-colors ${
                  step <= score ? strengthColor : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              {hasMinLen ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
              <span>8+ characters</span>
            </div>
            <div className="flex items-center gap-1">
              {hasNumber ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
              <span>At least 1 number</span>
            </div>
            <div className="flex items-center gap-1">
              {hasUpper ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
              <span>1 uppercase letter</span>
            </div>
            <div className="flex items-center gap-1">
              {hasSpecial ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
              <span>1 special char</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
