import { useEffect, useState } from "react";
import { markAttendance } from "@/services/attendanceService";
import { getEmployees } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/employee";
import type { Attendance } from "@/types/attendance";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onSuccess?: () => void;
}

export default function AttendanceForm({ onSuccess }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [data, setData] = useState<Partial<Attendance>>({
    employee: 0,
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });
  const [errors, setErrors] = useState<{ employee?: string; date?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .finally(() => setLoadingEmployees(false));
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!data.employee) errs.employee = "Please select an employee";
    if (!data.date) errs.date = "Please select a date";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await markAttendance(data);
      toast.success("Attendance marked successfully!");
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        "Failed to mark attendance";
      toast.error("Could not mark attendance", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
          <CalendarCheck size={16} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Mark Attendance
          </h2>
          <p className="text-xs text-gray-400">
            Record attendance status for an employee
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Employee Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600">
              Employee
            </Label>
            <Select
              disabled={loadingEmployees}
              value={data.employee ? String(data.employee) : ""}
              onValueChange={(val) => {
                setData((prev) => ({ ...prev, employee: Number(val) }));
                setErrors((prev) => ({ ...prev, employee: "" }));
              }}
            >
              <SelectTrigger
                className={errors.employee ? "border-red-400" : ""}
              >
                <SelectValue
                  placeholder={
                    loadingEmployees ? "Loading..." : "Select employee"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.full_name}
                    <span className="ml-2 text-xs text-gray-400">
                      {e.department}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee && (
              <p className="text-xs text-red-500">{errors.employee}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600">Date</Label>
            <input
              type="date"
              value={data.date ?? ""}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setData((prev) => ({ ...prev, date: e.target.value }));
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
              className={`flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                errors.date ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600">Status</Label>
            <Select
              value={data.status ?? "Present"}
              onValueChange={(val) =>
                setData((prev) => ({
                  ...prev,
                  status: val as Attendance["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Present
                  </span>
                </SelectItem>
                <SelectItem value="Absent">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    Absent
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={submit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CalendarCheck size={14} className="mr-2" />
                Mark Attendance
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
