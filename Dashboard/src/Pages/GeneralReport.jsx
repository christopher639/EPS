import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lion from '../assets/lion.jpg';
import UserAccount from "../components/UserAccount";
import SidebarToggleButton from "../components/SidebarToggleButton";
import SideBar from "../components/SideBar";
import { FaFile, FaPrint } from "react-icons/fa";

const GeneralReport = () => {
  const [classValue, setClassValue] = useState("10");
  const [sideBar, setSideBar] = useState(true); // To control the visibility of the sidebar
  const [yearValue, setYearValue] = useState("2024-2025");
  const [termValue, setTermValue] = useState("Term-1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/marks/${classValue}/${yearValue}/${termValue}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [classValue, yearValue, termValue]);

  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");

    // Function to add background colors to odd and even rows
    const addRowBackgroundColors = (content) => {
      const rows = content.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index % 2 === 0) {
          row.style.backgroundColor = '#e6f7ff'; // Light blue for even rows
        } else {
          row.style.backgroundColor = '#f0f8ff'; // Lighter blue for odd rows
        }
      });
      return content;
    };

    // Gather all styles from the current page, including any dynamically applied ones
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

    // Write the styles and content to the print window
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(`
      <style>
        ${styles}
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #4a90e2;
        }
        th, td {
          border: 2px solid #ddd;
          padding: 10px;
          text-align: center;
        }
        #bo {
          border: 1px solid #4a90e2;
        }
      </style>
    `); // Add custom styles to the print window
    printWindow.document.write("</head><body>");
    
    // Create a temporary element to hold the content and apply row background colors
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContent;
    addRowBackgroundColors(tempDiv);

    // Write the modified content (with row background colors) to the print window
    printWindow.document.write(tempDiv.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    // Trigger the print dialog once the content is loaded
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  const calculateStudentTotalsAndAverages = (students) => {
    return students.map((student) => {
      const totalScores = student.subjects.reduce((total, subject) => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore];
        const validScores = scores.filter((score) => score != null);
        const avgScore = validScores.length > 0 ? validScores.reduce((acc, score) => acc + score, 0) / validScores.length : 0;
        return total + avgScore;
      }, 0);

      const avgScore = student.subjects.length > 0 ? totalScores / student.subjects.length : 0;

      return {
        ...student,
        totalScore: totalScores,
        avgScore: avgScore,
        subjects: student.subjects.map((subject) => ({
          ...subject,
          avgScore: (subject.openerScore + subject.midTermScore + subject.finalScore) / 3
        })),
      };
    });
  };

  const updatedData = calculateStudentTotalsAndAverages(data);

  const calculateClassTotalAndAverage = () => {
    const totalScores = updatedData.reduce((sum, student) => sum + student.totalScore, 0);
    const subjectCount = updatedData.reduce((sum, student) => sum + student.subjects.length, 0);

    const classAverage = subjectCount > 0 ? totalScores / subjectCount : 0;

    return {
      total: totalScores,
      average: classAverage
    };
  };

  const classStats = calculateClassTotalAndAverage();

  const subjectStats = updatedData.reduce((acc, student) => {
    student.subjects.forEach(subject => {
      const existingSubject = acc.find(sub => sub.code === subject.code);
      if (existingSubject) {
        existingSubject.total += subject.avgScore;
        existingSubject.count++;
      } else {
        acc.push({
          code: subject.code,
          total: subject.avgScore,
          count: 1
        });
      }
    });
    return acc;
  }, []);

  subjectStats.sort((a, b) => (b.total / b.count) - (a.total / a.count));

  const calculateSubjectTotalsAndAverages = () => {
    return subjectStats.map(subjectStat => ({
      ...subjectStat,
      average: subjectStat.total / subjectStat.count
    }));
  };

  const subjectTotalsAndAverages = calculateSubjectTotalsAndAverages();

  if (error) {
    return (
      <div className="text-center flex justify-center items-center text-lg text-red-500">
        <div>Error: {error}</div>
      </div>
    );
  }

  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex">
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className="container max-w-full  bg-gray-100">
        {/* Top Controls */}
        <div className="flex p-4 justify-between items-center bg-white ">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <button
            onClick={handlePrint}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition"
          >
            <FaPrint className="md:hidden" /> <p className="hidden md:flex"> Print </p>
          </button>
          <button
            onClick={() =>
              navigate("/report-card", {
                state: { data: updatedData, classValue, yearValue, termValue },
              })
            }
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition"
          >
            <p className="hidden md:flex"> Reports</p>
            <FaFile className="md:hidden" />
          </button>
          <UserAccount />
        </div>

        {/* Filter Section */}
        <div className="grid p-4 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-2 px-3">
          <input
            type="text"
            className="text-center max-w-48 text-sm border border-gray-300 py-2 px-3 rounded-md"
            placeholder="Search"
          />
          <select
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="Form3">Form 3</option>
            <option value="Form4">Form 4</option>
            <option value="Form5">Form 5</option>
            <option value="Form6">Form 6</option>
          </select>
          <select
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
          <select
            value={termValue}
            onChange={(e) => setTermValue(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="px-4 grid grid-cols-1 pb-4 max-h-[80vh] pb-8 overflow-y-auto w-full overflow-x-auto">
          {updatedData.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No data found</p>
          ) : (
            <div id="printableTable">
          <div className="flex w-full mx-3  gap-5 justify-between">
            {/* <div>
              <img className="w-24 h-24 rounded-full" src={lion} alt="" />
            </div> */}
            <div className="flex   gap-2">
            <p>SAMGE class </p>
             <p  className="font-semibold ">{classValue}</p>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="flex gap-2">
                 <p>Academic Year</p>
                 <p  className="font-semibold ">{yearValue}</p>
              </div>
              <div  className="flex gap-5">
                <p>Term</p>
                <p  className="font-semibold ">{termValue}</p>
               
              </div>
            </div>
          </div>
       
            <table className="w-full overflow-x-auto table-auto  px-2 border   ">
              <thead className="sticky top-0 bg-white">
                <tr  id='bo' className="bg-gray-200">
                <th id='bo' className="border px-3 sticky top-0 bg-white  py-2">Name</th>
                  <th id='bo' className="border  px-3 sticky top-0 bg-white  py-2">Reg No</th>
                  <th id='bo' className="border px-3 sticky top-0 bg-white py-2">Stream</th>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <th id='bo' key={index} className="border sticky top-0 bg-white  py-2">
                      <p className="text-yellow-600">{index + 1}</p>
                      <p className="px-3 text-sm">{subjectStat.code}</p>
                    </th>
                  ))}
                  <th id='bo' className="border sticky top-0 bg-white  py-2">Total</th>
                  <th id='bo' className="border sticky top-0 bg-white  py-2">Average</th>
                </tr>
              </thead>
              <tbody>
                {updatedData.map((student, studentIndex) => {
                  const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
                  const studentAverage = studentTotal / student.subjects.length;

                  return (
                    <tr key={studentIndex} className="hover:bg-gray-100 p-2">
                      <td className="border  px-3  whitespace-nowrap text-left  py-2">{student.studentName}</td>
                      <td className="border  px-3 py-2">{student.regno}</td>
                      <td className="border  text-center p-2">{student.stream}</td>
                      {subjectTotalsAndAverages.map((subjectStat, subjectIndex) => {
                        const subject = student.subjects.find((sub) => sub.code === subjectStat.code);
                        return (
                          <td key={subjectIndex} className="border  px-3  py-2">
                            {subject ? subject.avgScore.toFixed(2) : "-"}
                          </td>
                        );
                      })}
                      <td className="border  px-3  py-2">{studentTotal.toFixed(2)}</td>
                      <td className="border  px-3  py-2">{studentAverage.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-gray-200">
                  <td colSpan={3} className="border  px-3 py-2">Total</td>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <td key={index} className="border  px-3 py-2">
                      {subjectStat.total.toFixed(2)}
                    </td>
                  ))}
                  <td className="border  px-3 py-2">{classStats.total.toFixed(2)}</td>
                </tr>
                <tr className="font-bold  bg-gray-200">
                  <td colSpan={3} className="border  px-3 py-2">Average</td>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <td key={index} className="border   px-3 py-2">
                      {subjectStat.average.toFixed(2)}
                    </td>
                  ))}
                  <td className="border  px-3 py-2">{classStats.average.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;
