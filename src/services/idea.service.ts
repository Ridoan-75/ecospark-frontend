import axiosInstance from "@/lib/axios";
import { TApiResponse, TMeta } from "@/types/common.types";
import { TIdea } from "@/types/idea.types";

type TIdeasResponse = {
  data: TIdea[];
  meta: TMeta;
};

type TIdeaFilters = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  isPaid?: boolean;
  sortBy?: "recent" | "top_voted" | "most_commented" | "most_viewed";
};

const getAll = async (filters?: TIdeaFilters) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));
  if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.isPaid !== undefined) params.append("isPaid", String(filters.isPaid));
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);

  const res = await axiosInstance.get<TApiResponse<TIdeasResponse>>(
    `/ideas?${params.toString()}`
  );
  return res.data;
};

const getTopVoted = async (limit: number = 6) => {
  const res = await axiosInstance.get<TApiResponse<TIdea[]>>(
    `/ideas/top-voted?limit=${limit}`
  );
  return res.data;
};

const getById = async (id: string) => {
  const res = await axiosInstance.get<TApiResponse<TIdea>>(`/ideas/${id}`);
  return res.data;
};

const getMyIdeas = async (filters?: { page?: number; limit?: number; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));
  if (filters?.status) params.append("status", filters.status);

  const res = await axiosInstance.get<TApiResponse<TIdeasResponse>>(
    `/ideas/my?${params.toString()}`
  );
  return res.data;
};

const getAdminAll = async (filters?: TIdeaFilters & { status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));
  if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.status) params.append("status", filters.status);

  const res = await axiosInstance.get<TApiResponse<TIdeasResponse>>(
    `/ideas/admin/all?${params.toString()}`
  );
  return res.data;
};

const create = async (formData: FormData) => {
  const res = await axiosInstance.post<TApiResponse<TIdea>>("/ideas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const update = async (id: string, formData: FormData) => {
  const res = await axiosInstance.patch<TApiResponse<TIdea>>(
    `/ideas/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

const submit = async (id: string) => {
  const res = await axiosInstance.patch<TApiResponse<TIdea>>(
    `/ideas/${id}/submit`
  );
  return res.data;
};

const approve = async (id: string) => {
  const res = await axiosInstance.patch<TApiResponse<TIdea>>(
    `/ideas/${id}/approve`
  );
  return res.data;
};

const reject = async (id: string, rejectionFeedback: string) => {
  const res = await axiosInstance.patch<TApiResponse<TIdea>>(
    `/ideas/${id}/reject`,
    { rejectionFeedback }
  );
  return res.data;
};

const deleteIdea = async (id: string) => {
  const res = await axiosInstance.delete<TApiResponse<null>>(`/ideas/${id}`);
  return res.data;
};

const deleteIdeaAdmin = async (id: string) => {
  const res = await axiosInstance.delete<TApiResponse<null>>(
    `/ideas/admin/${id}`
  );
  return res.data;
};

export const ideaService = {
  getAll,
  getTopVoted,
  getById,
  getMyIdeas,
  getAdminAll,
  create,
  update,
  submit,
  approve,
  reject,
  deleteIdea,
  deleteIdeaAdmin,
};