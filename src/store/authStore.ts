import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { TUser } from "@/types/user.types";

type TAuthStore = {
  user: TUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: TUser, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<TUser>) => void;
};

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        Cookies.set("token", token, { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updatedFields }
            : null,
        }));
      },
    }),
    {
      name: "ecospark-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);