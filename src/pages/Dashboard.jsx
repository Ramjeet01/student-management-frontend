
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Users,
  BookOpen,
  UserRound,
  CalendarCheck,
  Search,
  Bell,
  Plus,
  ArrowRight,
  Pencil,
  Trash2,
  UserPlus,
  Megaphone,
  FileText,
  ChartNoAxesColumn,
  GraduationCap
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const announcements = [
  {
    title: "Mid Semester Exams",
    date: "2 May, 2025",
    description: "Mid semester exams will begin from 15th May 2025.",
    color: "blue"
  },
  {
    title: "Workshop on AI/ML",
    date: "29 Apr, 2025",
    description: "A 3-day workshop on AI/ML is scheduled from 10th May.",
    color: "green"
  },
  {
    title: "College Holiday",
    date: "25 Apr, 2025",
    description: "College will remain closed on 1st May.",
    color: "orange"
  }
];

function Dashboard() {
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Student data
  const [students, setStudents] = useState([]);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses:0
  });

  // Loading states
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Error states
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch student records
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const data = await apiRequest("/api/students");

      if (!Array.isArray(data)) {
        throw new Error("Invalid student data received from server.");
      }

      setStudents(data);
      setError("");

    } catch (err) {
      setError(err.message || "Unable to load students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch dashboard statistics from Spring Boot
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);

      const data = await apiRequest("/api/dashboard/stats");

      if (
        !data ||
        typeof data.totalStudents !== "number" || typeof data.totalCourses !== "number"
      ) {
        throw new Error("Invalid dashboard statistics received.");
      }

      setStats(data);
      setStatsError("");

    } catch (err) {
      setStatsError(
        err.message || "Unable to load dashboard statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // Load both APIs
  useEffect(() => {
    fetchStudents();
    fetchDashboardStats();
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Admin name
  const adminName =
    user?.username ||
    user?.name ||
    "Admin User";

  // Search students
  const filteredStudents = students.filter((student) =>
    [
      student.name,
      student.classes,
      student.section,
      student.subject
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Display maximum five students
  const displayedStudents = filteredStudents.slice(0, 5);

  // Dashboard statistics
  const dashboardStats = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      loading: loadingStats,
      icon: BookOpen,
      color: "green",
      link: "/courses",
      linkText: "View all courses"
    },,
    {
      title: "Total Courses",
      value: "—",
      icon: BookOpen,
      color: "green",
      link: "/courses",
      linkText: "View all courses"
    },
    {
      title: "Total Faculty",
      value: "—",
      icon: UserRound,
      color: "purple",
      link: "/faculty",
      linkText: "View all faculty"
    },
    {
      title: "Today's Attendance",
      value: "—",
      icon: CalendarCheck,
      color: "orange",
      link: "/attendance",
      linkText: "View attendance"
    }
  ];

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* NAVBAR */}
        <header className="dashboard-navbar">

          <button className="mobile-menu" aria-label="Menu">
            ☰
          </button>

          {/* Search */}
          <div className="navbar-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Profile */}
          <div className="navbar-right">

            <button
              className="notification-btn"
              aria-label="Notifications"
            >
              <Bell size={23} />
              <span className="notification-count">3</span>
            </button>

            <div className="admin-profile">

              <div className="admin-avatar">
                <UserRound size={25} />
              </div>

              <div>
                <h4>{adminName}</h4>
                <span>{isAdmin ? "Administrator" : "User"}</span>
              </div>

            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-content">

          {/* HEADING */}
          <div className="dashboard-heading">

            <div>
              <h1>Dashboard</h1>

              <p>
                Welcome back, <strong>{adminName}!</strong>
                Here's what's happening in your system.
              </p>
            </div>

            <div className="heading-decoration">
              <GraduationCap size={75} />
              <BookOpen size={42} />
            </div>

          </div>

          {/* STATISTICS */}
          <section className="stats-grid">

            {dashboardStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div className="stat-card" key={stat.title}>

                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={31} />
                  </div>

                  <div className="stat-info">
                    <p>{stat.title}</p>

                    <h2>
                      {stat.loading ? "..." : stat.value}
                    </h2>
                  </div>

                  <Link to={stat.link} className="stat-link">
                    {stat.linkText}
                    <ArrowRight size={16} />
                  </Link>

                  {stat.title === "Total Students" && statsError && (
                    <p className="error-message">
                      Statistics unavailable
                    </p>
                  )}

                </div>
              );
            })}

          </section>

          {/* MAIN GRID */}
          <section className="dashboard-grid">

            {/* STUDENT TABLE */}
            <div className="panel students-panel">

              <div className="panel-header">
                <h3>Recent Students</h3>

                {isAdmin && (
                  <Link to="/students" className="primary-btn">
                    <Plus size={19} />
                    Add Student
                  </Link>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="error-message">
                  {error}

                  <button onClick={fetchStudents}>
                    Retry
                  </button>
                </div>
              )}

              {/* Student Table */}
              <div className="table-responsive">

                <table className="dashboard-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Section</th>
                      <th>Subject</th>

                      {isAdmin && <th>Action</th>}
                    </tr>
                  </thead>

                  <tbody>

                    {loadingStudents ? (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5}>
                          Loading students...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5}>
                          Unable to load student records.
                        </td>
                      </tr>
                    ) : displayedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5}>
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      displayedStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.classes}</td>
                          <td>{student.section}</td>
                          <td>{student.subject}</td>

                          {isAdmin && (
                            <td>
                              <div className="table-actions">

                                <Link
                                  to="/students"
                                  className="edit-btn"
                                  title="Edit student"
                                >
                                  <Pencil size={16} />
                                </Link>

                                <Link
                                  to="/students"
                                  className="delete-btn"
                                  title="Delete student"
                                >
                                  <Trash2 size={16} />
                                </Link>

                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}

                  </tbody>
                </table>
              </div>

              {/* VIEW ALL */}
              <Link to="/students" className="view-all-link">
                View all students
                <ArrowRight size={17} />
              </Link>

            </div>

            {/* RIGHT SECTION */}
            <div className="dashboard-right">

              {/* ANNOUNCEMENTS */}
              <div className="panel announcement-panel">

                <div className="panel-header">
                  <h3>
                    <Megaphone size={19} />
                    Announcements
                  </h3>

                  <span>View all</span>
                </div>

                <div className="announcement-list">

                  {announcements.map((item) => (
                    <div
                      className="announcement-item"
                      key={item.title}
                    >
                      <div
                        className={`announcement-dot ${item.color}`}
                      />

                      <div className="announcement-content">

                        <div className="announcement-title">
                          <strong>{item.title}</strong>
                          <span>{item.date}</span>
                        </div>

                        <p>{item.description}</p>

                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="panel quick-actions-panel">

                <div className="panel-header">
                  <h3>Quick Actions</h3>
                </div>

                <div className="quick-actions-grid">

                  <Link to="/students" className="quick-action">
                    <UserPlus className="blue-text" size={27} />
                    <span>Add Student</span>
                  </Link>

                  <Link to="/courses" className="quick-action">
                    <BookOpen className="green-text" size={27} />
                    <span>Add Course</span>
                  </Link>

                  <Link to="/faculty" className="quick-action">
                    <UserRound className="purple-text" size={27} />
                    <span>Add Faculty</span>
                  </Link>

                  <Link to="/attendance" className="quick-action">
                    <CalendarCheck className="orange-text" size={27} />
                    <span>Mark Attendance</span>
                  </Link>

                  <Link to="/exams" className="quick-action">
                    <FileText className="blue-text" size={27} />
                    <span>Add Exam</span>
                  </Link>

                  <Link to="/reports" className="quick-action">
                    <ChartNoAxesColumn className="red-text" size={27} />
                    <span>Generate Report</span>
                  </Link>

                </div>
              </div>

            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>
            © 2026 Student Management System. All rights reserved.
          </span>

          <span>
            Developed with ❤️ by SMS Team
          </span>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
