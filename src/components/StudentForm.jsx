
import { useEffect, useState } from "react";

function StudentForm({ addStudent, editingStudent, updateStudent }) {

  const [name, setName] = useState("");
  const [classes, setClasses] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name || "");
      setClasses(editingStudent.classes || "");
      setSection(editingStudent.section || "");
      setSubject(editingStudent.subject || "");
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setName("");
    setClasses("");
    setSection("");
    setSubject("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentData = {
      name,
      classes,
      section,
      subject
    };

    try {
      if (editingStudent) {
        await updateStudent({
          id: editingStudent.id,
          ...studentData
        });
      } else {
        await addStudent(studentData);
      }

      resetForm();
    } catch (error) {
      console.error("Student form submission failed:", error);
    }
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <input
        type="text"
        name="classes"
        placeholder="Class"
        value={classes}
        onChange={(event) => setClasses(event.target.value)}
        required
      />

      <input
        type="text"
        name="section"
        placeholder="Section"
        value={section}
        onChange={(event) => setSection(event.target.value)}
        required
      />

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        required
      />

      <button type="submit" className="primary-btn">
        {editingStudent ? "Update Student" : "Save Student"}
      </button>

    </form>
  );
}

export default StudentForm;
