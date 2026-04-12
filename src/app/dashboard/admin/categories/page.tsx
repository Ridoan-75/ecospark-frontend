"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Tag, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { categoryService } from "@/services/category.service";
import { TCategory } from "@/types/idea.types";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editTarget, setEditTarget] = useState<TCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TCategory | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  const categories = data?.data?.data ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
  };

  const { mutate: createCategory, isPending: creating } = useMutation({
    mutationFn: (name: string) => categoryService.create(name),
    onSuccess: () => {
      toast.success("Category created!");
      setNewName("");
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to create");
    },
  });

  const { mutate: updateCategory, isPending: updating } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoryService.update(id, name),
    onSuccess: () => {
      toast.success("Category updated!");
      setEditTarget(null);
      setEditName("");
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to update");
    },
  });

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted!");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to delete");
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Categories"
        description="Manage idea categories"
        icon={Tag}
      />

      {/* Create */}
      <div className="glass gradient-border rounded-2xl p-5">
        <p className="text-white/60 text-sm mb-3 font-medium">
          Add New Category
        </p>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="input-glass h-10 rounded-xl flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newName.trim().length >= 2) {
                createCategory(newName.trim());
              }
            }}
          />
          <Button
            onClick={() => newName.trim().length >= 2 && createCategory(newName.trim())}
            disabled={creating || newName.trim().length < 2}
            className="btn-glow text-white border-0 h-10 px-5 rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4 hidden md:table-cell">Ideas</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-4">
                    {editTarget?.id === cat.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-glass h-8 rounded-lg text-sm w-48"
                        autoFocus
                      />
                    ) : (
                      <span className="badge-purple rounded-full px-3 py-1.5 text-sm">
                        {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/40 text-sm">
                      {cat._count?.ideas ?? 0} ideas
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {editTarget?.id === cat.id ? (
                        <>
                          <button
                            onClick={() =>
                              editName.trim().length >= 2 &&
                              updateCategory({ id: cat.id, name: editName.trim() })
                            }
                            disabled={updating}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/10"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditTarget(null);
                              setEditName("");
                            }}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditTarget(cat);
                              setEditName(cat.name);
                            }}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone. Ideas in this category must be moved first.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteCategory(deleteTarget.id)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}