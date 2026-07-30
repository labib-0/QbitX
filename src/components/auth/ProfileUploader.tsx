"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";

interface ProfileUploaderProps {
  label: string;
  accept?: string;
  description?: string;
  onFileSelect: (file: File | null) => void;
  required?: boolean;
}

export function ProfileUploader({
  label,
  accept = "image/*,.pdf,.doc,.docx",
  description = "PNG, JPG, PDF up to 10MB",
  onFileSelect,
  required = false,
}: ProfileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      onFileSelect(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-semibold text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {!file ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-4 bg-slate-950/60 hover:bg-slate-900 hover:border-sky-500/50 transition-all cursor-pointer group">
          <Upload className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition-colors mb-1" />
          <span className="text-xs font-semibold text-slate-300">Click to upload file</span>
          <span className="text-[10px] text-slate-500 mt-0.5">{description}</span>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2 text-slate-200 truncate">
            <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-[10px] text-slate-500 shrink-0">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
