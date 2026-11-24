import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Search,
  Pencil,
  Trash2,
  Bell,
  Plus,
  X
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function FacultyPage() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [formData, setFormData] = useState({
    facultyName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    qualification: ""
  });

  const fetchFaculty = async () => {
    try {
      const data = await apiRequest("/api/faculty");
      setFaculty(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      alert("Unable to load faculty.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openAddForm = () => {
    setEditingFaculty(null);
    setFormData({
      facultyName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      qualification: ""
    });
    setShowForm(true);
  };

  const handleEdit = (member) => {
    setEditingFaculty(member);
    setFormData({
      facultyName: member.facultyName || "",
      email: member.email || "",
      phone: member.phone || "",
      department: member.department || "",
      designation: member.designation || "",
      qualification: member.qualification || ""
    });
    setShowForm(true);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingFaculty) {
        const updated = await apiRequest(
          `/api/faculty/${editingFaculty.id}`,
          {
            method: "PUT",
            body: JSON.stringify(formData)
          }
        );

        setFaculty((previous) =>
          previous.map((item) =>
            item.id === editingFaculty.id ? updated : item
          )
        );
      } else {
        const saved = await apiRequest("/api/faculty", {
          method: "POST",
          body: JSON.stringify(formData)
        });

        setFaculty((previous) => [...previous, saved]);
      }

      setShowForm(false);
      setEditingFaculty(null);
    } catch (error) {
      console.error("Faculty save failed:", error);
      alert("Unable to save faculty. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    try {
      await apiRequest(`/api/faculty/${id}`, {
        method: "DELETE"
      });

      setFaculty((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Faculty delete failed:", error);
      alert("Unable to delete faculty.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  const filteredFaculty = faculty.filter((member) =>
    [
      member.facultyName,
      member.email,
      member.department,
      member.designation
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="dashboard-main">

        <header className="dashboard-navbar">
          <div>
            <h2>Faculty Management</h2>
            <p>Manage your institution's faculty members</p>
          </div>

          <div className="navbar-user">
            <Bell size={20} />
            <UserRound size={25} />
            <span>{user?.username || user?.name || "User"}</span>
          </div>
        </header>

        <div className="dashboard-content courses-page">

          <div className="courses-heading">
            <div>
              <h1>Faculty</h1>
              <p>Manage faculty information and records.</p>
            </div>

            {isAdmin && (
              <button className="primary-btn" onClick={openAddForm}>
                <Plus size={18} />
                Add Faculty
              </button>
            )}
          </div>

          <div className="courses-summary">
            <UserRound size={30} />
            <div>
              <span>Total Faculty</span>
              <h2>{faculty.length}</h2>
            </div>
          </div>

          {showForm && isAdmin && (
            <div className="course-form-panel">

              <div className="course-form-heading">
                <h2>
                  {editingFaculty ? "Edit Faculty" : "Add New Faculty"}
                </h2>

                <button onClick={closeForm}>
                  <X size={20} />
                </button>
              </div>

              <form className="course-form" onSubmit={handleSubmit}>

                <input
                  name="facultyName"
                  placeholder="Faculty Name"
                  value={formData.facultyName}
                  onChange={handleChange}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <input
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />

                <input
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />

                <input
                  name="qualification"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />

                <button type="submit" className="primary-btn">
                  {editingFaculty ? "Update Faculty" : "Save Faculty"}
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

              </form>
            </div>
          )}

          <div className="courses-table-panel">

            <div className="courses-toolbar">
              <h2>Faculty List</h2>

              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Faculty Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Qualification</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7}>
                        Loading faculty...
                      </td>
                    </tr>
                  ) : filteredFaculty.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7}>
                        No faculty records found.
                      </td>
                    </tr>
                  ) : (
                    filteredFaculty.map((member) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.facultyName}</td>
                        <td>{member.email}</td>
                        <td>{member.phone || "—"}</td>
                        <td>{member.department || "—"}</td>
                        <td>{member.designation || "—"}</td>
                        <td>{member.qualification || "—"}</td>

                        {isAdmin && (
                          <td>
                            <button
                              onClick={() => handleEdit(member)}
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(member.id)}
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
          © 2026 Student Management System. All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default FacultyPage;