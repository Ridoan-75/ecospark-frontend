import axiosInstance from "@/lib/axios";
import { TApiResponse, TMeta } from "@/types/common.types";
import { TComment } from "@/types/comment.types";

type TCommentsResponse = { data: TComment[]; meta: TMeta };

const create = async (payload: {
  body: string;
  ideaId: string;
  parentId?: string | null;
}) => {
  const res = await axiosInstance.post<TApiResponse<TComment>>(
    "/comments",
    payload
  );
  return res.data;
};

const getByIdeaId = async (
  ideaId: string,
  params?: { page?: number; limit?: number }
) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  const res = await axiosInstance.get<TApiResponse<TCommentsResponse>>(
    `/comments/idea/${ideaId}?${query.toString()}`
  );
  return res.data;
};

const update = async (id: string, body: string) => {
  const res = await axiosInstance.patch<TApiResponse<TComment>>(
    `/comments/${id}`,
    { body }
  );
  return res.data;
};

const deleteComment = async (id: string) => {
  const res = await axiosInstance.delete<TApiResponse<null>>(
    `/comments/${id}`
  );
  return res.data;
};

const getMyComments = async (params?: { page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  const res = await axiosInstance.get<TApiResponse<TCommentsResponse>>(
    `/comments/my?${query.toString()}`
  );
  return res.data;
};

const getAdminAll = async (params?: {
  page?: number;
  limit?: number;
  ideaId?: string;
  userId?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.ideaId) query.append("ideaId", params.ideaId);
  if (params?.userId) query.append("userId", params.userId);
  const res = await axiosInstance.get<TApiResponse<TCommentsResponse>>(
    `/comments/admin/all?${query.toString()}`
  );
  return res.data;
};

export const commentService = {
  create,
  getByIdeaId,
  update,
  deleteComment,
  getMyComments,
  getAdminAll,
};