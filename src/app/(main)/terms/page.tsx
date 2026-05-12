import Link from "next/link";
import { Suspense } from "react";
import { FileText } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BackButton from "@/components/shared/BackButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By creating an account or using EcoSpark Hub, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes.",
  },
  {
    title: "2. Use of the Platform",
    content:
      "EcoSpark Hub is a community platform for sharing sustainability ideas. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You are responsible for all content you submit, post, or share on EcoSpark Hub.",
  },
  {
    title: "3. User Accounts",
    content:
      "You must provide accurate information when creating your account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "4. Content Guidelines",
    content:
      "All ideas and content submitted must relate to sustainability, environmental awareness, or eco-friendly practices. Content that is hateful, offensive, spam, or unrelated to the platform's mission may be removed. Repeated violations may result in account suspension.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "You retain ownership of the ideas and content you submit. By posting on EcoSpark Hub, you grant us a non-exclusive, royalty-free license to display and distribute your content on the platform. You confirm that your submissions do not infringe any third-party intellectual property rights.",
  },
  {
    title: "6. Premium Content & Payments",
    content:
      "Some ideas on EcoSpark Hub may be marked as premium and require a one-time payment to access full details. All payments are processed securely. Refunds are handled on a case-by-case basis — contact support within 7 days of purchase if you have an issue.",
  },
  {
    title: "7. Community Standards",
    content:
      "EcoSpark Hub is built on respectful community interaction. Harassment, discrimination, or abusive behavior toward other members will not be tolerated and may result in immediate account termination. We encourage constructive feedback and positive collaboration.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "EcoSpark Hub is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. The platform does not guarantee the accuracy or feasibility of any ideas posted by community members.",
  },
  {
    title: "9. Termination",
    content:
      "We reserve the right to suspend or terminate your account at any time if you violate these terms. You may also delete your account at any time from your profile settings. Upon termination, your access to the platform will be revoked.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have any questions about these Terms of Service, please reach out to us through the platform's contact page or email us at support@ecosparkhub.com. We aim to respond to all inquiries within 2 business days.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Suspense>
          <BackButton />
        </Suspense>

        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-11 h-11 rounded-2xl glass-purple flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Terms of <span className="gradient-text-purple">Service</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm mb-2 ml-[60px]">
          Last updated: May 2025
        </p>
        <p className="text-white/50 text-sm mb-10 ml-[60px]">
          Please read these terms carefully before using EcoSpark Hub.
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
              href={ROUTES.PRIVACY}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
