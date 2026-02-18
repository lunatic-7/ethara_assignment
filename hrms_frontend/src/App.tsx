import './App.css'
import { useState, useCallback } from "react";
import EmployeeForm from "./components/employees/EmployeeForm";
import EmployeeList from "./components/employees/EmployeeList";
import AttendanceForm from "./components/attendance/AttendanceForm";
import AttendanceList from "./components/attendance/AttendanceList";
import { Users, CalendarCheck, LayoutDashboard } from "lucide-react";
import { Toaster } from "sonner";

type Tab = "employees" | "attendance";

export default function App() {
  const [tab, setTab] = useState<Tab>("employees");
  const [employeeRefreshKey, setEmployeeRefreshKey] = useState(0);
  const [attendanceRefreshKey, setAttendanceRefreshKey] = useState(0);

  const refreshEmployees = useCallback(() => setEmployeeRefreshKey((k) => k + 1), []);
  const refreshAttendance = useCallback(() => setAttendanceRefreshKey((k) => k + 1), []);

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans">
      <Toaster position="top-right" richColors />
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 bg-[#0F1623] text-white flex flex-col shrink-0">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <LayoutDashboard size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm tracking-wide">HRMS Lite</p>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <NavItem
              icon={<Users size={16} />}
              label="Employees"
              active={tab === "employees"}
              onClick={() => setTab("employees")}
            />
            <NavItem
              icon={<CalendarCheck size={16} />}
              label="Attendance"
              active={tab === "attendance"}
              onClick={() => setTab("attendance")}
            />
          </nav>

          <div className="px-6 py-4 border-t border-white/10">
            <p className="text-[11px] text-white/30 tracking-wide">v1.0.0 · Single Admin</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {tab === "employees" ? "Employee Management" : "Attendance Tracking"}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {tab === "employees"
                  ? "Add, view, and manage employee records"
                  : "Mark and review daily attendance"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              A
            </div>
          </header>

          {/* Page Content */}
          <div className="px-8 py-6 max-w-5xl">
            {tab === "employees" && (
              <div className="space-y-6">
                <EmployeeForm refresh={refreshEmployees} />
                <EmployeeList key={employeeRefreshKey} />
              </div>
            )}
            {tab === "attendance" && (
              <div className="space-y-6">
                <AttendanceForm onSuccess={refreshAttendance} />
                <AttendanceList key={attendanceRefreshKey} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-indigo-500/20 text-indigo-300"
          : "text-white/50 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      <span className={active ? "text-indigo-400" : ""}>{icon}</span>
      {label}
    </button>
  );
}