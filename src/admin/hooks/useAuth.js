import { useAuthContext } from "../auth/AuthContext";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
    updateUser,
    checkSession,
  } = useAuthContext();

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
    updateUser,
    checkSession,
  };
}

export default useAuth;