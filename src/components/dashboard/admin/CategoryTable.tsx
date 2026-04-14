"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag, Check, X } from "lucide-react";
import { categoryService } from "@/services/category.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { TCategory } from "@/types/idea.types";

export default function CategoryTable() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TCategory | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  const categories = data?.data ?? [];
  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES, refetchType: 'active' });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => categoryService.create(newName.trim()),
    onSuccess: () => { toast.success("Category created!"); invalidate(); setNewName(""); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => categoryService.update(id, name),
    onSuccess: () => { toast.success("Category updated!"); invalidate(); setEditId(null); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => { toast.success("Category deleted"); invalidate(); setDeleteTarget(null); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  return (
    <div className="space-y-4">
      {/* Add New */}
      <div className="glass gradient-border rounded-xl p-4">
        <p className="text-white/60 text-sm font-medium mb-3">Add New Category</p>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="input-glass h-10 rounded-xl flex-1"
            onKeyDown={(e) => { if (e.key === "Enter" && newName.trim().length >= 2) create(); }}
          />
          <Button
            onClick={() => { if (newName.trim().length >= 2) create(); else toast.error("Name must be at least 2 characters"); }}
            disabled={creating}
            className="btn-glow text-white border-0 rounded-xl gap-2 h-10"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Ideas</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><Skeleton className="h-4 bg-white/5 rounded" /></td>
                ))}</tr>
              ))
            ) : categories.length === 0 ? (
              <tr><td colSpan={4}><EmptyState icon={Tag} title="No categories yet" /></td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3">
                    {editId === cat.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-glass h-8 rounded-lg text-sm w-48"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") update({ id: cat.id, name: editName });
                          if (e.key === "Escape") setEditId(null);
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-white/80 text-sm font-medium">{cat.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/50 text-sm">{cat._count?.ideas ?? 0}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{formatDate((cat as Record<string, unknown>).createdAt as string)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {editId === cat.id ? (
                        <>
                          <button onClick={() => update({ id: cat.id, name: editName })} disabled={updating}
                            className="p-1.5 text-white/30 hover:text-green-400 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                            className="p-1.5 text-white/30 hover:text-purple-400 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(cat)}
                            className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? This will fail if the category has ideas.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteCategory(deleteTarget.id)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}