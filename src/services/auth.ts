import { post, get, setAccessToken, setRefreshToken, clearTokens, getRefreshToken } from './api';
import type { LoginRequest, LoginResponse, AdminUser } from '../types/api';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/admin/auth/login', data);
  const loginData = response.data;
  setAccessToken(loginData.accessToken);
  setRefreshToken(loginData.refreshToken);
  return loginData;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    await post('/admin/auth/logout', { refreshToken });
  } catch {
    // proceed even if logout request fails
  }
  clearTokens();
}

export async function getCurrentAdmin(): Promise<AdminUser> {
  const response = await get<AdminUser>('/admin/auth/me');
  return response.data;
}
