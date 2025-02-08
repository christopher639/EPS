import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate

import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import ReportForm from "./Pages/ReportForm";
import Students from "./Pages/Students";

import Fees from "./Pages/Fees";
import Parents from "./Pages/Parents";
import StudentDetail from "./Pages/StudentDetail";
import Teachers from "./Pages/Teachers";
import LearningArea from "./Pages/LearningArea";
import Analytics from "./Pages/Analytics";
import Finance from "./Pages/Finance";
import Departments from "./Pages/Departments";
import MergerReportForm from "./Pages/MergerReportForm";
import MergedAssessment from "./Pages/MergedAssessment";
import Assessments from "./Pages/Assessments";
import AvgMerged from "./Pages/AvgMerged";
import GeneralReport from "./Pages/GeneralReport";
import LoginPage from "./Pages/LoginPage"; // Import LoginPage
import Users from "./Pages/Users";
import ReportCard from "./Pages/ReportCard"; // Import the ReportCard page

import OpenerCard from "./Pages/OpenerCard";
import Streams from "./Pages/Streams";
import AddMarks from "./InstructorsPortal/InstructorPages/AddMarks";
import StudDashBoard from "./StudentPortal/StudentPages/StudDashBoard";
import InstructorDashboard from "./InstructorsPortal/InstructorPages/InstructorDashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage (indicating user is logged in)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []);

  return (
    <div className="min-w-full  bg-gray-100  fixed">
      <ToastContainer />
     
        <Routes>
          {/* Redirect root to login page if not authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

          {/* Protect routes that require authentication */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/reportform" element={isAuthenticated ? <ReportForm /> : <Navigate to="/login" />} />
          <Route path="/students" element={isAuthenticated ? <Students /> : <Navigate to="/login" />} />
          <Route path="/streams" element={isAuthenticated ? <Streams/> : <Navigate to="/login" />} />
          <Route path="/fees" element={isAuthenticated ? <Fees /> : <Navigate to="/login" />} />
          <Route path="/parents" element={isAuthenticated ? <Parents /> : <Navigate to="/login" />} />
          <Route path="/teachers" element={isAuthenticated ? <Teachers /> : <Navigate to="/login" />} />
          <Route path="/learningarea" element={isAuthenticated ? <LearningArea /> : <Navigate to="/login" />} />
          <Route path="/student/:id" element={isAuthenticated ? <StudentDetail /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/finance" element={isAuthenticated ? <Finance /> : <Navigate to="/login" />} />
          <Route path="/departments" element={isAuthenticated ? <Departments /> : <Navigate to="/login" />} />
          <Route path="/avgmerged" element={isAuthenticated ? <AvgMerged /> : <Navigate to="/login" />} />
          <Route path="/general-report" element={isAuthenticated ? <GeneralReport /> : <Navigate to="/login" />} />
          
          {/* Add the ReportCard Route */}
          <Route
            path="/report-card"
            element={isAuthenticated ? <ReportCard /> : <Navigate to="/login" />}
          />
           <Route
            path="/openercards"
            element={isAuthenticated ? <OpenerCard/> : <Navigate to="/login" />}
          />
          <Route path="/report-card" element={isAuthenticated ? <ReportCard /> : <Navigate to="/login" />} />

          <Route path="/report-card" element={isAuthenticated ? <MergerReportForm /> : <Navigate to="/login" />} />
          <Route path="/merged-assessment" element={isAuthenticated ? <MergedAssessment /> : <Navigate to="/login" />} />
          <Route path="/assessments" element={isAuthenticated ? <Assessments /> : <Navigate to="/login" />} />
          <Route path="/instructordashboard" element={isAuthenticated ? <InstructorDashboard/> : <Navigate to="/login" />} />
          <Route path="/studentdashboard" element={isAuthenticated ? <StudDashBoard/> : <Navigate to="/login" />} />
          <Route path="/addmarks" element={isAuthenticated ? <AddMarks/> : <Navigate to="/login" />} />
          <Route path="/student" element={isAuthenticated ? <StudentDetail/> : <Navigate to="/login" />} />
        </Routes>
      </div>
   
  );
};

export default App;
