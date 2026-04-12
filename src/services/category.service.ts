import axiosInstance from "@/lib/axios";
import { TApiResponse, TMeta } from "@/types/common.types";
import { TCategory } from "@/types/idea.types";

type TCategoriesResponse = { data: TCategory[]; meta: TMeta };

const getAll = async (params?: { page?: number; limit?: number; searchTerm?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
  const res = await axiosInstance.get<TApiResponse<TCategoriesResponse>>(
    `/categories?${query.toString()}`
  );
  return res.data;
};

const getById = async (id: string) => {
  const res = await axiosInstance.get<TApiResponse<TCategory>>(
    `/categories/${id}`
  );
  return res.data;
};

const create = async (name: string) => {
  const res = await axiosInstance.post<TApiResponse<TCategory>>(
    "/categories",
    { name }
  );
  return res.data;
};

const update = async (id: string, name: string) => {
  const res = await axiosInstance.patch<TApiResponse<TCategory>>(
    `/categories/${id}`,
    { name }
  );
  return res.data;
};

const deleteCategory = async (id: string) => {
  const res = await axiosInstance.delete<TApiResponse<null>>(
    `/categories/${id}`
  );
  return res.data;
};

export const categoryService = {
  getAll,
  getById,
  create,
  update,
  deleteCategory,
};