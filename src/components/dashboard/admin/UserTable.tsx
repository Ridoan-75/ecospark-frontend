"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Shield, ShieldOff, UserCheck, UserX, Search } from "lucide-react";
import { userService } from "@/services/user.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TUser } from "@/types/user.types";

export default function UserTable() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [confirm, setConfirm] = useState<{ type: string; user: TUser } | null>(null);
  const debounced = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.USERS, page, debounced, role],
    queryFn: () => userService.getAll({ page, limit: 10, searchTerm: debounced || undefined, role: (role || undefined) as "MEMBER" | "ADMIN" | undefined }),
  });

  const users = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const { mutate: updateStatus, isPending: statusPending } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.updateStatus(id, isActive),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); setConfirm(null); },
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

  const { mutate: updateRole, isPending: rolePending } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "MEMBER" | "ADMIN" }) =>
      userService.updateRole(id, role),
    onSuccess: () => { toast.success("Role updated"); qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); setConfirm(null); },
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
      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..." className="input-glass pl-10 h-10 rounded-xl" />
        </div>
        <Select value={role || "all"} onValueChange={(v) => { setRole(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All Roles</SelectItem>
            <SelectItem value="MEMBER" className="hover:bg-white/10 focus:bg-white/10">Member</SelectItem>
            <SelectItem value="ADMIN" className="hover:bg-white/10 focus:bg-white/10">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Ideas</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 bg-white/5 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-4">
                  <EmptyState icon={Search} title="No users found" />
                </td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={u.profileImage || ""} />
                          <AvatarFallback className="bg-purple-600 text-white text-xs">{getInitials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white/80 text-sm font-medium">{u.name}</p>
                          <p className="text-white/30 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.role === "ADMIN" ? "badge-purple rounded-full px-2.5 py-1 text-xs" : "badge-blue rounded-full px-2.5 py-1 text-xs"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.isActive ? "badge-green rounded-full px-2.5 py-1 text-xs" : "badge-red rounded-full px-2.5 py-1 text-xs"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{u._count?.ideas ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-white/40 hover:text-white p-1 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-dark-200 border-white/10 text-white w-44">
                          <DropdownMenuItem
                            onClick={() => setConfirm({ type: u.isActive ? "deactivate" : "activate", user: u })}
                            className="hover:bg-white/10 focus:bg-white/10 gap-2 cursor-pointer"
                          >
                            {u.isActive ? <UserX className="w-4 h-4 text-red-400" /> : <UserCheck className="w-4 h-4 text-green-400" />}
                            {u.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setConfirm({ type: u.role === "ADMIN" ? "demote" : "promote", user: u })}
                            className="hover:bg-white/10 focus:bg-white/10 gap-2 cursor-pointer"
                          >
                            {u.role === "ADMIN" ? <ShieldOff className="w-4 h-4 text-amber-400" /> : <Shield className="w-4 h-4 text-purple-400" />}
                            {u.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-white/8">
            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "btn-glow text-white" : "glass text-white/50 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={() => setConfirm(null)}
        title={
          confirm?.type === "deactivate" ? "Deactivate User" :
          confirm?.type === "activate" ? "Activate User" :
          confirm?.type === "promote" ? "Promote to Admin" : "Remove Admin Role"
        }
        description={
          confirm?.type === "deactivate" ? `Deactivate ${confirm.user.name}'s account?` :
          confirm?.type === "activate" ? `Activate ${confirm.user.name}'s account?` :
          confirm?.type === "promote" ? `Give ${confirm?.user?.name} admin privileges?` :
          `Remove admin role from ${confirm?.user?.name}?`
        }
        confirmLabel="Confirm"
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.type === "deactivate") updateStatus({ id: confirm.user.id, isActive: false });
          else if (confirm.type === "activate") updateStatus({ id: confirm.user.id, isActive: true });
          else if (confirm.type === "promote") updateRole({ id: confirm.user.id, role: "ADMIN" });
          else updateRole({ id: confirm.user.id, role: "MEMBER" });
        }}
        loading={statusPending || rolePending}
        variant={confirm?.type === "deactivate" ? "danger" : "default"}
      />
    </div>
  );
}