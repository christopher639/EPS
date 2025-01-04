import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate

import Users from "./Pages/Users";
import RightBar from "./components/RightBar";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import ReportForm from "./Pages/ReportForm";
import Students from "./Pages/Students";
import Academic from "./Pages/Academic";
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
const App = () => {
  return (
    <div className="flex min-h-full bg-gray-100 w-full fixed flex-row">
      <ToastContainer />
      <div className="flex flex-col items-center h-screen">
        <SideBar />
      </div>
      <div className="w-full min-h-full md:mx-0">
        <TopBar />
        <Routes>
          {/* Redirect the root path to /students */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Academic />} />
          <Route path="/reportform" element={<ReportForm />} />
          <Route path="/students" element={<Students />} />
          <Route path="/streams" element={<Academic />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/learningarea" element={<LearningArea />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/departments" element={<Departments/>} />
          <Route path="/avgmerged" element={<AvgMerged/>} />
          <Route path="/general-report" element={<GeneralReport/>} />
          <Route path="/report-card" element={<MergerReportForm/>}/>
          <Route path="/merged-assessment" element={<MergedAssessment/>}/>
          
          <Route path="/assessments" element={<Assessments/>}/>
        
        </Routes>
      </div>
      <div className="md:mr-0">
        <RightBar />
      </div>
    </div>
  );
};
export default App;
