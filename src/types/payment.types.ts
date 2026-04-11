import { TPaymentGateway, TPaymentStatus } from "./common.types";
import { TIdea } from "./idea.types";
import { TUser } from "./user.types";

export type TPayment = {
  id: string;
  amount: number;
  status: TPaymentStatus;
  gateway: TPaymentGateway;
  transactionId: string | null;
  stripeSessionId: string | null;
  userId: string;
  user?: Pick<TUser, "id" | "name" | "email" | "profileImage">;
  ideaId: string;
  idea?: Pick<TIdea, "id" | "title" | "images" | "category">;
  createdAt: string;
  updatedAt: string;
};