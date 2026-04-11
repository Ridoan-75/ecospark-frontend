import axiosInstance from "@/lib/axios";
import { TApiResponse } from "@/types/common.types";

const subscribe = async (email: string) => {
  const res = await axiosInstance.post<TApiResponse<{ email: string }>>(
    "/newsletter/subscribe",
    { email }
  );
  return res.data;
};

const unsubscribe = async (email: string) => {
  const res = await axiosInstance.post<TApiResponse<null>>(
    "/newsletter/unsubscribe",
    { email }
  );
  return res.data;
};

const getAll = async (params?: { page?: number; limit?: number; isActive?: boolean }) => {
  const res = await axiosInstance.get("/newsletter/admin/all", { params });
  return res.data;
};

const deleteSubscriber = async (id: string) => {
  const res = await axiosInstance.delete(`/newsletter/admin/${id}`);
  return res.data;
};

export const newsletterService = {
  subscribe,
  unsubscribe,
  getAll,
  deleteSubscriber,
};