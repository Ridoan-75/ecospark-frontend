import axiosInstance from "@/lib/axios";
import { TApiResponse } from "@/types/common.types";
import { TAuthResponse, TLoginPayload, TRegisterPayload } from "@/types/auth.types";

const register = async (payload: TRegisterPayload) => {
  const res = await axiosInstance.post<TApiResponse<TAuthResponse>>(
    "/auth/register",
    payload
  );
  return res.data;
};

const login = async (payload: TLoginPayload) => {
  const res = await axiosInstance.post<TApiResponse<TAuthResponse>>(
    "/auth/login",
    payload
  );
  return res.data;
};

const getMe = async () => {
  const res = await axiosInstance.get<TApiResponse<TAuthResponse["user"]>>(
    "/auth/me"
  );
  return res.data;
};

const googleLogin = async (payload: { name: string; email: string; picture?: string }) => {
  const res = await axiosInstance.post<TApiResponse<TAuthResponse>>(
    "/auth/google",
    payload
  );
  return res.data;
};

export const authService = {
  register,
  login,
  getMe,
  googleLogin,
};