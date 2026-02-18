import { useEffect, useState, useMemo } from "react";
import { getAttendance } from "@/services/attendanceService";
import type { Attendance } from "@/types/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Filter } from "lucide-react";

export default function AttendanceList() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Present" | "Absent"
  >("All");
  const [filterDate, setFilterDate] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch {
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filtered = useMemo(() => {
    return attendance.filter((a) => {
      const matchStatus = filterStatus === "All" || a.status === filterStatus;
      const matchDate = !filterDate || a.date === filterDate;
      return matchStatus && matchDate;
    });
  }, [attendance, filterStatus, filterDate]);

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <CalendarDays size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Attendance Records
            </h2>
            {!loading && (
              <p className="text-xs text-gray-400">
                {attendance.length} total ·{" "}
                <span className="text-green-600 font-medium">
                  {presentCount} present
                </span>{" "}
                ·{" "}
                <span className="text-red-500 font-medium">
                  {absentCount} absent
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        {!loading && attendance.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-8 text-xs rounded-md border border-gray-200 px-2.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-400 text-gray-600"
            />
            <Select
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
            >
              <SelectTrigger className="h-8 text-xs w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            {(filterDate || filterStatus !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-gray-400 hover:text-gray-600 px-2"
                onClick={() => {
                  setFilterDate("");
                  setFilterStatus("All");
                }}
              >
                Clear
              </Button>
            )}
          </div>
        )}
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
              onClick={fetchAttendance}
            >
              Retry
            </Button>
          </div>
        ) : attendance.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            No records match your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase tracking-wide text-gray-400">
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((att) => (
                <TableRow
                  key={att.id}
                  className="text-sm hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-800">
                    {att.employee_name}
                  </TableCell>
                  <TableCell className="text-gray-500 tabular-nums">
                    {formatDate(att.date)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={att.status} />
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

function StatusBadge({ status }: { status: string }) {
  const isPresent = status === "Present";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        isPresent
          ? "bg-green-50 text-green-700 border border-green-100"
          : "bg-red-50 text-red-600 border border-red-100"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPresent ? "bg-green-500" : "bg-red-400"}`}
      />
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function EmptyState() {
  return (
    <div className="py-14 flex flex-col items-center text-center text-gray-400">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
        <CalendarDays size={22} className="text-gray-300" />
      </div>
      <p className="text-sm font-medium text-gray-500">
        No attendance records yet
      </p>
      <p className="text-xs mt-1 text-gray-400">
        Mark attendance using the form above.
      </p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3 py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-6 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-36" />
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
