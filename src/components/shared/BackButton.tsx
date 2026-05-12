"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function BackButton() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const href =
    from === "register" ? ROUTES.REGISTER :
    from === "login" ? ROUTES.LOGIN :
    ROUTES.HOME;

  const label =
    from === "register" ? "Back to sign up" :
    from === "login" ? "Back to sign in" :
    "Back to home";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {label}
    </Link>
  );
}
