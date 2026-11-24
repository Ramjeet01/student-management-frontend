
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardCheck,
  Search,
  Pencil,
  Trash2,
  Bell,
  UserRound,
  Plus,
  X
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function AttendancePage() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    attendanceDate: new Date().toISOString().split("T")[0],
    status: "Present",
    remarks: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [attendanceData, studentData] = await Promise.all([
        apiRequest("/api/attendance"),
        apiRequest("/api/students")
      ]);

      setAttendance(attendanceData || []);
      setStudents(studentData || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      alert("Unable to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      attendanceDate: new Date().toISOString().split("T")[0],
      status: "Present",
      remarks: ""
    });

    setEditingAttendance(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        ...formData,
        studentId: Number(formData.studentId)
      };

      if (editingAttendance) {
        await apiRequest(
          `/api/attendance/${editingAttendance.id}`,
          {
            method: "PUT",
            body: JSON.stringify(data)
          }
        );

        alert("Attendance updated successfully.");
      } else {
        await apiRequest("/api/attendance", {
          method: "POST",
          body: JSON.stringify(data)
        });

        alert("Attendance added successfully.");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Attendance save failed:", error);
      alert(error.message || "Unable to save attendance.");
    }
  };

  const handleEdit = (record) => {
    setEditingAttendance(record);

    setFormData({
      studentId: String(record.studentId),
      attendanceDate: record.attendanceDate,
      status: record.status,
      remarks: record.remarks || ""
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      await apiRequest(`/api/attendance/${id}`, {
        method: "DELETE"
      });

      alert("Attendance deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Attendance deletion failed:", error);
      alert(error.message || "Unable to delete attendance.");
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) => item.id === studentId
    );

    return student ? student.name : `Student #${studentId}`;
  };

  const filteredAttendance = attendance.filter((record) => {
    const studentName = getStudentName(record.studentId).toLowerCase();

    return (
      studentName.includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.attendanceDate.includes(searchTerm)
    );
  });

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "Late"
  ).length;

  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={handleLogout} />

      <main className="dashboard-main">

        <header className="dashboard-navbar">
          <div>
            <h2>Attendance Management</h2>
            <p>Manage student attendance records</p>
          </div>

          <div className="navbar-actions">
            <Bell size={20} />
            <UserRound size={22} />
          </div>
        </header>

        <div className="dashboard-content courses-page">

          <div className="course-summary">
            <div>
              <h2>Attendance Records</h2>
              <p>Track and manage student attendance</p>
            </div>

            {isAdmin && (
              <button
                className="primary-btn"
                onClick={() => {
                  setEditingAttendance(null);
                  setFormData({
                    studentId: "",
                    attendanceDate: new Date().toISOString().split("T")[0],
                    status: "Present",
                    remarks: ""
                  });
                  setShowForm(!showForm);
                }}
              >
                <Plus size={18} />
                Mark Attendance
              </button>
            )}
          </div>

          <div className="attendance-stats">

            <div className="attendance-stat-card">
              <h3>Total Records</h3>
              <h2>{attendance.length}</h2>
            </div>

            <div className="attendance-stat-card">
              <h3>Present</h3>
              <h2>{presentCount}</h2>
            </div>

            <div className="attendance-stat-card">
              <h3>Absent</h3>
              <h2>{absentCount}</h2>
            </div>

            <div className="attendance-stat-card">
              <h3>Late</h3>
              <h2>{lateCount}</h2>
            </div>

          </div>

          {showForm && isAdmin && (
            <div className="course-form-panel">

              <div className="course-form-heading">
                <h3>
                  {editingAttendance
                    ? "Edit Attendance"
                    : "Mark Student Attendance"}
                </h3>

                <button
                  type="button"
                  onClick={resetForm}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="course-form" onSubmit={handleSubmit}>

                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} (ID: {student.id})
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="attendanceDate"
                  value={formData.attendanceDate}
                  onChange={handleInputChange}
                  required
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>

                <input
                  type="text"
                  name="remarks"
                  placeholder="Remarks (Optional)"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />

                <button type="submit" className="primary-btn">
                  {editingAttendance ? "Update Attendance" : "Save Attendance"}
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </form>
            </div>
          )}

          <div className="course-table-section">

            <div className="course-table-heading">
              <h3>Attendance List</h3>

              <div className="search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search student, date or status..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        Loading attendance...
                      </td>
                    </tr>
                  ) : filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{getStudentName(record.studentId)}</td>
                        <td>{record.attendanceDate}</td>
                        <td>{record.status}</td>
                        <td>{record.remarks || "—"}</td>

                        {isAdmin && (
                          <td>
                            <button
                              onClick={() => handleEdit(record)}
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(record.id)}
                              title="Delete"
                            >
                              <Trash2 size={17} />
                            </button>
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

        <footer className="dashboard-footer">
          Student Management System
        </footer>

      </main>

    </div>
  );
}

export default AttendancePage;
