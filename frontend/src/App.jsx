import React from "react";
import Staff from "./Pages/Staff";
import Users from "./Pages/Users";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <div className="flex min-h-full bg-gray-100 w-full fixed  flex-row">
      <ToastContainer />
      <div className=" border-r  border-slate-500 flex flex-col  items-center h-screen">
        <SideBar />
      </div>
      <div className=" w-full  min-h-full    md:mx-0   ">
        <TopBar />

        <Routes>
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
          <Route path="/parents" element={<Parents/>} />
        </Routes>
      </div>
      <div className=" md:mr-0 ">
        <RightBar />
      </div>
    </div>
  );
};

export default App;
