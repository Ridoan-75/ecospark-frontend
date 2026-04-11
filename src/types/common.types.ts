export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TRole = "MEMBER" | "ADMIN";
export type TIdeaStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type TVoteType = "UP" | "DOWN";
export type TPaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type TPaymentGateway = "STRIPE";