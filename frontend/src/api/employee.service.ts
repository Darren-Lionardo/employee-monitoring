import type { GeneralResponse } from "@/types/response";
import api from "./api";
import type { Employee } from "@/types/employee";

interface CreateRequest {
  email: string;
  password: string;
  name: string;
  position: string;
}

interface UpdateRequest {
  name: string;
  position: string;
}

export const EmployeeService = {
  async getEmployees(): Promise<GeneralResponse<Employee[]>> {
    try {
      const { data } = await api.get(`/employees`);

      return {
        success: true,
        message: data.message ?? "Fetch successful!",
        data: data.data as Employee[],
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to fetch employees.",
        data: null,
      };
    }
  },

  async createEmployee(req: CreateRequest): Promise<GeneralResponse<Employee>> {
    try {
      const { data } = await api.post(`/employees`, req);

      return {
        success: true,
        message: data.message ?? "Employee created successfully.",
        data: data.data as Employee,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to create employee.",
        data: null,
      };
    }
  },

  async updateEmployee(
    id: string,
    req: UpdateRequest,
  ): Promise<GeneralResponse<Employee>> {
    try {
      const { data } = await api.patch(`/employees/${id}`, req);

      return {
        success: true,
        message: data.message ?? "Employee updated successfully.",
        data: data.data as Employee,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to update employee.",
        data: null,
      };
    }
  },

  async deleteEmployee(id: string): Promise<GeneralResponse<null>> {
    try {
      const { data } = await api.delete(`/employees/${id}`);

      return {
        success: true,
        message: data.message ?? "Employee deleted successfully.",
        data: null,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? "Failed to delete employee.",
        data: null,
      };
    }
  },
};
