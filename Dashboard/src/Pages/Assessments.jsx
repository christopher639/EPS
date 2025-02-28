import React, { useState, useEffect } from "react";
import UserAccount from "../components/UserAccount";
import axios from "axios";
import SidebarToggleButton from "../components/SidebarToggleButton";
// import SideBar from "../components/SideBar";
// import BASE_URL from "../config";

axios.defaults.baseURL = BASE_URL;
const Assessments = () => {
  const [classValue, setClassValue] = useState("10");
  const [sideBar, setSideBar] = useState(false); // To control the visibility of the sidebar
  const [yearValue, setYearValue] = useState("2024-2025");
  const [termValue, setTermValue] = useState("Term-1");
  const [categoryValue, setCategoryValue] = useState("Opener");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stream, setStream] = useState("");
  const [examCategory, setExamCategory] = useState(categoryValue);

  // Handle Scroll Position Persistence
  const saveScrollPosition = () => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    localStorage.setItem("scrollPosition", JSON.stringify({ scrollX, scrollY }));
  };

  const restoreScrollPosition = () => {
    const savedPosition = JSON.parse(localStorage.getItem("scrollPosition"));
    if (savedPosition) {
      window.scrollTo(savedPosition.scrollX, savedPosition.scrollY);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://eps-dashboard.onrender.com/api/marks/${classValue}/${yearValue}/${termValue}/${categoryValue}`
        );
        setData(response.data); // Axios automatically parses JSON
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    restoreScrollPosition(); // Restore scroll position after data is loaded
  }, [classValue, yearValue, termValue, categoryValue]);
  

  // Handle Print Functionality
  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;

    // Create a new print window
    const printWindow = window.open("", "", "height=600,width=800");

    // Write HTML content for the print window
    printWindow.document.write("<html><head><title>Print</title>");

    // Capture the styles from the current document
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");


    // Inject the styles into the print window
    printWindow.document.write(`<style>${styles}</style>`);

    // Inject the printable content into the print window
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");

    // Close the document and wait for it to load
    printWindow.document.close();

    // Print the window once it's loaded
    printWindow.onload = () => {
      printWindow.print();

      // Restore the page after printing (This avoids modifying the React page state)
      setTimeout(() => {
        printWindow.close(); // Close the print window after print
      }, 1000);
    };
  };

  // if (loading) {
  //   return <div className="text-center text-lg text-gray-500">Loading...</div>;
  // }

  if (error) {
    return <div className="text-center text-lg text-red-500">Error: {error}</div>;
  }

  const subjectCodes = [
    ...new Set(data.flatMap((student) => student.subjects.map((subject) => subject.code))),
  ];

  const subjectScores = subjectCodes.map((code) => {
    const totalScore = data.reduce((sum, student) => {
      const subject = student.subjects.find((sub) => sub.code === code);
      return sum + (subject ? subject.filteredScore : 0);
    }, 0);
    return { code, totalScore };
  });

  const sortedSubjectCodes = subjectScores
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((subject) => subject.code);

  const studentWithScores = data.map((student) => {
    const studentScores = sortedSubjectCodes.map((subjectCode) => {
      const subject = student.subjects.find((sub) => sub.code === subjectCode);
      return subject ? subject.filteredScore ?? "-" : "-"; // Show dash if no score
    });

    const totalScore = studentScores.reduce(
      (sum, score) => sum + (score !== "-" ? score : 0),
      0
    ); // Adjust total calculation to ignore dashes
    const averageScore = studentScores.length > 0 ? (totalScore / studentScores.length).toFixed(2) : 0;

    return { ...student, studentScores, totalScore, averageScore };
  });

  const totalScoresPerSubject = sortedSubjectCodes.map((code) => {
    return data.reduce((sum, student) => {
      const subject = student.subjects.find((sub) => sub.code === code);
      return sum + (subject ? subject.filteredScore : 0);
    }, 0);
  });

  const overallTotalScore = studentWithScores.reduce((sum, student) => sum + student.totalScore, 0);
  const overallAverageScore = studentWithScores.length > 0 ? (overallTotalScore / studentWithScores.length).toFixed(2) : 0;

  // Filter data based on search query
  const filteredData = data.filter((student) => {
    const regno = student.regno ? String(student.regno).toLowerCase() : "";
    const stream = student.stream ? student.stream.toLowerCase() : "";

    return regno.includes(searchQuery.toLowerCase()) || stream.includes(searchQuery.toLowerCase());
  });
  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };
  return (
   <div className="flex ">
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? "w-0 md:w-72" : "w-0"
        } bg-gray-800 min-h-screen`}
      >
       <SideBar /> {/* Conditionally render Sidebar */}
      </div>
    <div className="container mx-auto max-w-full  bg-white">
      <div className="flex justify-between bg-white border-b p-3 gap-4  mb-4">
       <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
        <div >
          <button
            onClick={handlePrint}
            className="text-center bg-green-800 text-white text-sm w-full border border-1 border-slate-700 font-bold p-2 rounded hover:text-slate-900 whitespace-nowrap"
          >
            Print Sheet
          </button>
        </div>
        
        <div>
          <button 
           onClick={() =>
            navigate("/openercards", {
              state: { data: updatedData, classValue, yearValue, termValue },
            })
          }
          className="text-center bg-green-800 px-3 text-white text-sm w-full border border-1 border-slate-700 font-bold p-2 rounded hover:text-slate-900">
            Reports
          </button>
        </div>
        <UserAccount/>
      </div>
        <div className="grid p-3 gap-3  grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-2 px-3">
        <div >
          <input
            type="text"
            className="text-center max-w-32 text-sm  border border-slate-300 outline-none py-2 px-3 text-sm rounded-md"
            placeholder="regno or stream"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div >
          <select
            className="px-3 py-2  text-sm outline-none border rounded"
            value={stream}
            onChange={(e) => setClassValue(e.target.value)}
          >
            <option value="">Class</option>
            <option value="Form3">Form 3</option>
            <option value="Form4">Form 4</option>
            <option value="Form5">Form 5</option>
            <option value="Form6">Form 6</option>
          </select>
        </div>
        <div >
          <select
            className="px-3 py-2  text-sm outline-none border rounded"
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
          >
            <option value="">Year</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>
        <div >
          <select
            className="px-3 py-2  text-sm outline-none border rounded"
            value={termValue}
            onChange={(e) => setTermValue(e.target.value)}
          >
            <option value="">Term</option>
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>
        <div >
          <select
            className="px-3 py-2  text-sm outline-none border rounded"
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="Final">Final</option>
          </select>
        </div>
        </div>
      {filteredData.length === 0 ? (
        <p className="text-center text-lg text-red-500">No data found</p>
      ) : (
        <div id="printableTable" className=" p-3 grid grid-cols-1 max-h-[72vh] md:max-h-[80vh] overflow-y-auto  w-full overflow-x-auto ">
          <div className="flex mx-3  gap-5 justify-between">
            <div>
              <img className="w-16 h-16 bg-gray-100" src="lion.jpg" alt="Logo" />
            </div>
            <div className="grid -full gap-5 grid-cols-4">
              <div className="flex gap-2">
                 <p>Academic Year</p>
                 <p  className="font-semibold ">{yearValue}</p>
              </div>
              <div  className="flex gap-5">
                <p>Class</p>
                <p  className="font-semibold ">{classValue}</p>
                
              </div>
              <div  className="flex gap-5">
                <p>Term</p>
                <p  className="font-semibold ">{termValue}</p>
               
              </div>
              <div  className="flex gap-5 " >
                <p>Exam Type</p>
                <p className="font-semibold ">{categoryValue}</p>
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead className="sticky top-0 bg-white" >
           
              <tr className="bg-slate-800  text-gray-900 ">
              <th className="border sticky top-0 bg-white px-1">Name</th>
                <th className="border  sticky top-0 bg-white px-1">Reg. No.</th>
                <th className="border sticky top-0 bg-white  px-1">Stream</th>
                {sortedSubjectCodes.map((subjectCode, idx) => (
                  <th key={idx} className="border sticky top-0 bg-white text-center  px-1">
                    <h4 className="text-yellow-700">{idx + 1}</h4>
                    <p>{subjectCode}</p>
                  </th>
                ))}
                <th className="border sticky top-0 bg-white px-1">Total</th>
                
                <th className="border sticky top-0 bg-white  px-1">Average</th>
              </tr>
            </thead>
            <tbody>
              {studentWithScores.map((student, index) => (
                <tr className="hover:bg-slate-300 text-black" key={student.regno}>
                   <td className="border sticky top-0 bg-white px-1">{student.studentName}</td>
                  <td className="border flex  gap-3 px-1 py-1">{student.regno}</td>
                  <td className="border  px-1 py-1">{student.stream}</td>
                  {student.studentScores.map((score, idx) => (
                    <td key={idx} className="border text-center  px-1 py-1">
                      {score === "-" ? "-" : score} {/* Show dash if score is '-' */}
                    </td>
                  ))}
                  <td className="border text-center  px-1 py-1">{student.totalScore}</td>
                  <td className="border text-center  px-1 py-1">{student.averageScore}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="border  px-1 text-center py-1">
                  <strong>Total Scores</strong>
                </td>
                {totalScoresPerSubject.map((total, idx) => (
                  <td key={idx} className="border text-center  px-1 py-1">
                    {total}
                  </td>
                ))}
                <td className="border text-center px-1 py-1">{overallTotalScore}</td>
                <td className="border  text-center px-1 py-1">{overallAverageScore}</td>
              </tr>
              <tr>
                <td colSpan={3} className="border text-center  px-1 py-1">
                  <strong>Average Scores</strong>
                </td>
                {totalScoresPerSubject.map((total, idx) => (
                  <td key={idx} className="border text-center  px-1 py-1">
                    {(total / data.length).toFixed(2)}
                  </td>
                ))}
                <td className="border  text-center px-1 py-1">
                  {(overallTotalScore / data.length).toFixed(2)}
                </td>
                <td className="border text-center px-1 py-1">
                  {overallAverageScore}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
   </div>
  );
};

export default Assessments;
