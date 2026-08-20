import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, setAuth, updateUser, logout: clearAuthStore } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(useAuthStore.getState().refreshToken),
    onSettled: () => {
      clearAuthStore();
      router.push("/login");
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: !!accessToken && isAuthenticated,
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      updateUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data, updateUser]);

  return {
    user: currentUserQuery.data || user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}
