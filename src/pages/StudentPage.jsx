
import { useEffect, useState } from "react";
import StudentForm from "../components/StudentForm";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function StudentPage() {

    const { isAdmin, loading } = useAuth();

    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [error, setError] = useState("");

    // GET ALL STUDENTS
    const fetchStudents = async () => {
        try {
            const data = await apiRequest("/api/students");
            setStudents(data);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ADD STUDENT
    const addStudent = async (student) => {
        try {
            const savedStudent = await apiRequest("/api/students", {
                method: "POST",
                body: JSON.stringify(student),
            });

            setStudents((prev) => [...prev, savedStudent]);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    // UPDATE STUDENT
    const updateStudent = async (updatedStudent) => {
        try {
            const updated = await apiRequest(
                `/api/students/${updatedStudent.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(updatedStudent),
                }
            );

            setStudents((prev) =>
                prev.map((student) =>
                    student.id === updated.id ? updated : student
                )
            );

            setEditingStudent(null);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    // EDIT STUDENT
    const editStudent = (student) => {
        setEditingStudent(student);
    };

    // DELETE STUDENT
    const deleteStudent = async (id) => {
        try {
            await apiRequest(`/api/students/${id}`, {
                method: "DELETE",
            });

            setStudents((prev) =>
                prev.filter((student) => student.id !== id)
            );

            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    // Wait until authentication/profile loading finishes
    if (loading) {
        return <p>Loading student management...</p>;
    }

    return (
        <div>

            <h1>Student Management Table</h1>

            {/* Only ADMIN can see the form */}
            {isAdmin && (
                <StudentForm
                    addStudent={addStudent}
                    updateStudent={updateStudent}
                    editingStudent={editingStudent}
                />
            )}

            <h2>Student Table</h2>

            {error && (
                <p className="error-message">{error}</p>
            )}

            <div className="table-container">
                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Subject</th>

                            {/* Only ADMIN sees action columns */}
                            {isAdmin && (
                                <>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </>
                            )}
                        </tr>
                    </thead>

                    <tbody>

                        {students.map((student) => (

                            <tr key={student.id}>

                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.classes}</td>
                                <td>{student.section}</td>
                                <td>{student.subject}</td>

                                {isAdmin && (
                                    <>
                                        <td>
                                            <button
                                                onClick={() => editStudent(student)}
                                            >
                                                Edit
                                            </button>
                                        </td>

                                        <td>
                                            <button
                                                onClick={() => deleteStudent(student.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}

                            </tr>

                        ))}

                        {students.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 5}>
                                    No students found.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default StudentPage;
