import api from "./api";
import type { Employee } from "@/types/employee";

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get("employees/");
  return res.data;
};

export const createEmployee = async (data: Partial<Employee>) => {
  const res = await api.post("employees/create/", data);
  return res.data;
};

export const deleteEmployee = async (id: number) => {
  await api.delete(`employees/delete/${id}/`);
};
