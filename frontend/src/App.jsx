import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import Staff from "./Pages/Staff";
import Users from "./Pages/Users";
import RightBar from "./components/RightBar";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Marks from "./Pages/Marks";
import ReportForm from "./Pages/ReportForm";
import Admission from "./Pages/Admission";
import Students from "./Pages/Students";
import Academic from "./Pages/Academic";
import Fees from "./Pages/Fees";
import Parents from "./Pages/Parents";
import MarksFom1y from "./Pages/MarksFom1y";
import Form1yReport from "./Pages/Form1yReport";
import StudentDetail from "./Pages/StudentDetail";
import JoinedStudentsMarks from "./Pages/JoinedStudentsMarks";
import Teachers from "./Pages/Teachers";
import LearningArea from "./Pages/LearningArea";
import Analytics from "./Pages/Analytics";
import Finance from "./Pages/Finance";

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
          <Route path="/" element={<Navigate to="/students" />} />
          
          <Route path="/staffs" element={<Staff />} />
          <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/users" element={<Users />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/marks1y" element={<MarksFom1y />} />
          <Route path="/reportform" element={<ReportForm />} />
          <Route path="/reportform1y" element={<Form1yReport />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/students" element={<Students />} />
          <Route path="/streams" element={<Academic />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/learningarea" element={<LearningArea />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/joined-students_marks/:stream" element={<JoinedStudentsMarks />} />
        </Routes>
      </div>
      <div className="md:mr-0">
        <RightBar />
      </div>
    </div>
  );
};

export default App;
