import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/employee";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(`Remove ${name} from the system? This cannot be undone.`)
    )
      return;
    setDeletingId(id);
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success(`${name} removed successfully`);
    } catch {
      toast.error("Failed to delete employee", {
        description: "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Users size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              All Employees
            </h2>
            <p className="text-xs text-gray-400">
              {loading
                ? "Loading..."
                : `${employees.length} record${employees.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {loading ? (
          <SkeletonRows />
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={fetchEmployees}
            >
              Retry
            </Button>
          </div>
        ) : employees.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase tracking-wide text-gray-400">
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="text-sm hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {emp.employee_id}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {emp.full_name}
                  </TableCell>
                  <TableCell className="text-gray-500">{emp.email}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-1 rounded-full">
                      {emp.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                      onClick={() => handleDelete(emp.id, emp.full_name)}
                      disabled={deletingId === emp.id}
                    >
                      {deletingId === emp.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-14 flex flex-col items-center text-center text-gray-400">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
        <Users size={22} className="text-gray-300" />
      </div>
      <p className="text-sm font-medium text-gray-500">No employees yet</p>
      <p className="text-xs mt-1 text-gray-400">
        Add your first employee using the form above.
      </p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3 py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-4 bg-gray-100 rounded w-36" />
          <div className="h-4 bg-gray-100 rounded w-44" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
      ))}
    </div>
  );
}
