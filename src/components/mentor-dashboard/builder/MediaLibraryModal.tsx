"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLibraryService } from "@/services/content/MediaLibraryService";
import { MediaAsset } from "@/types/builder";
import { FolderCheck, Upload, Search, Tag, FileText, Video, Image as ImageIcon, Download, X } from "lucide-react";

interface MediaLibraryModalProps {
  onSelectAsset?: (asset: MediaAsset) => void;
  onClose: () => void;
}

export function MediaLibraryModal({ onSelectAsset, onClose }: MediaLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [assets, setAssets] = useState<MediaAsset[]>(MediaLibraryService.getAssets());

  const handleUploadSim = () => {
    const newAsset = MediaLibraryService.addAsset({
      name: `Uploaded_Asset_${Date.now()}.png`,
      type: "image",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      sizeBytes: 1048576,
      mimeType: "image/png",
      tags: ["uploaded"],
      category: "Uploads",
      createdBy: "usr-mentor-1",
    });
    setAssets([...MediaLibraryService.getAssets()]);
  };

  const filtered = assets.filter((a) => {
    const matchesCat = activeCategory === "all" || a.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesQ = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-extrabold text-lg text-foreground font-heading">Centralized Media Library Manager</h3>
            <p className="text-xs text-muted-foreground">Manage Images, Videos, PDFs, ZIP starter kits, Datasets, and Presentations.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets or tags..."
              className="w-full rounded-xl bg-muted/40 border border-border pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleUploadSim}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 justify-center"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Asset</span>
          </button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => {
                if (onSelectAsset) onSelectAsset(asset);
              }}
              className="p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/80 hover:border-purple-500/40 text-left transition-all cursor-pointer space-y-2 group"
            >
              <div className="h-24 w-full rounded-xl overflow-hidden bg-muted relative flex items-center justify-center">
                {asset.type === "image" ? (
                  <Image src={asset.url} alt={asset.name} fill className="object-cover" />
                ) : (
                  <FileText className="h-8 w-8 text-purple-500" />
                )}
              </div>
              <p className="text-xs font-bold text-foreground truncate">{asset.name}</p>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{(asset.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                <span className="text-purple-500 font-bold">{asset.usedInCount} uses</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
