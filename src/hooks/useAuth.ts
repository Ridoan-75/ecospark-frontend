import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/constants";

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout, updateUser } =
    useAuthStore();

  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const isMember = user?.role === USER_ROLE.MEMBER;

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isMember,
    setAuth,
    logout,
    updateUser,
  };
};