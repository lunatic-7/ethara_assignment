import api from "./api";
import type { Attendance } from "@/types/attendance";

export const markAttendance = async (data: Partial<Attendance>) => {
  const res = await api.post("attendance/mark/", data);
  return res.data;
};

export const getAttendance = async (): Promise<Attendance[]> => {
  const res = await api.get("attendance/");
  return res.data;
};
