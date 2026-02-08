import type { GeneralResponse } from "@/types/response";
import api from "./api";
import type { Attendance } from "@/types/attendance";

export const AttendanceService = {
  async find(id: string): Promise<GeneralResponse<Attendance[]>> {
    try {
      const { data } = await api.get(`/attendance/${id}`);

      return {
        success: true,
        message: data.message ?? "Fetch successful!",
        data: data.data as Attendance[],
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to fetch attendance.",
        data: null,
      };
    }
  },

  async clockIn(
    photo: File | null,
  ): Promise<GeneralResponse<Attendance | null>> {
    try {
      const formData = new FormData();
      if (photo) formData.append("photo", photo);

      const { data } = await api.post(`/attendance/clock-in`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: data.message ?? "Clocked in successfully.",
        data: data.data as Attendance,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to clock in.",
        data: null,
      };
    }
  },

  async clockOut(): Promise<GeneralResponse<Attendance | null>> {
    try {
      const { data } = await api.post(`/attendance/clock-out`, {});

      return {
        success: true,
        message: data.message ?? "Clocked out successfully.",
        data: data.data as Attendance,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to clock out.",
        data: null,
      };
    }
  },
};
