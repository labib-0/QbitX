/**
 * EmailVerificationService — Mock service handling email OTP / link verification.
 * TODO: Integrate with Supabase `supabase.auth.verifyOtp()` or SendGrid / Resend API.
 */

export const EmailVerificationService = {
  async resendVerificationEmail(email: string): Promise<boolean> {
    // TODO: Replace with Supabase `supabase.auth.resend({ type: 'signup', email })`
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },

  async verifyToken(token: string): Promise<boolean> {
    // TODO: Replace with token validation against backend API
    await new Promise((resolve) => setTimeout(resolve, 600));
    return true;
  },
};
