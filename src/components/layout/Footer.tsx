"use client";

import Link from "next/link";
import { Mail, Leaf } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import Logo from "@/components/shared/Logo";

const footerLinks = {
  Platform: [
    { label: "Home", href: ROUTES.HOME },
    { label: "All Ideas", href: ROUTES.IDEAS },
    { label: "About Us", href: ROUTES.ABOUT },
  ],
  Account: [
    { label: "Login", href: ROUTES.LOGIN },
    { label: "Register", href: ROUTES.REGISTER },
    { label: "Dashboard", href: ROUTES.MEMBER_DASHBOARD },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  {
    href: "#",
    label: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Twitter",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Email",
    svg: <Mail className="w-4 h-4" />,
  },
];

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-purple-950/40 to-black backdrop-blur-3xl" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-40 bg-purple-600/20 blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <Logo variant="compact" />

            <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-sm">
              Share sustainability ideas, connect with innovators, and help build a greener future together.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10 bg-white/5 hover:bg-purple-500/30 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm relative group"
                    >
                      {link.label}
                      <span className="absolute left-0 -bottom-1 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} EcoSpark Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Built with</span>
            <Leaf className="w-4 h-4 text-green-400 animate-pulse" />
            <span>for the planet</span>
          </div>
        </div>

      </div>
    </footer>
  );
}