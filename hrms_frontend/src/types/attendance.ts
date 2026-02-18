export interface Attendance {
  id: number;
  employee: number;
  employee_name: string;
  date: string;
  status: "Present" | "Absent";
}
