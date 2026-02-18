import { useState } from "react";
import { createEmployee } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/types/employee";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  refresh: () => void;
}

const EMPTY_FORM: Partial<Employee> = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

export default function EmployeeForm({ refresh }: Props) {
  const [form, setForm] = useState<Partial<Employee>>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const set =
    (field: keyof Employee) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = () => {
    const errs: Partial<Record<keyof Employee, string>> = {};
    if (!form.employee_id?.trim()) errs.employee_id = "Employee ID is required";
    if (!form.full_name?.trim()) errs.full_name = "Full name is required";
    if (!form.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.department?.trim()) errs.department = "Department is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await createEmployee(form);
      setForm(EMPTY_FORM);
      refresh();
      toast.success("Employee added successfully!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.employee_id?.[0] ||
        err?.message ||
        "Something went wrong";
      toast.error("Failed to add employee", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
          <UserPlus size={16} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Add New Employee
          </h2>
          <p className="text-xs text-gray-400">
            Fill in the details below to register an employee
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Employee ID" error={errors.employee_id}>
            <Input
              placeholder="e.g. EMP001"
              value={form.employee_id ?? ""}
              onChange={set("employee_id")}
              className={
                errors.employee_id
                  ? "border-red-400 focus-visible:ring-red-300"
                  : ""
              }
            />
          </Field>

          <Field label="Full Name" error={errors.full_name}>
            <Input
              placeholder="e.g. Jane Smith"
              value={form.full_name ?? ""}
              onChange={set("full_name")}
              className={
                errors.full_name
                  ? "border-red-400 focus-visible:ring-red-300"
                  : ""
              }
            />
          </Field>

          <Field label="Email Address" error={errors.email}>
            <Input
              type="email"
              placeholder="e.g. jane@company.com"
              value={form.email ?? ""}
              onChange={set("email")}
              className={
                errors.email ? "border-red-400 focus-visible:ring-red-300" : ""
              }
            />
          </Field>

          <Field label="Department" error={errors.department}>
            <Input
              placeholder="e.g. Engineering"
              value={form.department ?? ""}
              onChange={set("department")}
              className={
                errors.department
                  ? "border-red-400 focus-visible:ring-red-300"
                  : ""
              }
            />
          </Field>
        </div>

        {/* Server error */}

        <div className="mt-5 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus size={14} className="mr-2" />
                Add Employee
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
