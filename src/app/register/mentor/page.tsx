"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { ProfileUploader } from "@/components/auth/ProfileUploader";
import { UniversitySelector } from "@/components/auth/UniversitySelector";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { SuccessModal } from "@/components/auth/SuccessModal";
import { useAuth } from "@/context/authContext";
import { ArrowRight, RefreshCw } from "lucide-react";

export default function MentorRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "Senior CS Tutor & TA",
    organization: "Stanford University",
    university: "Stanford University",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    yearsOfExperience: "3-5 Years",
    areaOfExpertise: "AI & Machine Learning",
    bio: "",
    agreeTerms: true,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnderReviewModal, setShowUnderReviewModal] = useState(false);

  const { registerMentor, adminApprovedToggle } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.phone || !formData.bio) {
      setError("Please complete all required fields marked with *.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to become a verified mentor and uphold academic integrity.");
      return;
    }

    setLoading(true);

    try {
      await registerMentor({
        ...formData,
        photoFile,
        cvFile,
        documentsFile: docFile,
      });
      setShowUnderReviewModal(true);
    } catch (err: any) {
      setError(err.message || "Registration submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowUnderReviewModal(false);
    if (adminApprovedToggle) {
      router.push("/dashboard/mentor");
    } else {
      router.push("/login/mentor");
    }
  };

  const inputClasses = "w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors";
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-200";

  return (
    <AuthLayout
      title="Apply as Senior Mentor"
      subtitle="Join QbitX to guide underclassmen, lead project guilds, and earn stipends or course credits."
      role="mentor"
    >
      <RoleSelector currentRole="mentor" action="register" />

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sarah Chen"
              required
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Current Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior CS Tutor / Software Engineer"
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Organization & University */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClasses}>Company / Organization <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. Stanford University / Tech Corp"
              required
              className={inputClasses}
            />
          </div>

          <UniversitySelector
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@stanford.edu"
              required
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 392-1049"
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className={labelClasses}>LinkedIn URL <span className="text-red-500">*</span></label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              required
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>GitHub (optional)</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="sarah-chen"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Portfolio Website</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://sarahchen.dev"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Experience & Area of Expertise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClasses}>Years of Experience <span className="text-red-500">*</span></label>
            <select
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className={inputClasses}
            >
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Area of Primary Expertise <span className="text-red-500">*</span></label>
            <select
              name="areaOfExpertise"
              value={formData.areaOfExpertise}
              onChange={handleChange}
              className={inputClasses}
            >
              <option>AI & Machine Learning</option>
              <option>Data Structures & Algorithms</option>
              <option>Full-Stack Web Development</option>
              <option>Systems & Cybersecurity</option>
              <option>PASS Study Sessions</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className={labelClasses}>Short Bio / Philosophy <span className="text-red-500">*</span></label>
          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Describe your teaching experience, research background, and how you guide students..."
            required
            className={inputClasses}
          />
        </div>

        {/* File Uploads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <ProfileUploader
            label="Profile Photo *"
            accept="image/*"
            description="JPG, PNG up to 5MB"
            onFileSelect={setPhotoFile}
          />

          <ProfileUploader
            label="Upload CV / Resume *"
            accept=".pdf,.doc,.docx"
            description="PDF up to 10MB"
            onFileSelect={setCvFile}
          />

          <ProfileUploader
            label="Verification Documents"
            accept=".pdf,.png,.jpg"
            description="Transcript / Student ID"
            onFileSelect={setDocFile}
          />
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2 text-sm">
          <label className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            <span>I agree to become a verified QbitX mentor and uphold academic code of conduct. *</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Submit Application for Review</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Already an approved mentor?{" "}
        <Link href="/login/mentor" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
          Login here
        </Link>
      </p>

      {/* Under Review Modal */}
      <SuccessModal
        isOpen={showUnderReviewModal}
        title={adminApprovedToggle ? "Mentor Application Approved!" : "Your Application is Under Review"}
        message={
          adminApprovedToggle
            ? "Congratulations! Your mentor application was approved. You can now access the Senior Mentor Portal."
            : "Thank you for applying to QbitX! Your mentor application has been submitted and is currently under review by our Admin Team. You cannot log in until approved."
        }
        buttonText={adminApprovedToggle ? "Enter Mentor Dashboard" : "Go to Mentor Login"}
        onConfirm={handleModalConfirm}
      />
    </AuthLayout>
  );
}
