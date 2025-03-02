import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
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
import Users from "./Pages/Users";
import ReportCard from "./Pages/ReportCard";
import OpenerCard from "./Pages/OpenerCard";
import Streams from "./Pages/Streams";
import AddMarks from "./InstructorsPortal/InstructorPages/AddMarks";
import StudDashBoard from "./StudentPortal/StudentPages/StudDashBoard";
import InstructorDashboard from "./InstructorsPortal/InstructorPages/InstructorDashboard";
import StudentPerStream from "./Pages/StudentPerStream";
import Expenses from "./Pages/Expenses";
import FeesDistribution from "./Pages/FeesDistribution";
import FeeStructure from "./Pages/FeeStructure";
import FeesPayment from "./Pages/FeesPayment";
import LearnerManagement from "./Pages/LearnerManagement";
import LearnerDetail from "./Pages/LearnerDetail";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import HelpAndSupport from "./Pages/HelpAndSupport";


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
    <div className="min-w-full bg-gray-100 fixed">
      <ToastContainer />
      <Routes>
        {/* Redirect root to login page if not authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Protect routes that require authentication */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="/reportform"
          element={isAuthenticated ? <ReportForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/students"
          element={isAuthenticated ? <Students /> : <Navigate to="/login" />}
        />
        <Route
          path="/streams"
          element={isAuthenticated ? <Streams /> : <Navigate to="/login" />}
        />
        <Route
          path="/fees"
          element={isAuthenticated ? <Fees /> : <Navigate to="/login" />}
        />
        <Route
          path="/parents"
          element={isAuthenticated ? <Parents /> : <Navigate to="/login" />}
        />
         <Route
          path="/help"
          element={isAuthenticated ? <HelpAndSupport /> : <Navigate to="/login" />}
        />
        <Route
          path="/teachers"
          element={isAuthenticated ? <Teachers /> : <Navigate to="/login" />}
        />
        <Route
          path="/learningarea"
          element={isAuthenticated ? <LearningArea /> : <Navigate to="/login" />}
        />
        
           <Route
          path="/settings"
          element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
        />
           <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/:id"
          element={isAuthenticated ? <StudentDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/finance"
          element={isAuthenticated ? <Finance /> : <Navigate to="/login" />}
        />
        <Route
          path="/departments"
          element={isAuthenticated ? <Departments /> : <Navigate to="/login" />}
        />
        <Route
          path="/avgmerged"
          element={isAuthenticated ? <AvgMerged /> : <Navigate to="/login" />}
        />
        <Route
          path="/general-report"
          element={isAuthenticated ? <GeneralReport /> : <Navigate to="/login" />}
        />
        <Route
          path="/report-card"
          element={isAuthenticated ? <ReportCard /> : <Navigate to="/login" />}
        />
        <Route
          path="/openercards"
          element={isAuthenticated ? <OpenerCard /> : <Navigate to="/login" />}
        />
        <Route
          path="/merged-assessment"
          element={isAuthenticated ? <MergedAssessment /> : <Navigate to="/login" />}
        />
        <Route
          path="/assessments"
          element={isAuthenticated ? <Assessments /> : <Navigate to="/login" />}
        />
        <Route
          path="/instructordashboard"
          element={isAuthenticated ? <InstructorDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/studentdashboard"
          element={isAuthenticated ? <StudDashBoard /> : <Navigate to="/login" />}
        />
        <Route
          path="/addmarks"
          element={isAuthenticated ? <AddMarks /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses"
          element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />}
        />
        <Route
          path="/fees-distribution"
          element={isAuthenticated ? <FeesDistribution /> : <Navigate to="/login" />}
        />
        <Route
          path="/fees-structure"
          element={isAuthenticated ? <FeeStructure /> : <Navigate to="/login" />}
        />
        <Route
          path="/students/:streamName/:year"
          element={<StudentPerStream />}
        />
        <Route
          path="/fees-payments"
          element={isAuthenticated ? <FeesPayment /> : <Navigate to="/login" />}
        />
        <Route
          path="/learner"
          element={isAuthenticated ? <LearnerManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/learner/:id"
          element={isAuthenticated ? <LearnerDetail /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;