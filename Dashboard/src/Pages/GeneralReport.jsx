import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAccount from "../components/UserAccount";
import SidebarToggleButton from "../components/SidebarToggleButton";
import SideBar from "../components/SideBar";
import { FaFile, FaPrint } from "react-icons/fa";
import BASE_URL from "../config";
import axios from "axios";
import MobileNav from "../components/MobileNav";
axios.defaults.baseURL = BASE_URL;

const GeneralReport = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [sideBar, setSideBar] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    class: "",
    year: "",
    term: ""
  });
  const navigate = useNavigate();

  // Spinner component
  const Spinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `/api/marks/${appliedFilters.class}/${appliedFilters.year}/${appliedFilters.term}`
      );
      setData(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!selectedClass || !selectedYear || !selectedTerm) {
      setError("Please select all filter options");
      return;
    }
    setAppliedFilters({
      class: selectedClass,
      year: selectedYear,
      term: selectedTerm
    });
  };

  useEffect(() => {
    if (appliedFilters.class && appliedFilters.year && appliedFilters.term) {
      fetchData();
    }
  }, [appliedFilters]);

  const handlePrint = () => {
    if (data.length === 0) return;
    
    const printContent = document.getElementById("printableTable")?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;

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
        tr:nth-child(even) {
          background-color: #e6f7ff;
        }
        tr:nth-child(odd) {
          background-color: #f0f8ff;
        }
      </style>
    `);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  const calculateStudentTotalsAndAverages = (students) => {
    if (!students || !Array.isArray(students)) return [];
    
    return students.map((student) => {
      if (!student || !student.subjects) return student;
      
      const totalScores = student.subjects.reduce((total, subject) => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore].filter(score => score != null);
        const avgScore = scores.length > 0 ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
        return total + avgScore;
      }, 0);

      const avgScore = student.subjects.length > 0 ? totalScores / student.subjects.length : 0;

      return {
        ...student,
        totalScore: totalScores,
        avgScore: avgScore,
        subjects: student.subjects.map((subject) => ({
          ...subject,
          avgScore: [subject.openerScore, subject.midTermScore, subject.finalScore]
            .filter(score => score != null)
            .reduce((acc, score, _, arr) => acc + (score / arr.length), 0)
        })),
      };
    });
  };

  const updatedData = calculateStudentTotalsAndAverages(data);
  const filteredData = updatedData.filter(student => {
    if (!student) return false;
    const name = student.studentName || "";
    const regno = student.regno || "";
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || regno.toLowerCase().includes(query);
  });

  const calculateClassTotalAndAverage = () => {
    if (!filteredData || filteredData.length === 0) return { total: 0, average: 0 };
    
    const totalScores = filteredData.reduce((sum, student) => sum + (student.totalScore || 0), 0);
    const subjectCount = filteredData.reduce((sum, student) => sum + (student.subjects?.length || 0), 0);
    const classAverage = subjectCount > 0 ? totalScores / subjectCount : 0;

    return {
      total: totalScores,
      average: classAverage
    };
  };

  const classStats = calculateClassTotalAndAverage();

  const subjectStats = filteredData.reduce((acc, student) => {
    if (!student || !student.subjects) return acc;
    
    student.subjects.forEach(subject => {
      if (!subject) return;
      const existingSubject = acc.find(sub => sub.code === subject.code);
      if (existingSubject) {
        existingSubject.total += subject.avgScore || 0;
        existingSubject.count++;
      } else {
        acc.push({
          code: subject.code,
          total: subject.avgScore || 0,
          count: 1
        });
      }
    });
    return acc;
  }, []);

  subjectStats.sort((a, b) => (b.total / b.count) - (a.total / a.count));

  const subjectTotalsAndAverages = subjectStats.map(subjectStat => ({
    ...subjectStat,
    average: subjectStat.total / subjectStat.count
  }));

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className="flex">
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className="container max-w-full bg-gray-100">
        {/* Top Controls */}
        <div className="flex p-2 justify-between items-center bg-white">
          <MobileNav/>
          <div className="hidden md:flex">
            <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          </div>
          <UserAccount />
        </div>

        {/* Filter Section */}
        <div className="grid p-4 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-2 px-3 bg-white shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-center max-w-48 text-sm border border-gray-300 py-2 px-3 rounded-md"
            placeholder="Search by name or regno"
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Class</option>
            <option value="Form3">Form 3</option>
            <option value="Form4">Form 4</option>
            <option value="Form5">Form 5</option>
            <option value="Form6">Form 6</option>
            <option value="10">10</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Year</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Term</option>
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading || !selectedClass || !selectedYear || !selectedTerm}
          >
            {loading ? "Loading..." : "Populate"}
          </button>
        </div>

        {/* Only show action buttons if data exists */}
        {data.length > 0 && (
          <div className="flex justify-between md:mx-10 mx-5 mt-4">
            <button
              onClick={() => {
                navigate("/report-card", {
                  state: { 
                    data: filteredData, 
                    classValue: appliedFilters.class, 
                    yearValue: appliedFilters.year, 
                    termValue: appliedFilters.term 
                  },
                });
              }}
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition"
            >
              Reports
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition"
            >
              Print
            </button>    
          </div>
        )}

        {/* Table Section */}
        <div className="px-4 grid grid-cols-1 pb-4 max-h-[80vh] pb-8 overflow-y-auto w-full overflow-x-auto">
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-center text-lg text-red-500 py-4">{error}</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-lg text-gray-500 py-4">
              {data.length === 0 
                ? appliedFilters.class 
                  ? `No data found for ${appliedFilters.class} - ${appliedFilters.year} - ${appliedFilters.term}`
                  : "Please select filters and click Populate"
                : "No matching records found"}
            </p>
          ) : (
            <div id="printableTable">
              <div className="flex w-full mx-3 gap-5 justify-between">
                <div className="flex gap-2">
                  <p>SAMGE class </p>
                  <p className="font-semibold">{appliedFilters.class}</p>
                </div>
                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <p>Academic Year</p>
                    <p className="font-semibold">{appliedFilters.year}</p>
                  </div>
                  <div className="flex gap-5">
                    <p>Term</p>
                    <p className="font-semibold">{appliedFilters.term}</p>
                  </div>
                </div>
              </div>
       
              <table className="w-full overflow-x-auto table-auto px-2 border">
                <thead className="sticky top-0 bg-white">
                  <tr id='bo' className="bg-gray-200">
                    <th id='bo' className="border px-3 sticky top-0 bg-white py-2">Name</th>
                    <th id='bo' className="border px-3 sticky top-0 bg-white py-2">Reg No</th>
                    <th id='bo' className="border px-3 sticky top-0 bg-white py-2">Stream</th>
                    {subjectTotalsAndAverages.map((subjectStat, index) => (
                      <th id='bo' key={index} className="border sticky top-0 bg-white py-2">
                        <p className="text-yellow-600">{index + 1}</p>
                        <p className="px-3 text-sm">{subjectStat.code}</p>
                      </th>
                    ))}
                    <th id='bo' className="border sticky top-0 bg-white py-2">Total</th>
                    <th id='bo' className="border sticky top-0 bg-white py-2">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((student, studentIndex) => {
                    const studentTotal = student.subjects?.reduce((sum, subject) => sum + (subject.avgScore || 0), 0) || 0;
                    const studentAverage = student.subjects?.length > 0 ? studentTotal / student.subjects.length : 0;

                    return (
                      <tr key={studentIndex} className="hover:bg-gray-100 p-2">
                        <td className="border px-3 whitespace-nowrap text-left py-2">{student.studentName || "-"}</td>
                        <td className="border px-3 py-2">{student.regno || "-"}</td>
                        <td className="border text-center p-2">{student.stream || "-"}</td>
                        {subjectTotalsAndAverages.map((subjectStat, subjectIndex) => {
                          const subject = student.subjects?.find((sub) => sub?.code === subjectStat.code);
                          return (
                            <td key={subjectIndex} className="border px-3 py-2">
                              {subject ? subject.avgScore?.toFixed(2) || "-" : "-"}
                            </td>
                          );
                        })}
                        <td className="border px-3 py-2">{studentTotal.toFixed(2)}</td>
                        <td className="border px-3 py-2">{studentAverage.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold bg-gray-200">
                    <td colSpan={3} className="border px-3 py-2">Total</td>
                    {subjectTotalsAndAverages.map((subjectStat, index) => (
                      <td key={index} className="border px-3 py-2">
                        {subjectStat.total.toFixed(2)}
                      </td>
                    ))}
                    <td className="border px-3 py-2">{classStats.total.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold bg-gray-200">
                    <td colSpan={3} className="border px-3 py-2">Average</td>
                    {subjectTotalsAndAverages.map((subjectStat, index) => (
                      <td key={index} className="border px-3 py-2">
                        {subjectStat.average.toFixed(2)}
                      </td>
                    ))}
                    <td className="border px-3 py-2">{classStats.average.toFixed(2)}</td>
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