import { TRole } from "./common.types";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TRole;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    ideas: number;
    votes: number;
    comments: number;
    payments: number;
  };
};