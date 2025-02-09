import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import { FaPaperPlane } from "react-icons/fa";
import avater from '../assets/lion.jpg';
axios.defaults.baseURL = "http://localhost:3000";

const StudentDetail = () => {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [academicData, setAcademicData] = useState(null); // New state for academic data
  const [year, setYear] = useState("2024-2025");
  const [term, setTerm] = useState("Term-1");
  const [category, setCategory] = useState("Opener");
  const [regno, setRegno] = useState(""); // Initialize regno as an empty string

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
        setRegno(response.data.regno); // Set the regno once the student data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  // Fetch academic data when year, term, category, or regno changes
  useEffect(() => {
    if (regno) {  // Only fetch academic data if regno is available
      const fetchAcademicData = async () => {
        try {
          const response = await axios.get(`/api/marks/marks/${year}/${term}/${category}/${regno}`);
          setAcademicData(response.data);
        } catch (error) {
          console.error("Error fetching academic data:", error);
        }
      };

      fetchAcademicData();
    }
  }, [year, term, category, regno]); // Fetch academic data when these params change

  // Toggle Sidebar
  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };
  // Function to get remarks based on the score
const getRemark = (score) => {
  if (score >= 75) return "E.E"; // Exceeding Expectation
  if (score >= 50) return "M.E"; // Meeting Expectation
  if (score >= 0) return "B.E";  // Below Expectation
  return "F"; // Failed or not attended
};


  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center w-full h-screen bg-gray-100">
  //       <div className="spinner-border" role="status">
  //         <span className="sr-only">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex">
      <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}
      >
        <SideBar /> {/* Conditionally render based on sidebar state */}
      </div>
      <div className="flex bg-white flex-col w-full  bg-gray-100">
        {/* Header */}
        <div className="flex px-6 py-4 border-b bg-white shadow-md justify-between items-center">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <p className="text-xl font-semibold hidden sm:flex text-gray-800">Learner Information </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 flex text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
          >
           <p><FaPaperPlane/> </p> <p className="hidden sm:flex"> Message</p>
          </button>
          <UserAccount />
        </div>
        <p className="text-xl sm:hidden font-semibold text-gray-800">Learner Information </p>
      <div >
          {/* Student Details Section */}
          <div className="p-6 flex flex-col gap-5 shadow-lg rounded-lg overflow-y-auto max-h-[88vh]">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Student Image */}
              <div className="flex flex-col  md:mb-0">
                <p className="text-lg font-bold text-gray-800 ">Student Image</p>
                <img
                  className="w-64 h-64 rounded-lg border-4 border-gray-200 object-cover shadow-sm"
                  src={student?.photo ? `http://localhost:3000${student.photo}` :`${avater}`}
                  alt="Student"
                />
              </div>
              <div className="space-y-4">
                <p className="text-gray-700"><strong>Name:</strong> {student?.name}</p>
                <p className="text-gray-700"><strong>Admission Number:</strong> {student?.regno}</p>
                <p className="text-gray-700"><strong>Stream:</strong> {student?.stream}</p>
                <p className="text-gray-700"><strong>Gender:</strong> {student?.gender}</p>
                <p className="text-gray-700"><strong>Date of Birth:</strong> {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB') : "N/A"}</p>
                <p className="text-gray-700"><strong>Nationality:</strong> {student?.nationality}</p>
                <p className="text-gray-700"><strong>Birth Certificate No:</strong> {student?.birthCertificateNo}</p>
                <p className="text-gray-700"><strong>Admission Date:</strong> {student?.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-GB') : "N/A"}</p>
              </div>
              <div className="space-y-4">
              <p className="text-gray-700"><strong>Medical History:</strong> {student?.medicalHistory}</p>
                <p className="text-gray-700"><strong>Scholarships:</strong> {student?.scholarships.join(", ")}</p>
                <p className="text-gray-700"><strong>Physical Disability:</strong> {student?.physicalDisability ? "Yes" : "No"}</p>
                <p className="text-gray-700"><strong>Type:</strong> {student?.studentType}</p>
              
                <p className="text-gray-700"><strong>Belongs To Staff:</strong> {student?.belongToStaff? "Yes" : "No"}</p>
                <p className="text-gray-700"><strong>Previous school:</strong> {student?.studentType}</p>
                <p className="text-gray-700"><strong>Previous School Grade:</strong> {student?.birthCertificateNo}</p>
                <p className="text-gray-700"><strong>Fee Status:</strong> {student?.feeStatus}</p>
              </div>
          </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
             <div className="">
             <p className="text-gray-700"><strong>Guardian Name:</strong> {student?.guardianName}</p>
                <p className="text-gray-700"><strong>Guardian Relationship:</strong> {student?.guardianRelationship}</p>
               
               
              
              </div>
              <div className="">
              <p className="text-gray-700"><strong>Primary Phone:</strong> {student?.phoneNumber}</p>
              <p className="text-gray-700"><strong>Secondary Phone:</strong> {student?.phoneNumber}</p>
              </div>
              <div className="">
              <p className="text-gray-700"><strong>Email:</strong> {student?.email}</p>
              <p className="text-gray-700"><strong>Address:</strong> {student?.address}</p>
              </div>
             </div>
               {/* Academic Section */}
        <div className="py-6 px-2 mt-10 flex flex-col gap-5   bg-white">
          <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
          
          {/* Display Academic Data */}
          {academicData ? (
      <div className="overflow-x-auto">
      <table className="min-w-full  table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th> {/* New Grade column */}
          </tr>
        </thead>
        <tbody>
          {academicData[0]?.subjects.map((subject) => (
            <tr key={subject.code}>
              <td className="px-6 py-3 text-sm text-gray-700">{subject.name}</td>
              <td className="px-6 py-3 text-sm text-gray-700">{subject.filteredScore}</td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {/* Call getRemark function to display grade based on score */}
                {getRemark(subject.filteredScore)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
      
         
          ) : (
            <p>No academic data available.</p>
          )}
        </div>
        </div>

      
      </div>

        {/* Modal for Messaging */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full mx-5 md:w-2/3 lg:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Send a Message</h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700">Inbox Message</label>
                    <textarea
                      className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type message here..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Email Message</label>
                    <textarea
                      className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type email message..."
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
