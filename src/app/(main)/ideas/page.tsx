"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { TIdea } from "@/types/idea.types";
import { IDEAS_PER_PAGE } from "@/constants";
import IdeaCard from "@/components/idea/IdeaCard";
import IdeaFilters from "@/components/idea/IdeaFilters";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TFilters = {
  searchTerm: string;
  categoryId: string;
  isPaid: string;
  sortBy: string;
};

const DEFAULT_FILTERS: TFilters = {
  searchTerm: "",
  categoryId: "",
  isPaid: "",
  sortBy: "recent",
};

export default function AllIdeasPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.searchTerm, 400);

  const { data, isLoading } = useQuery({
    queryKey: [
      ...QUERY_KEYS.IDEAS,
      page,
      debouncedSearch,
      filters.categoryId,
      filters.isPaid,
      filters.sortBy,
    ],
    queryFn: () =>
      ideaService.getAll({
        page,
        limit: IDEAS_PER_PAGE,
        searchTerm: debouncedSearch || undefined,
        categoryId: filters.categoryId || undefined,
        isPaid:
          filters.isPaid === ""
            ? undefined
            : filters.isPaid === "true",
        sortBy: filters.sortBy as "recent" | "top_voted" | "most_commented" | "most_viewed",
      }),
  });

  const ideas = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = useCallback((updates: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">

      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Community Ideas
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            All <span className="gradient-text">Ideas</span>
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto">
            Browse, filter and discover sustainability ideas shared by our community
          </p>
          {meta && (
            <p className="text-white/25 text-sm mt-2">
              {meta.total} ideas found
            </p>
          )}
        </div>

        {/* Filters */}
        <IdeaFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Grid */}
        {isLoading ? (
          <IdeasSkeleton />
        ) : ideas.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas found"
            description="Try adjusting your filters or search term to find what you're looking for."
            actionLabel="Reset Filters"
            onAction={handleReset}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {ideas.map((idea: TIdea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="ghost"
                  className="btn-glass h-10 px-4 rounded-xl gap-2 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: meta.totalPage }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPage ||
                        Math.abs(p - page) <= 1
                    )
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-white/30 px-1">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            p === page
                              ? "btn-glow text-white"
                              : "glass text-white/50 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <Button
                  onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                  disabled={page === meta.totalPage}
                  variant="ghost"
                  className="btn-glass h-10 px-4 rounded-xl gap-2 disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function IdeasSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <Skeleton className="h-44 w-full bg-white/5" />
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-3.5 w-3/4 bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-2/3 bg-white/5" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-3 w-12 bg-white/5" />
              <Skeleton className="h-3 w-12 bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}