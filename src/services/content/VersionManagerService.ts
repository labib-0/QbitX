/**
 * src/services/content/VersionManagerService.ts
 * Lifecycle manager for content versioning (Draft → Review → Published → Archived)
 */

import { ContentMetadata, PublicationStatus, UserRole } from "@/types/content";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/contentData";

export class VersionManagerService {
  /**
   * Transition publication status of content metadata
   */
  static transitionStatus(
    metadata: ContentMetadata,
    targetStatus: PublicationStatus,
    userId: string,
    userRole: UserRole
  ): { success: boolean; metadata?: ContentMetadata; error?: string } {
    // Only mentors or admins can manage version transitions
    if (userRole === "student") {
      return { success: false, error: "Students are not permitted to manage content publication versions." };
    }

    const currentStatus = metadata.status;

    // Allowed transition state machine rules
    const allowedTransitions: Record<PublicationStatus, PublicationStatus[]> = {
      draft: ["review", "archived"],
      review: ["published", "draft", "archived"],
      published: ["archived", "draft"],
      archived: ["draft"],
    };

    if (!allowedTransitions[currentStatus].includes(targetStatus)) {
      return {
        success: false,
        error: `Cannot transition content from '${currentStatus}' directly to '${targetStatus}'.`,
      };
    }

    const now = new Date().toISOString();
    const updatedMetadata: ContentMetadata = {
      ...metadata,
      status: targetStatus,
      updatedBy: userId,
      updatedAt: now,
      publishedAt: targetStatus === "published" ? (metadata.publishedAt || now) : metadata.publishedAt,
      isArchived: targetStatus === "archived",
    };

    return { success: true, metadata: updatedMetadata };
  }

  /**
   * Increment semantic version string (e.g., "1.0.0" -> "1.1.0" or "2.0.0")
   */
  static incrementVersion(
    currentVersion: string,
    releaseType: "patch" | "minor" | "major"
  ): string {
    const parts = currentVersion.split(".").map((p) => parseInt(p, 10) || 0);
    let [major = 1, minor = 0, patch = 0] = parts;

    if (releaseType === "major") {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (releaseType === "minor") {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    return `${major}.${minor}.${patch}`;
  }
}
