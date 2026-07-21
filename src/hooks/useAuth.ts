import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { login as loginService, logout as logoutService, getCurrentAdmin } from '../services/auth';
import { clearTokens } from '../services/api';
import type { LoginRequest, AdminUser } from '../types/api';

export function useCurrentAdmin() {
  return useQuery<AdminUser>({
    queryKey: ['auth', 'admin'],
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 30000,
    enabled: !!localStorage.getItem('accessToken'),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginService(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'admin'], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutService(),
    onSettled: () => {
      clearTokens();
      queryClient.clear();
    },
  });
}
