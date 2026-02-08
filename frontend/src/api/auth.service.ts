import type { GeneralResponse } from "@/types/response";
import api from "./api";
import type { User } from "@/types/user";

export const AuthService = {
  async login(
    email: string,
    password: string,
  ): Promise<GeneralResponse<User | null>> {
    try {
      const { data } = await api.post(`/auth/login`, {
        email,
        password,
      });

      return {
        success: true,
        message: data.data.message ?? "Login successful!",
        data: data.data as User,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Invalid email or password.",
        data: null,
      };
    }
  },

  async logout(): Promise<GeneralResponse<User | null>> {
    try {
      const { data } = await api.post(`/auth/logout`, {});

      return {
        success: true,
        message: data.data.message ?? "Logout successful!",
        data: data.data as User,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Logout failed.",
        data: null,
      };
    }
  },

  async profile(): Promise<GeneralResponse<User | null>> {
    try {
      const { data } = await api.get(`/auth/profile`);

      return {
        success: true,
        message: data.data.message ?? "Profile fetched successfully!",
        data: data.data as User,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Profile fetch failed.",
        data: null,
      };
    }
  },
};
