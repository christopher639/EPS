import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import { FaPaperPlane } from "react-icons/fa";
import avater from '../assets/lion.jpg';
import BASE_URL from "../config";
axios.defaults.baseURL = "https://eps-dashboard.onrender.com";

const StudentDetail = () => {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sideBar, setSideBar] = useState(true);
  const [academicData, setAcademicData] = useState(null);
  const [feesPayments, setFeesPayments] = useState([]); // Store payment records
  const [year, setYear] = useState("2024-2025");
  const [term, setTerm] = useState("Term-1");
  const [category, setCategory] = useState("Opener");
  const [regno, setRegno] = useState(""); // Student regno

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
        setRegno(response.data.regno); // Set the regno
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [id]);

  // Fetch academic data
  useEffect(() => {
    if (regno) {
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
  }, [year, term, category, regno]);

  // Fetch fees payment records
  useEffect(() => {
    if (regno) {
      const fetchFeesPayments = async () => {
        try {
          const response = await axios.get(`/api/fees-payments/regno/${regno}`);
          setFeesPayments(response.data);
        } catch (error) {
          console.error("Error fetching fees payments:", error);
        }
      };
      fetchFeesPayments();
    }
  }, [regno]);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const getRemark = (score) => {
    if (score >= 75) return "E.E"; // Exceeding Expectation
    if (score >= 50) return "M.E"; // Meeting Expectation
    if (score >= 0) return "B.E";  // Below Expectation
    return "F"; // Failed
  };

  return (
    <div className="flex">
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      
      <div className="flex flex-col w-full bg-gray-100">
        {/* Header */}
        <div className="flex px-6 py-4 border-b bg-white shadow-md justify-between items-center">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <p className="text-xl font-semibold hidden sm:flex text-gray-800">Learner Information</p>
          <UserAccount />
        </div>
        
        <div className="p-6 flex flex-col gap-5 shadow-lg rounded-lg overflow-y-auto max-h-[88vh]">
        <div >
          {/* Student Details Section */}
          <div className="p-6 flex flex-col gap-5  rounded-lg overflow-y-auto max-h-[88vh]">
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
        </div>

      
      </div>

          {/* Fees Payment Statement */}
          <div className="py-6 px-2 mt-10 flex flex-col gap-5 bg-white rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Fees Payment Statement</h2>
            {feesPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left border">Payment ID</th>
                      <th className="px-4 py-2 text-left border">Amount Paid</th>
                      <th className="px-4 py-2 text-left border">Payment Method</th>
                      <th className="px-4 py-2 text-left border">Date Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-100 transition-colors">
                        <td className="px-4 py-2 border">{payment._id}</td>
                        <td className="px-4 py-2 border">Ksh {payment.amountPaid.toLocaleString()}</td>
                        <td className="px-4 py-2 border">{payment.paymentMethod}</td>
                        <td className="px-4 py-2 border">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No payment records found.</p>
            )}
          </div>

          {/* Academic Section */}
          <div className="py-6 px-2 mt-10 flex flex-col gap-5 bg-white rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            {academicData ? (
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left border">Subject</th>
                    <th className="px-4 py-2 text-left border">Score</th>
                    <th className="px-4 py-2 text-left border">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData[0]?.subjects.map((subject) => (
                    <tr key={subject.code}>
                      <td className="px-4 py-2 border">{subject.name}</td>
                      <td className="px-4 py-2 border">{subject.filteredScore}</td>
                      <td className="px-4 py-2 border">{getRemark(subject.filteredScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No academic data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
