
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Search,
  Pencil,
  Trash2,
  Bell,
  UserRound,
  Plus,
  X
} from "lucide-react";

import StudentForm from "../components/StudentForm";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function StudentPage() {
  const { isAdmin, loading, logout, user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const data = await apiRequest("/api/students");

      if (!Array.isArray(data)) {
        throw new Error("Invalid student data received.");
      }

      setStudents(data);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Open Add Student form
  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
    setError("");
  };

  // Add student
  const addStudent = async (student) => {
    try {
      const savedStudent = await apiRequest("/api/students", {
        method: "POST",
        body: JSON.stringify(student)
      });

      setStudents((prev) => [...prev, savedStudent]);
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to add student.");
    }
  };

  // Update student
  const updateStudent = async (updatedStudent) => {
    try {
      const updated = await apiRequest(
        `/api/students/${updatedStudent.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedStudent)
        }
      );

      setStudents((prev) =>
        prev.map((student) =>
          student.id === updated.id ? updated : student
        )
      );

      setEditingStudent(null);
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to update student.");
    }
  };

  // Edit student
  const editStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setError("");
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/api/students/${id}`, {
        method: "DELETE"
      });

      setStudents((prev) =>
        prev.filter((student) => student.id !== id)
      );

      if (editingStudent?.id === id) {
        closeForm();
      }

      setError("");
    } catch (err) {
      setError(err.message || "Unable to delete student.");
    }
  };

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

  // Authentication loading
  if (loading) {
    return <p>Loading student management...</p>;
  }

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
              placeholder="Search students..."
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
                <span>
                  {isAdmin ? "Administrator" : "User"}
                </span>
              </div>

            </div>
          </div>
        </header>

        {/* STUDENT CONTENT */}
        <div className="dashboard-content courses-page">

          {/* HEADING */}
          <div className="courses-heading">

            <div>
              <h1>Students Management</h1>
              <p>
                Manage all students registered in your institution.
              </p>
            </div>

            {isAdmin && (
              <button
                className="primary-btn"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Student
              </button>
            )}

          </div>

          {/* STUDENT SUMMARY */}
          <div className="courses-summary">
            <Users size={28} />

            <div>
              <span>Total Students</span>
              <h2>{students.length}</h2>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-message">
              {error}

              <button onClick={fetchStudents}>
                Retry
              </button>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {showForm && isAdmin && (
            <div className="course-form-panel">

              <div className="course-form-heading">

                <h2>
                  {editingStudent
                    ? "Edit Student"
                    : "Add New Student"}
                </h2>

                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>

              </div>

              <StudentForm
                addStudent={addStudent}
                updateStudent={updateStudent}
                editingStudent={editingStudent}
              />

              <button
                type="button"
                className="secondary-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

            </div>
          )}

          {/* STUDENT TABLE */}
          <div className="panel courses-table-panel">

            <div className="panel-header courses-toolbar">
              <h3>All Students</h3>
            </div>

            <div className="table-responsive">

              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Subject</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>

                  {loadingStudents ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        Loading students...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>

                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.classes}</td>
                        <td>{student.section}</td>
                        <td>{student.subject}</td>

                        {isAdmin && (
                          <td>
                            <div className="table-actions">

                              <button
                                className="edit-btn"
                                onClick={() => editStudent(student)}
                                title="Edit student"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() => deleteStudent(student.id)}
                                title="Delete student"
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

export default StudentPage;
