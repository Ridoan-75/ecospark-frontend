import axiosInstance from "@/lib/axios";
import { TApiResponse, TMeta } from "@/types/common.types";
import { TPayment } from "@/types/payment.types";

type TPaymentsResponse = {
  payments: TPayment[];
  stats: { totalRevenue: number; totalSuccessfulPayments: number };
};

type TInitiateResponse = {
  payment: TPayment;
  checkoutUrl: string;
  sessionId: string;
};

type TAccessResponse = {
  hasAccess: boolean;
  payment: TPayment | null;
};

// ─────────────────────────────────────────────
// Initiate Payment
// ─────────────────────────────────────────────
const initiate = async (ideaId: string) => {
  const res = await axiosInstance.post<TApiResponse<TInitiateResponse>>(
    "/payments/initiate",
    { ideaId }
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Verify Payment
// ─────────────────────────────────────────────
const verify = async (sessionId: string) => {
  const res = await axiosInstance.get<
    TApiResponse<{ payment: TPayment; sessionStatus: string }>
  >(`/payments/verify/${sessionId}`);
  return res.data;
};

// ─────────────────────────────────────────────
// Get My Payments
// ─────────────────────────────────────────────
const getMyPayments = async () => {
  const res = await axiosInstance.get<TApiResponse<TPayment[]>>(
    "/payments/my"
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Check Access
// ─────────────────────────────────────────────
const checkAccess = async (ideaId: string) => {
  const res = await axiosInstance.get<TApiResponse<TAccessResponse>>(
    `/payments/access/${ideaId}`
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Admin Get All Payments
// ─────────────────────────────────────────────
const getAdminAll = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.status) query.append("status", params.status);

  const res = await axiosInstance.get<
    TApiResponse<TPaymentsResponse>
  >(`/payments/admin/all?${query.toString()}`);

  return res.data;
};

// ─────────────────────────────────────────────
// Export Service
// ─────────────────────────────────────────────
export const paymentService = {
  initiate,
  verify,
  getMyPayments,
  checkAccess,
  getAdminAll,
};