
import React from "react";
import { GraduationCap } from "lucide-react";

function AuthSidebar() {
  return (
    <aside className="sidebar auth-sidebar">
      <div className="sidebar-logo">
        <GraduationCap size={48} strokeWidth={2.5} />

        <div className="logo-text">
          <h2>SMS</h2>
          <span>Student Management System</span>
        </div>
      </div>
    </aside>
  );
}

export default AuthSidebar;
