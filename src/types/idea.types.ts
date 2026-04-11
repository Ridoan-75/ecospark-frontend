import { TIdeaStatus, TVoteType } from "./common.types";
import { TUser } from "./user.types";

export type TCategory = {
  id: string;
  name: string;
  _count?: { ideas: number };
};

export type TIdea = {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  images: string[];
  status: TIdeaStatus;
  isPaid: boolean;
  price: number | null;
  rejectionFeedback: string | null;
  viewCount: number;
  isDeleted: boolean;
  authorId: string;
  author: Pick<TUser, "id" | "name" | "profileImage">;
  categoryId: string;
  category: TCategory;
  createdAt: string;
  updatedAt: string;
  userVote?: TVoteType | null;
  _count?: {
    votes: number;
    comments: number;
  };
};