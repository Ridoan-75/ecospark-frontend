import { TUser } from "./user.types";

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type TAuthResponse = {
  user: TUser;
  token: string;
};