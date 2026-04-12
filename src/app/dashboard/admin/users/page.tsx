"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Users, Search, Shield, ShieldOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { userService } from "@/services/user.service";
import { TUser } from "@/types/user.types";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageHeader from "@/components/shared/PageHeader";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusTarget, setStatusTarget] = useState<TUser | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.USERS, debouncedSearch, roleFilter],
    queryFn: () =>
      userService.getAll({
        searchTerm: debouncedSearch || undefined,
        role: roleFilter === "all" ? undefined : (roleFilter as "MEMBER" | "ADMIN"),
        limit: 100,
      }),
  });

  const users = data?.data?.data ?? [];

  const { mutate: updateStatus, isPending: updating } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.updateStatus(id, isActive),
    onSuccess: (_, vars) => {
      toast.success(
        `User ${vars.isActive ? "activated" : "deactivated"} successfully`
      );
      setStatusTarget(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "MEMBER" | "ADMIN" }) =>
      userService.updateRole(id, role),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Manage Users"
        description="View and manage all platform members"
        icon={Users}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 h-10 rounded-xl"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All Roles</SelectItem>
            <SelectItem value="MEMBER" className="hover:bg-white/10 focus:bg-white/10">Member</SelectItem>
            <SelectItem value="ADMIN" className="hover:bg-white/10 focus:bg-white/10">Admin</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-white/30 text-sm self-center">
          {users.length} users
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4 hidden md:table-cell">Joined</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="text-white/30 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/30 text-xs">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Select
                      value={user.role}
                      onValueChange={(role) =>
                        updateRole({ id: user.id, role: role as "MEMBER" | "ADMIN" })
                      }
                    >
                      <SelectTrigger className="h-8 w-28 glass border-white/10 text-xs rounded-lg text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-200 border-white/10 text-white">
                        <SelectItem value="MEMBER" className="hover:bg-white/10 focus:bg-white/10 text-xs">Member</SelectItem>
                        <SelectItem value="ADMIN" className="hover:bg-white/10 focus:bg-white/10 text-xs">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        user.isActive ? "badge-green" : "badge-red"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setStatusTarget(user)}
                      className={`w-8 h-8 glass rounded-lg flex items-center justify-center transition-colors ${
                        user.isActive
                          ? "text-white/40 hover:text-red-400"
                          : "text-white/40 hover:text-green-400"
                      }`}
                    >
                      {user.isActive ? (
                        <ShieldOff className="w-3.5 h-3.5" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!statusTarget}
        onOpenChange={(o) => !o && setStatusTarget(null)}
        title={statusTarget?.isActive ? "Deactivate User" : "Activate User"}
        description={`Are you sure you want to ${
          statusTarget?.isActive ? "deactivate" : "activate"
        } ${statusTarget?.name}?`}
        confirmLabel={statusTarget?.isActive ? "Deactivate" : "Activate"}
        onConfirm={() =>
          statusTarget &&
          updateStatus({ id: statusTarget.id, isActive: !statusTarget.isActive })
        }
        loading={updating}
        variant={statusTarget?.isActive ? "danger" : "default"}
      />
    </div>
  );
}