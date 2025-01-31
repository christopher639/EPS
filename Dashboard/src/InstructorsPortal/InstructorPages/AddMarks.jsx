import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructorSideBar from "../../components/InstuctorSideBar";
import UserAccount from "../../components/UserAccount";

const AddMarks = () => {
  const [formData, setFormData] = useState({
    year: "",
    term: "",
    stream: "",
    class: "",
    category: "",
    code: "",
    students: [{ regno: "", score: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData };

    if (name === "students") {
      const index = e.target.dataset.index;
      updatedData[name][index][e.target.dataset.field] = value;
    } else {
      updatedData[name] = value;
    }
    setFormData(updatedData);
  };

  const handleAddStudent = () => {
    setFormData({
      ...formData,
      students: [...formData.students, { regno: "", score: "" }],
    });
  };

  const handleRemoveStudent = (index) => {
    const updatedStudents = formData.students.filter((_, i) => i !== index);
    setFormData({ ...formData, students: updatedStudents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setFormData({
          year: "",
          term: "",
          stream: "",
          class: "",
          category: "",
          code: "",
          students: [{ regno: "", score: "" }],
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSideBar />
      <div className="flex-1 p-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-gray-800">Post Marks</h1>
          <UserAccount />
        </div>
        <div className="bg-white rounded-lg shadow-md p-3">
          <h2 className="text-xl font-semibold text-gray-700 ">Set Your Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { label: "Year", name: "year", type: "text" },
                { label: "Term", name: "term", type: "text" },
                { label: "Stream", name: "stream", type: "text" },
                { label: "Class", name: "class", type: "text" },
                { label: "Category", name: "category", type: "text" },
                { label: "Subject Code", name: "code", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className=" overflow-y-auto max-h-[45vh]">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Students Marks</h3>
              <div className="space-y-3 ">
                {formData.students.map((student, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-center">
                    <input
                      type="text"
                      name="regno"
                      data-index={index}
                      data-field="regno"
                      value={student.regno}
                      onChange={handleChange}
                      placeholder="Registration Number"
                      className="w-full  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      name="score"
                      data-index={index}
                      data-field="score"
                      value={student.score}
                      onChange={handleChange}
                      placeholder="Score"
                      min="0"
                      max="100"
                      className="w-full  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(index)}
                      className="w-full md:w-auto px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
            </div>
           <div className="flex  justify-between">
           <button
                type="button"
                onClick={handleAddStudent}
                className=" w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                Add More Students
              </button>
            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
           </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMarks;