/**
 * UserService — User profile and onboarding preference management.
 * TODO: Replace with Supabase `profiles` & `user_settings` table queries.
 */

import { UserProfile } from "./authService";

export interface OnboardingData {
  learningGoals: string[];
  selectedSkills: string[];
  interests: string[];
  weeklyHours: "5" | "10" | "20" | "30";
  dreamCareer: string;
}

export const UserService = {
  /**
   * Complete student onboarding steps
   */
  async saveStudentOnboarding(userId: string, data: OnboardingData): Promise<Partial<UserProfile>> {
    // TODO: Replace with `supabase.from('profiles').update({ ...data, onboarding_completed: true }).eq('id', userId)`
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      onboardingCompleted: true,
    };
  },

  /**
   * Fetch user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // TODO: Replace with `supabase.from('profiles').select('*').eq('id', userId).single()`
    await new Promise((resolve) => setTimeout(resolve, 300));
    return null;
  },
};
