import { TUser } from "./user.types";

export type TComment = {
  id: string;
  body: string;
  isDeleted: boolean;
  authorId: string;
  author: Pick<TUser, "id" | "name" | "profileImage">;
  ideaId: string;
  parentId: string | null;
  replies?: TComment[];
  createdAt: string;
  updatedAt: string;
  _count?: { replies: number };
};