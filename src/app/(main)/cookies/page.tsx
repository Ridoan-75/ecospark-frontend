import Link from "next/link";
import { Suspense } from "react";
import { Cookie } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BackButton from "@/components/shared/BackButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

const sections = [
  {
    title: "1. What Are Cookies?",
    content:
      "Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you use the platform. EcoSpark Hub uses both session cookies (deleted when you close your browser) and persistent cookies (stored until they expire or you delete them).",
  },
  {
    title: "2. Essential Cookies",
    content:
      "These cookies are necessary for the platform to function correctly. They manage your login session, keep you authenticated across pages, and remember your security preferences. Without these cookies, EcoSpark Hub cannot operate properly. You cannot opt out of essential cookies while using the platform.",
  },
  {
    title: "3. Local Storage",
    content:
      "In addition to cookies, EcoSpark Hub uses your browser's local storage to save your authentication state and user preferences. This allows the platform to remember you between sessions without requiring you to log in every time. Clearing your browser's local storage will log you out.",
  },
  {
    title: "4. Analytics Cookies",
    content:
      "We may use analytics tools to understand how users interact with EcoSpark Hub — such as which pages are most visited, how long users spend on the platform, and which features are used most. This data is anonymized and aggregated, and is used solely to improve the platform experience.",
  },
  {
    title: "5. Third-Party Cookies",
    content:
      "If you choose to sign in using Google, Google may set its own cookies on your device as part of the authentication process. These cookies are governed by Google's own Cookie Policy and Privacy Policy. We do not control third-party cookies and recommend reviewing their policies directly.",
  },
  {
    title: "6. Payment Processing",
    content:
      "When you make a payment for premium content, our payment processor (e.g., Stripe or SSLCommerz) may set cookies to manage the transaction securely. These are strictly necessary for completing the payment and are not used for tracking or advertising.",
  },
  {
    title: "7. Managing Cookies",
    content:
      "You can control and delete cookies through your browser settings. Most browsers allow you to block cookies, delete existing cookies, or alert you before cookies are stored. Note that blocking essential cookies will affect your ability to use EcoSpark Hub, including staying logged in.",
  },
  {
    title: "8. Cookie Retention",
    content:
      "Session cookies are deleted automatically when you close your browser. Persistent cookies remain on your device for up to 7 days (for authentication) or until you clear them manually. We do not store cookies longer than necessary for their intended purpose.",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "We may update this Cookie Policy as we introduce new features or as legal requirements change. Any significant changes will be communicated via a notice on the platform. Your continued use of EcoSpark Hub after changes are posted means you accept the updated policy.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions about how we use cookies or wish to opt out of non-essential cookies, please contact us at privacy@ecosparkhub.com. We are happy to help you manage your cookie preferences.",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Suspense>
          <BackButton />
        </Suspense>

        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-11 h-11 rounded-2xl glass-purple flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Cookie <span className="gradient-text-purple">Policy</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm mb-2 ml-[60px]">Last updated: May 2025</p>
        <p className="text-white/50 text-sm mb-10 ml-[60px]">
          How EcoSpark Hub uses cookies and similar technologies.
        </p>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="glass gradient-border rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">{section.title}</h2>
              <p className="text-white/55 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 glass gradient-border rounded-2xl p-6 text-center">
          <p className="text-white/40 text-sm">
            Also see our{" "}
            <Link href={ROUTES.TERMS} className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href={ROUTES.PRIVACY} className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
