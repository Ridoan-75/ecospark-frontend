import axiosInstance from "@/lib/axios";
import { TApiResponse } from "@/types/common.types";
import { TVote, TVoteStats } from "@/types/vote.types";

type TCastVoteResponse = {
  message: string;
  vote: TVote | null;
  voteStats: TVoteStats;
};

const castVote = async (ideaId: string, type: "UP" | "DOWN") => {
  const res = await axiosInstance.post<TApiResponse<TCastVoteResponse>>(
    "/votes",
    { ideaId, type }
  );
  return res.data;
};

const removeVote = async (ideaId: string) => {
  const res = await axiosInstance.delete<TApiResponse<{ voteStats: TVoteStats }>>(
    `/votes/${ideaId}`
  );
  return res.data;
};

const getStats = async (ideaId: string) => {
  const res = await axiosInstance.get<TApiResponse<TVoteStats>>(
    `/votes/${ideaId}/stats`
  );
  return res.data;
};

const getMyVotes = async () => {
  const res = await axiosInstance.get<TApiResponse<TVote[]>>("/votes/my");
  return res.data;
};

export const voteService = {
  castVote,
  removeVote,
  getStats,
  getMyVotes,
};