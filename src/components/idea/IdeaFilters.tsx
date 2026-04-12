"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
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

  const categories = categoriesData?.data?.data ?? [];

  const hasActiveFilters =
    filters.searchTerm ||
    filters.categoryId ||
    filters.isPaid ||
    filters.sortBy !== "recent";

  return (
    <div className="glass gradient-border rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search ideas..."
            value={filters.searchTerm}
            onChange={(e) => onChange({ searchTerm: e.target.value })}
            className="input-glass pl-10 h-10 rounded-xl"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(v) =>
            onChange({ categoryId: v === "all" ? "" : v })
          }
        >
          <SelectTrigger className="input-glass h-10 rounded-xl w-full md:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                className="hover:bg-white/10 focus:bg-white/10"
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select
          value={filters.isPaid || "all"}
          onValueChange={(v) =>
            onChange({ isPaid: v === "all" ? "" : v })
          }
        >
          <SelectTrigger className="input-glass h-10 rounded-xl w-full md:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">
              All Types
            </SelectItem>
            <SelectItem value="false" className="hover:bg-white/10 focus:bg-white/10">
              Free Only
            </SelectItem>
            <SelectItem value="true" className="hover:bg-white/10 focus:bg-white/10">
              Paid Only
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy || "recent"}
          onValueChange={(v) => onChange({ sortBy: v })}
        >
          <SelectTrigger className="input-glass h-10 rounded-xl w-full md:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            {IDEA_SORT_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="hover:bg-white/10 focus:bg-white/10"
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
            className="h-10 px-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl gap-1.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}