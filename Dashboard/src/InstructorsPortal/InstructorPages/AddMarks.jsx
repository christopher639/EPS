import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructorSideBar from "../../components/InstuctorSideBar";
import UserAccount from "../../components/UserAccount";
import axios from "axios";

const AddMarks = () => {
  const [loading, setLoading] = useState(false);
  const [clases, setClases] = useState([]);
  const [streams, setStreams] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [commonData, setCommonData] = useState({
    year: "",
    term: "",
    stream: "",
    class: "",
    category: "",
    code: "",
  });

  const [marks, setMarks] = useState([{ regno: "", score: "" }]);
  const lastStudentRef = useRef(null);

  // Year options
  const yearOptions = [
    { value: "", label: "Select Year" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];

  // Term options
  const termOptions = [
    { value: "", label: "Select Term" },
    { value: "Term-1", label: "Term 1" },
    { value: "Term-2", label: "Term 2" },
    { value: "Term-3", label: "Term 3" },
  ];

  // Category options
  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "Opener", label: "Opener" },
    { value: "Mid-Term", label: "Mid-Term" },
    { value: "Final", label: "Final" },
  ];

  const handleCommonChange = (e) => {
    setCommonData({ ...commonData, [e.target.name]: e.target.value });
  };

  const handleMarksChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMarks = [...marks];
    updatedMarks[index][name] = value;
    setMarks(updatedMarks);
  };

  const addStudent = () => {
    setMarks((prevMarks) => {
      const newMarks = [...prevMarks, { regno: "", score: "" }];

      // Scroll to the newly added student input
      setTimeout(() => {
        if (lastStudentRef.current) {
          lastStudentRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      return newMarks;
    });
  };

  // Fetch all clases
  const fetchClases = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/clase");
      setClases(data);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/streams");
      setStreams(response.data);
    } catch (error) {
      toast.error("Failed to fetch streams");
    }
  };

  // Fetch learning areas
  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/learning-areas");
      setLearningAreas(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching learning areas:", error);
      toast.error("Failed to fetch learning areas");
      setLoading(false);
    }
  };

  const removeStudent = (index) => {
    setMarks(marks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate scores
    const invalidScore = marks.some((mark) => mark.score < 0 || mark.score > 100);
    if (invalidScore) {
      toast.error("Score must be between 0 and 100.");
      setLoading(false);
      return;
    }

    // Combine common data with student marks
    const payload = marks.map((mark) => ({
      ...commonData,
      ...mark,
    }));

    try {
      const response = await fetch("http://localhost:3000/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ marks: payload }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setMarks([{ regno: "", score: "" }]); // Reset student marks
        setCommonData({
          year: "",
          term: "",
          stream: "",
          class: "",
          category: "",
          code: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchLearningAreas();
    fetchClases();
    fetchStreams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
     
      <div className="flex-1 px-6 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-gray-800">Post Marks</h1>
          <UserAccount />
        </div>

        <div className="bg-white overflow-y-auto max-h-[90vh] rounded-lg shadow-md pb-24 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Set Your Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Data Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">YEAR</label>
                <select
                  name="year"
                  value={commonData.year}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Term Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">TERM</label>
                <select
                  name="term"
                  value={commonData.term}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {termOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">STREAM</label>
                <select
                  name="stream"
                  value={commonData.stream}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Stream</option>
                  {streams.map((stream) => (
                    <option key={stream._id} value={stream.name}>
                      {stream.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">CLASS</label>
                <select
                  name="class"
                  value={commonData.class}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {clases.map((clase) => (
                    <option key={clase._id} value={clase.clasename}>
                      {clase.clasename}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">CATEGORY</label>
                <select
                  name="category"
                  value={commonData.category}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Area Code Select */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">CODE</label>
                <select
                  name="code"
                  value={commonData.code}
                  onChange={handleCommonChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject Code</option>
                  {learningAreas.map((area) => (
                    <option key={area._id} value={area.code}>
                      {area.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Marks Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Student Marks</h2>
              <div className="overflow-y-auto max-h-[40vh]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left text-sm font-medium text-gray-600">Reg No</th>
                      <th className="p-2 text-left text-sm font-medium text-gray-600">Score</th>
                      <th className="p-2 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200"
                        ref={index === marks.length - 1 ? lastStudentRef : null}
                      >
                        <td className="p-2">
                          <input
                            type="text"
                            name="regno"
                            value={mark.regno}
                            onChange={(e) => handleMarksChange(index, e)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            name="score"
                            value={mark.score}
                            onChange={(e) => handleMarksChange(index, e)}
                            required
                            min="0"
                            max="100"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          {marks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStudent(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={addStudent}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + more
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 ${
                  loading ? "bg-blue-300" : "bg-blue-500"
                } text-white rounded-lg hover:bg-blue-600 transition`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddMarks;