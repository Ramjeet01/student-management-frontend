
import { useEffect, useState } from "react";

function StudentForm({ addStudent, editingStudent, updateStudent }) {

  const [name, setName] = useState("");
  const [classes, setClasses] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [errors, setErrors] = useState({});

  const allowedClasses = ["B.Tech", "BCA", "B.Sc", "BA"];
  const allowedSections = ["A", "B", "C", "D"];
  const allowedSubjects = [
    "IIOT",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Data Science",
    "Computer Networks"
  ];

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name || "");
      setClasses(editingStudent.classes || "");
      setSection(editingStudent.section || "");
      setSubject(editingStudent.subject || "");
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setName("");
    setClasses("");
    setSection("");
    setSubject("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Student name is required";
    }

    if (!allowedClasses.includes(classes.trim())) {
      newErrors.classes = "Class must be B.Tech, BCA, B.Sc, or BA";
    }

    if (!allowedSections.includes(section.trim())) {
      newErrors.section = "Section must be A, B, C, or D";
    }

    if (!allowedSubjects.includes(subject.trim())) {
      newErrors.subject = "IIOT|Deep Learning|Machine Learning|Artificial Intelligence|Cloud Computing|Data Science|Computer Networks";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const studentData = {
      name: name.trim(),
      classes: classes.trim(),
      section: section.trim(),
      subject: subject.trim()
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
        onChange={(event) => {
          setName(event.target.value);
          setErrors(prev => ({ ...prev, name: "" }));
        }}
        required
      />
      {errors.name && <p className="error-message">{errors.name}</p>}

      <input
        type="text"
        name="classes"
        placeholder="Class (B.Tech, BCA, B.Sc, BA)"
        value={classes}
        onChange={(event) => {
          setClasses(event.target.value);
          setErrors(prev => ({ ...prev, classes: "" }));
        }}
        required
      />
      {errors.classes && <p className="error-message">{errors.classes}</p>}

      <input
        type="text"
        name="section"
        placeholder="Section (A, B, C, D)"
        value={section}
        onChange={(event) => {
          setSection(event.target.value);
          setErrors(prev => ({ ...prev, section: "" }));
        }}
        required
      />
      {errors.section && <p className="error-message">{errors.section}</p>}

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={subject}
        onChange={(event) => {
          setSubject(event.target.value);
          setErrors(prev => ({ ...prev, subject: "" }));
        }}
        required
      />
      {errors.subject && <p className="error-message">{errors.subject}</p>}

      <button type="submit" className="primary-btn">
        {editingStudent ? "Update Student" : "Save Student"}
      </button>

    </form>
  );
}

export default StudentForm;
