import { TVoteType } from "./common.types";
import { TIdea } from "./idea.types";

export type TVote = {
  id: string;
  type: TVoteType;
  userId: string;
  ideaId: string;
  idea?: Pick<TIdea, "id" | "title" | "category" | "images" | "status">;
  createdAt: string;
};

export type TVoteStats = {
  ideaId: string;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  score: number;
  userVote: TVoteType | null;
};