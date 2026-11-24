
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  X,
  Bell,
  UserRound
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function CoursesPage() {
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    courseName: "",
    courseCode: "",
    duration: "",
    description: ""
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/api/courses");

      if (!Array.isArray(data)) {
        throw new Error("Invalid course data received.");
      }

      setCourses(data);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
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

  // Form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Open add form
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  // Open edit form
  const handleEdit = (course) => {
    setEditingId(course.id);

    setForm({
      courseName: course.courseName || "",
      courseCode: course.courseCode || "",
      duration: course.duration || "",
      description: course.description || ""
    });

    setShowForm(true);
    setError("");
  };

  // Save or update course
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        const updated = await apiRequest(
          `/api/courses/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form)
          }
        );

        setCourses((prev) =>
          prev.map((course) =>
            course.id === editingId ? updated : course
          )
        );
      } else {
        const saved = await apiRequest(
          "/api/courses",
          {
            method: "POST",
            body: JSON.stringify(form)
          }
        );

        setCourses((prev) => [...prev, saved]);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to save course.");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await apiRequest(`/api/courses/${id}`, {
        method: "DELETE"
      });

      setCourses((prev) =>
        prev.filter((course) => course.id !== id)
      );

      setError("");
    } catch (err) {
      setError(err.message || "Unable to delete course.");
    }
  };

  // Search courses
  const filteredCourses = courses.filter((course) =>
    [
      course.courseName,
      course.courseCode,
      course.duration,
      course.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

          <div className="navbar-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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

        {/* COURSES CONTENT */}
        <div className="dashboard-content courses-page">

          {/* HEADING */}
          <div className="courses-heading">
            <div>
              <h1>Courses Management</h1>
              <p>
                Manage all courses offered by your institution.
              </p>
            </div>

            {isAdmin && (
              <button
                className="primary-btn"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Course
              </button>
            )}
          </div>

          {/* COURSE SUMMARY */}
          <div className="courses-summary">
            <BookOpen size={28} />

            <div>
              <span>Total Courses</span>
              <h2>{courses.length}</h2>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-message">
              {error}

              <button onClick={fetchCourses}>
                Retry
              </button>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {showForm && isAdmin && (
            <div className="course-form-panel">

              <div className="course-form-heading">
                <h2>
                  {editingId !== null
                    ? "Edit Course"
                    : "Add New Course"}
                </h2>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="course-form"
              >
                <input
                  name="courseName"
                  placeholder="Course Name"
                  value={form.courseName}
                  onChange={handleChange}
                  required
                />

                <input
                  name="courseCode"
                  placeholder="Course Code"
                  value={form.courseCode}
                  onChange={handleChange}
                  required
                />

                <input
                  name="duration"
                  placeholder="Duration (e.g. 4 Years)"
                  value={form.duration}
                  onChange={handleChange}
                />

                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />

                <button type="submit" className="primary-btn">
                  {editingId !== null
                    ? "Update Course"
                    : "Save Course"}
                </button>
              </form>
            </div>
          )}

          {/* COURSES TABLE */}
          <div className="panel courses-table-panel">

            <div className="panel-header courses-toolbar">
              <h3>All Courses</h3>
            </div>

            <div className="table-responsive">

              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Duration</th>
                    <th>Description</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        Loading courses...
                      </td>
                    </tr>
                  ) : filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.courseName}</td>
                        <td>{course.courseCode}</td>
                        <td>{course.duration || "—"}</td>
                        <td>{course.description || "—"}</td>

                        {isAdmin && (
                          <td>
                            <div className="table-actions">

                              <button
                                className="edit-btn"
                                onClick={() => handleEdit(course)}
                                title="Edit course"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(course.id)}
                                title="Delete course"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>
          </div>

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

export default CoursesPage;
