import Link from "next/link";
import { Suspense } from "react";
import { Shield } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BackButton from "@/components/shared/BackButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly, such as your name, email address, and profile picture when you register. We also collect content you submit — ideas, votes, and comments. Usage data such as pages visited, features used, and device information may be collected automatically to improve the platform.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used to operate and improve EcoSpark Hub, personalize your experience, send important account notifications, and process payments for premium content. We do not sell your personal information to third parties.",
  },
  {
    title: "3. Google Sign-In",
    content:
      "If you choose to sign in with Google, we receive your name, email address, and profile picture from Google. We do not receive or store your Google password. Your use of Google Sign-In is also governed by Google's Privacy Policy.",
  },
  {
    title: "4. Cookies & Local Storage",
    content:
      "We use cookies and browser local storage to keep you logged in and remember your preferences. These are essential for the platform to function. You can clear your browser's cookies and local storage at any time, which will log you out of the platform.",
  },
  {
    title: "5. Data Sharing",
    content:
      "We do not sell, trade, or rent your personal information. We may share anonymized, aggregated data for research or analytics purposes. We may disclose your information if required by law or to protect the rights and safety of our users.",
  },
  {
    title: "6. Data Security",
    content:
      "We take reasonable measures to protect your personal information from unauthorized access, including secure HTTPS connections and encrypted password storage. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "7. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal information at any time from your profile settings. If you wish to permanently delete your account and all associated data, contact our support team and we will process your request within 30 days.",
  },
  {
    title: "8. Children's Privacy",
    content:
      "EcoSpark Hub is not intended for users under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it.",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform. Your continued use of EcoSpark Hub after changes are posted constitutes your acceptance of the updated policy.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions or concerns about this Privacy Policy or how we handle your data, please contact us at privacy@ecosparkhub.com. We are committed to addressing your concerns promptly.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Suspense>
          <BackButton />
        </Suspense>

        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-11 h-11 rounded-2xl glass-purple flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Privacy <span className="gradient-text-purple">Policy</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm mb-2 ml-[60px]">
          Last updated: May 2025
        </p>
        <p className="text-white/50 text-sm mb-10 ml-[60px]">
          Your privacy matters to us. Here is how we handle your data.
        </p>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="glass gradient-border rounded-2xl p-6"
            >
              <h2 className="text-white font-semibold mb-3">{section.title}</h2>
              <p className="text-white/55 text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 glass gradient-border rounded-2xl p-6 text-center">
          <p className="text-white/40 text-sm">
            By using EcoSpark Hub you also agree to our{" "}
            <Link
              href={ROUTES.TERMS}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
