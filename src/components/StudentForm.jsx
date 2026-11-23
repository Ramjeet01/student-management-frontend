import { useEffect, useState } from "react";

function StudentForm({addStudent, editingStudent, updateStudent}){

    const[name,setName] = useState("");
    const[classes,setClasses ] = useState("");
    const[section,setSection] = useState("");
    const[subject,setSubject] = useState("");

    useEffect(() => {
        if(editingStudent){
            setName(editingStudent.name);
            setClasses(editingStudent.classes);
            setSection(editingStudent.section);
            setSubject(editingStudent.subject);
        }
    },[editingStudent]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newObj ={
            name,
            classes,
            section,
            subject

        };

        if(editingStudent){
            updateStudent({
                id:editingStudent.id,
                ...newObj
            });
        }else{
            addStudent(newObj);
        }

        

        setName("");
        setClasses("");
        setSection("");
        setSubject("");
    }


    return(
        <form className = "form-box" onSubmit={handleSubmit}>
            <label>Name</label>
            <input 
                type="text" 
                placeholder="Enter Name" 
                value={name} 
                onChange={(event) => setName(event.target.value)}
            />

            <label>Class</label>
            <input 
                type="text"     
                placeholder="Enter Name" 
                value={classes} 
                onChange={(event) => setClasses(event.target.value)}
            />

            <label>Section</label>
            <input 
                type="text" 
                placeholder="Enter Name" 
                value={section} 
                onChange={(event) => setSection(event.target.value)}
            />

            <label>Subject</label>
            <input 
                type="text" 
                placeholder="Enter Name" 
                value={subject} 
                onChange={(event) => setSubject(event.target.value)}
            />

            <button type="submit">{editingStudent ? "Update" : "Add Student"}</button>

        </form>
    );
}
export default StudentForm;