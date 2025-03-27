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
import AuthWrapper from "./Pages/AuthWrapper";
import Clases from "./Pages/Clases";

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
          element={
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/users"
          element={
            <AuthWrapper>
              <Users />
            </AuthWrapper>
          }
        />
          <Route
          path="/clases"
          element={
            <AuthWrapper>
              <Clases/>
            </AuthWrapper>
          }
        />
        <Route
          path="/reportform"
          element={
            <AuthWrapper>
              <ReportForm />
            </AuthWrapper>
          }
        />
        <Route
          path="/students"
          element={
            <AuthWrapper>
              <Students />
            </AuthWrapper>
          }
        />
        <Route
          path="/streams"
          element={
            <AuthWrapper>
              <Streams />
            </AuthWrapper>
          }
        />
        <Route
          path="/fees"
          element={
            <AuthWrapper>
              <Fees />
            </AuthWrapper>
          }
        />
        <Route
          path="/parents"
          element={
            <AuthWrapper>
              <Parents />
            </AuthWrapper>
          }
        />
        <Route
          path="/help"
          element={
            <AuthWrapper>
              <HelpAndSupport />
            </AuthWrapper>
          }
        />
        <Route
          path="/teachers"
          element={
            <AuthWrapper>
              <Teachers />
            </AuthWrapper>
          }
        />
        <Route
          path="/learningarea"
          element={
            <AuthWrapper>
              <LearningArea />
            </AuthWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthWrapper>
              <SettingsPage />
            </AuthWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthWrapper>
              <ProfilePage />
            </AuthWrapper>
          }
        />
        <Route
          path="/student/:id"
          element={
            <AuthWrapper>
              <StudentDetail />
            </AuthWrapper>
          }
        />
        <Route
          path="/analytics"
          element={
            <AuthWrapper>
              <Analytics />
            </AuthWrapper>
          }
        />
        <Route
          path="/finance"
          element={
            <AuthWrapper>
              <Finance />
            </AuthWrapper>
          }
        />
        <Route
          path="/departments"
          element={
            <AuthWrapper>
              <Departments />
            </AuthWrapper>
          }
        />
        <Route
          path="/avgmerged"
          element={
            <AuthWrapper>
              <AvgMerged />
            </AuthWrapper>
          }
        />
        <Route
          path="/general-report"
          element={
            <AuthWrapper>
              <GeneralReport />
            </AuthWrapper>
          }
        />
        <Route
          path="/report-card"
          element={
            <AuthWrapper>
              <ReportCard />
            </AuthWrapper>
          }
        />
        <Route
          path="/openercards"
          element={
            <AuthWrapper>
              <OpenerCard />
            </AuthWrapper>
          }
        />
        <Route
          path="/merged-assessment"
          element={
            <AuthWrapper>
              <MergedAssessment />
            </AuthWrapper>
          }
        />
        <Route
          path="/assessments"
          element={
            <AuthWrapper>
              <Assessments />
            </AuthWrapper>
          }
        />
        <Route
          path="/instructordashboard"
          element={
            <AuthWrapper>
              <InstructorDashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/studentdashboard"
          element={
            <AuthWrapper>
              <StudDashBoard />
            </AuthWrapper>
          }
        />
        <Route
          path="/addmarks"
          element={
            <AuthWrapper>
              <AddMarks />
            </AuthWrapper>
          }
        />
        <Route
          path="/expenses"
          element={
            <AuthWrapper>
              <Expenses />
            </AuthWrapper>
          }
        />
        <Route
          path="/fees-distribution"
          element={
            <AuthWrapper>
              <FeesDistribution />
            </AuthWrapper>
          }
        />
        <Route
          path="/fees-structure"
          element={
            <AuthWrapper>
              <FeeStructure />
            </AuthWrapper>
          }
        />
        <Route
          path="/students/:streamName/:year"
          element={
            <AuthWrapper>
              <StudentPerStream />
            </AuthWrapper>
          }
        />
        <Route
          path="/fees-payments"
          element={
            <AuthWrapper>
              <FeesPayment />
            </AuthWrapper>
          }
        />
        <Route
          path="/learner"
          element={
            <AuthWrapper>
              <LearnerManagement />
            </AuthWrapper>
          }
        />
        <Route
          path="/learner/:id"
          element={
            <AuthWrapper>
              <LearnerDetail />
            </AuthWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;