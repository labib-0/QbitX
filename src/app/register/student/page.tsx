"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { SuccessModal } from "@/components/auth/SuccessModal";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff, RefreshCw, ArrowRight } from "lucide-react";

export default function StudentRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    source: "",
    acceptTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { registerStudent } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.acceptTerms) {
      setError("You must agree to the Terms and Conditions to register.");
      return;
    }

    setLoading(true);

    try {
      const names = formData.name.split(" ");
      await registerStudent({
        firstName: names[0] || formData.name,
        lastName: names.slice(1).join(" ") || "Student",
        university: "Tech University",
        department: "Computer Science",
        studentId: `CS-${Date.now().toString().slice(-4)}`,
        academicYear: "Freshman",
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        country: "United States",
        city: "Boston",
        experience: "Beginner",
        track: "Web Development",
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push("/student/dashboard");
  };

  return (
    <AuthLayout illustrationType="register">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-heading">
          Hello There,
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Register now to explore more
        </p>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
        </div>

        {/* Phone with Country Prefix */}
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800 pr-2.5">
            <span>🇧🇩</span>
            <span>+880</span>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1712345678"
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-24 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* How did you hear about us select */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            How did you first hear about us? (Optional)
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          >
            <option value="">Select an option</option>
            <option value="facebook">Facebook / Social Media</option>
            <option value="youtube">YouTube</option>
            <option value="friend">Friend / Campus Recommendation</option>
            <option value="search">Google Search</option>
          </select>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500 h-4 w-4 shrink-0"
            />
            <span>
              I agree to{" "}
              <Link href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Terms and conditions</Link>,{" "}
              <Link href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Refund policy</Link> &{" "}
              <Link href="#" className="text-sky-600 dark:text-sky-400 hover:underline font-heading">Privacy Policy</Link>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-heading"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Register</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Already have an account?{" "}
        <Link href="/login/student" className="text-sky-600 dark:text-sky-400 font-extrabold hover:underline font-heading">
          Log in
        </Link>
      </p>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Registration Successful!"
        message="Welcome to QbitX! Your student account is ready. Let's start learning."
        buttonText="Go to Student Dashboard"
        onConfirm={handleModalConfirm}
      />
    </AuthLayout>
  );
}
