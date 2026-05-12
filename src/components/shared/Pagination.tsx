"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: TProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const rendered: (number | "...")[] = [];
  let prev: number | null = null;
  for (const p of visiblePages) {
    if (prev !== null && p - prev > 1) rendered.push("...");
    rendered.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {rendered.map((item, i) =>
        item === "..." ? (
          <span key={`ellipsis-${i}`} className="text-white/30 text-sm px-1">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={cn(
              "w-8 h-8 rounded-lg text-sm font-medium transition-all",
              item === currentPage
                ? "bg-purple-500/30 border border-purple-500/50 text-purple-300"
                : "glass text-white/50 hover:text-white"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
