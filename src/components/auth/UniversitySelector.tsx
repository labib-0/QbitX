"use client";

import { Building2 } from "lucide-react";

interface UniversitySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const UNIVERSITIES = [
  "MIT (Massachusetts Institute of Technology)",
  "Stanford University",
  "Georgia Tech (Georgia Institute of Technology)",
  "Harvard University",
  "UC Berkeley",
  "Carnegie Mellon University",
  "University of Washington",
  "Oxford University",
  "Cambridge University",
  "National University of Singapore (NUS)",
  "University of Toronto",
  "BUET / Premier Engineering Tech",
  "Other University",
];

export function UniversitySelector({ value, onChange, required = true }: UniversitySelectorProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor="university" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        University / College {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <select
          id="university"
          name="university"
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
        >
          <option value="">Select your university...</option>
          {UNIVERSITIES.map((uni, idx) => (
            <option key={idx} value={uni}>
              {uni}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
