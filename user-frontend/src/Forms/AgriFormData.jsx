import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

const AgriFormData = () => {
  const [students, setMarks] = useState([]);
  const [formData, setFormData] = useState({
    subjectcode: "agri10",
    regno: "",
    score: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state for fetching data
  const [error, setError] = useState(null); // For handling errors

  // Fetch student data
  const getFetchData = () => {
    setLoading(true);
    setError(null); // Reset error before fetching data
    axios.get("/api/joined-students-generallay")
      .then(response => {
        setMarks(response.data);
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch(err => {
        setLoading(false);
        setError("Failed to fetch student data");
        toast.error("Failed to fetch student data");
      });
  };

  // Initial data fetch when the component mounts
  useEffect(() => {
    getFetchData();
  }, []);

  // Handle form input changes
  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/subjectmark", formData);
      toast.success("Agriculture mark saved successfully!");
      // Set button to 'Submitted' and clear form data
      setIsSubmitted(true);
      setFormData({
        subjectcode: 'agri10',
        regno: '',
        score: ''
      });

      // Re-fetch the student data
      getFetchData();

      // Revert button back to 'Submit' after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);

    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving mark. Please try again.");
    }
  };

  // Handle deletion of student data (if needed)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subjectmark/${id}`);
      toast.success("Mark deleted successfully!");
      getFetchData();  // Re-fetch the data after deletion
    } catch (error) {
      toast.error("Error deleting mark. Please try again.");
    }
  };

  // Display loading or error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex w-full flex-col">
        <div className="flex mt-1 flex-col md:flex-row">
          <div className="w-full px-2 border rounded">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 rounded-md">
                <div className="flex justify-between gap-4">
                  <p className="py-2">SUBJECT CODE:</p>
                  <input
                    onChange={handleOnChange}
                    name="subjectcode"
                    type="text"
                    placeholder="AGRI10"
                    value="AGRI10"
                    readOnly
                    className="p-2 border rounded-md outline-none text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <p className="py-1">ADM NO:</p>
                  <input
                    onChange={handleOnChange}
                    name="regno"
                    type="text"
                    placeholder="ADM NO"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <p className="py-1">SCORE:</p>
                  <input
                    onChange={handleOnChange}
                    name="score"
                    type="number"
                    placeholder="SCORE"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-slate-800 text-white py-1 rounded">
                  {isSubmitted ? "Submitted" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="flex mx-2 flex-col max-h-[53vh] sm:max-h-[50vh] overflow-y-auto overflow-x-auto">
          <div className="flex justify-between">
            <div>
              <input className="outline-none border mt-1" type="text" placeholder="Search" />
            </div>
            <div>
              <button className="bg-green-600 py-1 text-white px-2">Print</button>
            </div>
          </div>
          <table className="min-w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="border-r">ADM NO</th>
                <th className="border-r whitespace-nowrap">AGRICULTURE SCORE</th>
                <th className="border border-slate-500 text-center">
                  <button className="text-white px-1 rounded-sm cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                    </svg>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="border py-3 border-slate-500">
                  <td className="pr-2 text-center border border-slate-500">{student.regno}</td>
                  <td className="pr-2 border text-center border-slate-500">{student.marks.agri10}</td>
                  <td className="border border-slate-500 text-center">
                    <button onClick={() => handleDelete(student._id)} className="text-white px-1 rounded-sm cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex w-2/5 items-center justify-center">
        <div className="hidden md:flex">
          Class performance Analytics
        </div>
        {/* Toast Container for notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AgriFormData;
