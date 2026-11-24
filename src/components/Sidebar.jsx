
import React from "react";
import { NavLink } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  UserRound,
  CalendarCheck,
  FileText,
  ChartNoAxesColumn,
  IndianRupee,
  PieChart,
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Faculty", path: "/faculty", icon: UserRound },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck },
  { name: "Exams", path: "/exams", icon: FileText },
  { name: "Results", path: "/results", icon: ChartNoAxesColumn },
  { name: "Fees", path: "/fees", icon: IndianRupee },
  { name: "Reports", path: "/reports", icon: PieChart },
  { name: "Settings", path: "/settings", icon: Settings }
];

function Sidebar({ onLogout, collapsed = false }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>

      <div className="sidebar-logo">
        <GraduationCap size={43} strokeWidth={2.5} />

        {!collapsed && (
          <div className="logo-text">
            <h2>SMS</h2>
            <span>Student Management System</span>
          </div>
        )}
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.name : ""}
            >
              <Icon size={23} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={onLogout}
        title={collapsed ? "Logout" : ""}
      >
        <LogOut size={23} />
        {!collapsed && <span>Logout</span>}
      </button>

    </aside>
  );
}

export default Sidebar;
