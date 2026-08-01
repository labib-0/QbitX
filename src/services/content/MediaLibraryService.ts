/**
 * src/services/content/MediaLibraryService.ts
 * Centralized media manager for Images, Videos, PDFs, ZIP starter kits, Datasets, and Presentations
 */

import { MediaAsset } from "@/types/builder";

export const MOCK_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media-1",
    name: "Python_Fundamentals_Cover.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    sizeBytes: 458000,
    mimeType: "image/jpeg",
    tags: ["python", "cover", "thumbnail"],
    category: "Thumbnails",
    usedInCount: 3,
    createdBy: "usr-mentor-1",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "media-2",
    name: "Binary_Search_Trees_Lecture.mp4",
    type: "video",
    url: "https://www.youtube.com/embed/kqtD5dpn9C8",
    sizeBytes: 154000000,
    mimeType: "video/mp4",
    tags: ["video", "bst", "dsa"],
    category: "Lectures",
    usedInCount: 1,
    createdBy: "usr-mentor-1",
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "media-3",
    name: "RAG_Starter_Kit.zip",
    type: "zip",
    url: "https://assets.qbitx.com/templates/rag-starter.zip",
    sizeBytes: 4194304,
    mimeType: "application/zip",
    tags: ["starter-kit", "zip", "fastapi"],
    category: "Templates",
    usedInCount: 2,
    createdBy: "usr-mentor-2",
    createdAt: "2026-02-01T14:30:00Z",
  },
  {
    id: "media-4",
    name: "Python_Syntax_CheatSheet.pdf",
    type: "pdf",
    url: "https://assets.qbitx.com/resources/python-cheatsheet.pdf",
    sizeBytes: 1048576,
    mimeType: "application/pdf",
    tags: ["pdf", "cheatsheet"],
    category: "Documents",
    usedInCount: 4,
    createdBy: "usr-admin-1",
    createdAt: "2026-01-10T10:00:00Z",
  },
];

let mediaStore: MediaAsset[] = [...MOCK_MEDIA_ASSETS];

export class MediaLibraryService {
  static getAssets(category?: string, query?: string): MediaAsset[] {
    return mediaStore.filter((asset) => {
      const matchesCat = !category || category === "all" || asset.category.toLowerCase() === category.toLowerCase();
      const matchesQ = !query || asset.name.toLowerCase().includes(query.toLowerCase()) || asset.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCat && matchesQ;
    });
  }

  static addAsset(asset: Omit<MediaAsset, "id" | "usedInCount" | "createdAt">): MediaAsset {
    const newAsset: MediaAsset = {
      ...asset,
      id: `media-${Date.now()}`,
      usedInCount: 0,
      createdAt: new Date().toISOString(),
    };
    mediaStore.unshift(newAsset);
    return newAsset;
  }
}
