"use client";

import { Globe } from "lucide-react";

interface CountrySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Bangladesh",
  "India",
  "Singapore",
  "Japan",
  "South Korea",
  "Other",
];

export function CountrySelector({ value, onChange, required = true }: CountrySelectorProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor="country" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Country {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <select
          id="country"
          name="country"
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
        >
          <option value="">Select country...</option>
          {COUNTRIES.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
