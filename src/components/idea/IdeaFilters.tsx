"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { IDEA_SORT_OPTIONS } from "@/constants";

type TFilters = {
  searchTerm: string;
  categoryId: string;
  isPaid: string;
  sortBy: string;
};

type TProps = {
  filters: TFilters;
  onChange: (filters: Partial<TFilters>) => void;
  onReset: () => void;
};

export default function IdeaFilters({ filters, onChange, onReset }: TProps) {
  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  const categories = categoriesData?.data ?? [];

  const hasActiveFilters =
    filters.searchTerm ||
    filters.categoryId ||
    filters.isPaid ||
    filters.sortBy !== "recent";

  const triggerClass =
    "bg-white/8 border border-white/20 hover:border-white/30 focus:border-white/40 h-13 rounded-xl text-white transition-all w-full px-4";

  const itemClass = "hover:bg-white/10 focus:bg-white/10 cursor-pointer";

  return (
    <div className="relative z-50 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-xl bg-white/5 border border-white/15">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
          <Input
            placeholder="✨ Search ideas with AI..."
            value={filters.searchTerm}
            onChange={(e) => onChange({ searchTerm: e.target.value })}
            className="bg-white/8 border border-white/20 hover:border-white/30 focus:border-white/40 pl-11 h-13 rounded-xl text-white text-base placeholder:text-white/70 placeholder:text-base transition-all w-full"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(v) => onChange({ categoryId: v === "all" ? "" : v })}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e]/95 backdrop-blur-xl border-white/15 text-white rounded-xl">
            <SelectItem value="all" className={itemClass}>
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className={itemClass}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select
          value={filters.isPaid || "all"}
          onValueChange={(v) => onChange({ isPaid: v === "all" ? "" : v })}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e]/95 backdrop-blur-xl border-white/15 text-white rounded-xl">
            <SelectItem value="all" className={itemClass}>
              All Types
            </SelectItem>
            <SelectItem value="false" className={itemClass}>
              Free Only
            </SelectItem>
            <SelectItem value="true" className={itemClass}>
              Paid Only
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy || "recent"}
          onValueChange={(v) => onChange({ sortBy: v })}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e]/95 backdrop-blur-xl border-white/15 text-white rounded-xl">
            {IDEA_SORT_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={itemClass}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            onClick={onReset}
            variant="ghost"
            className="h-13 px-4 text-white/50 hover:text-white hover:bg-white/10 rounded-xl gap-2 shrink-0 transition-all border border-white/15"
          >
            <X className="w-4 h-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
