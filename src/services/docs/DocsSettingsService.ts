import { DocsSettings, DocsAccessStatus, TeamMember } from "@/types/docs";

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Labib Ul Hasan",
    role: "Founder & Lead System Architect",
    email: "lu.hasann@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    affiliation: "Notre Dame University Bangladesh (NDUB CSE)",
    bio: "Full-stack distributed systems engineer and product designer. Architected QbitX end-to-end with Next.js 16, Drizzle ORM, and automated AI evaluation pipelines.",
    githubUrl: "https://github.com/labib-0",
    linkedinUrl: "https://linkedin.com",
    badge: "Core Architect",
  },
  {
    id: "team-2",
    name: "Dr. Kamal Hossain",
    role: "Co-Founder & Head of Curriculum",
    email: "mentor@qbitx.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    affiliation: "Senior CS Faculty & Competitive Programming Coach",
    bio: "Oversees pedagogical rubrics, curriculum pacing, and PASS tutoring frameworks. Over 12 years of software engineering education leadership.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    badge: "Academic Director",
  },
  {
    id: "team-3",
    name: "Nusrat Jahan",
    role: "Lead Frontend & UI/UX Engineer",
    email: "nusrat.jahan@qbitx.com",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    affiliation: "Design Systems & Human-Computer Interaction Lead",
    bio: "Specializes in high-performance distraction-free workspace interfaces, interactive coding playgrounds, and accessible pedagogical design systems.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    badge: "Design Lead",
  },
  {
    id: "team-4",
    name: "Tanvir Ahmed",
    role: "AI & Distributed Systems Specialist",
    email: "tanvir.ahmed@qbitx.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    affiliation: "Machine Learning & Distributed Systems Specialist",
    bio: "Engineers multi-candidate Gemini LLM routing, deterministic fallback engines, AST code-review tokenizers, and learning analytics pipelines.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    badge: "AI Systems",
  },
];

export const DEFAULT_DOCS_SETTINGS: DocsSettings = {
  isPublic: true,
  schedule: {
    enabled: true,
    startDate: "2026-06-10T00:00:00.000Z", // Mandatory default: June 10, 00:00
    endDate: "2026-06-14T23:59:59.000Z",   // Mandatory default: June 14, 23:59
    overrideMode: "force_public",           // Default to open for testing & preview, easily switchable to auto / force_private
    judgingNotice: "Official Judging & Evaluation Window: June 10 (00:00 UTC) to June 14 (23:59 UTC), 2026. Review our full pitch deck, technical whitepaper, and live system metrics.",
  },
  teamName: "Team QbitX / Quantum Byte Innovation",
  teamTagline: "Building the next-generation operating system for software engineering education.",
  customNoticeMessage: "The QbitX Showcase and Pitch Deck portal is scheduled for the official judging window from June 10 (00:00 UTC) to June 14 (23:59 UTC), 2026. Authorized judges and administrators may sign in below.",
  teamMembers: DEFAULT_TEAM_MEMBERS,
  lastUpdated: new Date().toISOString(),
};

export class DocsSettingsService {
  private static getGlobalStore(): DocsSettings {
    const g = globalThis as any;
    if (!g.__qbitx_docs_settings) {
      g.__qbitx_docs_settings = JSON.parse(JSON.stringify(DEFAULT_DOCS_SETTINGS));
    }
    return g.__qbitx_docs_settings;
  }

  static getSettings(): DocsSettings {
    return this.getGlobalStore();
  }

  static updateSettings(partial: Partial<DocsSettings>): DocsSettings {
    const current = this.getGlobalStore();

    if (partial.isPublic !== undefined) current.isPublic = partial.isPublic;
    if (partial.teamName !== undefined) current.teamName = partial.teamName;
    if (partial.teamTagline !== undefined) current.teamTagline = partial.teamTagline;
    if (partial.customNoticeMessage !== undefined) current.customNoticeMessage = partial.customNoticeMessage;
    if (partial.teamMembers !== undefined) current.teamMembers = partial.teamMembers;

    if (partial.schedule) {
      current.schedule = {
        ...current.schedule,
        ...partial.schedule,
      };
    }

    current.lastUpdated = new Date().toISOString();
    return current;
  }

  static evaluateAccess(userRole?: string | null, customNow?: Date | number): DocsAccessStatus {
    const settings = this.getSettings();
    const { schedule } = settings;
    const isAdmin = userRole === "admin" || userRole === "super_admin";
    const nowMs = customNow instanceof Date ? customNow.getTime() : typeof customNow === "number" ? customNow : Date.now();

    // Admin has permanent preview and override access
    if (isAdmin) {
      return {
        accessible: true,
        isAccessible: true,
        isAdmin: true,
        reason: "Administrator preview override active. Full access granted.",
        overrideMode: schedule.overrideMode,
        schedule,
        judgingNotice: schedule.judgingNotice,
        customNotice: settings.customNoticeMessage,
        startsAt: schedule.startDate,
        endsAt: schedule.endDate,
      };
    }

    // 1. Forced Public Override
    if (schedule.overrideMode === "force_public") {
      return {
        accessible: true,
        isAccessible: true,
        isAdmin: false,
        reason: "Forced public showcase override is active.",
        overrideMode: schedule.overrideMode,
        schedule,
        judgingNotice: schedule.judgingNotice,
        customNotice: settings.customNoticeMessage,
        startsAt: schedule.startDate,
        endsAt: schedule.endDate,
      };
    }

    // 2. Forced Private Override
    if (schedule.overrideMode === "force_private") {
      return {
        accessible: false,
        isAccessible: false,
        isAdmin: false,
        reason: "Access is currently restricted by platform administrators for private review.",
        overrideMode: schedule.overrideMode,
        schedule,
        judgingNotice: schedule.judgingNotice,
        customNotice: settings.customNoticeMessage,
        startsAt: schedule.startDate,
        endsAt: schedule.endDate,
      };
    }

    // 3. Automated Schedule Evaluation
    if (schedule.enabled) {
      const startMs = schedule.startDate ? new Date(schedule.startDate).getTime() : 0;
      const endMs = schedule.endDate ? new Date(schedule.endDate).getTime() : 0;

      const isWithinWindow = nowMs >= startMs && nowMs <= endMs;
      const isBefore = nowMs < startMs;

      let reason = "Access granted within scheduled showcase window.";
      if (isBefore) {
        reason = `Access is scheduled to open on June 10, 2026 (00:00 UTC). Current window is restricted.`;
      } else if (!isWithinWindow) {
        reason = `The scheduled showcase window has concluded as of June 14, 2026 (23:59 UTC).`;
      }

      return {
        accessible: isWithinWindow,
        isAccessible: isWithinWindow,
        isAdmin: false,
        reason,
        overrideMode: schedule.overrideMode,
        schedule,
        judgingNotice: schedule.judgingNotice,
        customNotice: settings.customNoticeMessage,
        startsAt: schedule.startDate,
        endsAt: schedule.endDate,
      };
    }

    // 4. Default boolean toggle
    return {
      accessible: settings.isPublic,
      isAccessible: settings.isPublic,
      isAdmin: false,
      reason: settings.isPublic ? "Default public access enabled." : "Default access is restricted.",
      overrideMode: schedule.overrideMode,
      schedule,
      judgingNotice: schedule.judgingNotice,
      customNotice: settings.customNoticeMessage,
      startsAt: schedule.startDate,
      endsAt: schedule.endDate,
    };
  }

  static resetToDefaults(): DocsSettings {
    const g = globalThis as any;
    g.__qbitx_docs_settings = JSON.parse(JSON.stringify(DEFAULT_DOCS_SETTINGS));
    return g.__qbitx_docs_settings;
  }
}
