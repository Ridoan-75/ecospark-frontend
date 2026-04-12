import axiosInstance from "@/lib/axios";
import { TApiResponse, TMeta } from "@/types/common.types";
import { TUser } from "@/types/user.types";

type TUsersResponse = { data: TUser[]; meta: TMeta };
type TUserFilters = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: "MEMBER" | "ADMIN";
  isActive?: boolean;
};

const getAll = async (filters?: TUserFilters) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));
  if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
  if (filters?.role) params.append("role", filters.role);
  if (filters?.isActive !== undefined)
    params.append("isActive", String(filters.isActive));
  const res = await axiosInstance.get<TApiResponse<TUsersResponse>>(
    `/users?${params.toString()}`
  );
  return res.data;
};

const getById = async (id: string) => {
  const res = await axiosInstance.get<TApiResponse<TUser>>(`/users/${id}`);
  return res.data;
};

const updateStatus = async (id: string, isActive: boolean) => {
  const res = await axiosInstance.patch<TApiResponse<TUser>>(
    `/users/${id}/status`,
    { isActive }
  );
  return res.data;
};

const updateRole = async (id: string, role: "MEMBER" | "ADMIN") => {
  const res = await axiosInstance.patch<TApiResponse<TUser>>(
    `/users/${id}/role`,
    { role }
  );
  return res.data;
};

const getMyProfile = async () => {
  const res = await axiosInstance.get<TApiResponse<TUser>>("/users/profile/me");
  return res.data;
};

const updateMyProfile = async (formData: FormData) => {
  const res = await axiosInstance.patch<TApiResponse<TUser>>(
    "/users/profile/me",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

const deleteMyAccount = async () => {
  const res = await axiosInstance.delete<TApiResponse<null>>(
    "/users/profile/me"
  );
  return res.data;
};

export const userService = {
  getAll,
  getById,
  updateStatus,
  updateRole,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
};