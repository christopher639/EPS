import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import UserAccount from "../../components/UserAccount";
import axios from "axios";
import { FiFilter, FiDownload, FiFileText, FiFile, FiUpload, FiLoader } from "react-icons/fi";

const AddMarks = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [clases, setClases] = useState([]);
  const [streams, setStreams] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [filterRegNo, setFilterRegNo] = useState("");
  
  const [commonData, setCommonData] = useState({
    year: "",
    term: "",
    stream: "",
    class: "",
    category: "",
    code: "",
  });

  const [marks, setMarks] = useState([]);
  const lastStudentRef = useRef(null);

  // Constants
  const yearOptions = [
    { value: "", label: "Select Year" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];

  const termOptions = [
    { value: "", label: "Select Term" },
    { value: "Term-1", label: "Term 1" },
    { value: "Term-2", label: "Term 2" },
    { value: "Term-3", label: "Term 3" },
  ];

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "Opener", label: "Opener" },
    { value: "Mid-Term", label: "Mid-Term" },
    { value: "Final", label: "Final" },
  ];

  // Filter students by registration number
  const filteredMarks = marks.filter(mark => 
    mark.regno.toLowerCase().includes(filterRegNo.toLowerCase())
  );

  // Count non-empty and empty cells
  const countCells = () => {
    const nonEmpty = marks.filter(mark => mark.score !== null && mark.score !== "").length;
    const empty = marks.filter(mark => mark.score === null || mark.score === "").length;
    return { nonEmpty, empty };
  };

  const { nonEmpty, empty } = countCells();

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredMarks.map(mark => ({
        "Reg No": mark.regno,
        "Student Name": mark.studentName || "N/A",
        "Score": mark.score || "",
        "Class": commonData.class,
        "Stream": commonData.stream,
        "Subject Code": commonData.code,
        "Category": commonData.category,
        "Term": commonData.term,
        "Year": commonData.year
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Marks");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(data, `Marks_${commonData.class}_${commonData.stream}.xlsx`);
  };

  const exportToPDF = () => {
    try {
      setGeneratingPDF(true);
      const doc = new jsPDF('landscape'); // Set landscape orientation
      
      // Title and header information
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`Student Marks Report - ${commonData.class} ${commonData.stream}`, 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Subject: ${commonData.code} | Term: ${commonData.term} | Year: ${commonData.year}`, 14, 30);
      
      // Prepare table data with all required columns
      const tableData = filteredMarks.map(mark => [
        mark.regno,
        mark.studentName || "N/A",
        "", // Opener Test 1
        "", // Opener Test 2
        "", // Opener Test 3
        "", // Opener Total (will be calculated)
        "", // Mid-Term Test 1
        "", // Mid-Term Test 2
        "", // Mid-Term Test 3
        "", // Mid-Term Total (will be calculated)
        "", // Final Test 1
        "", // Final Test 2
        "", // Final Test 3
        "", // Final Total (will be calculated)
        "", // Grand Total
        ""  // Remark
      ]);
      
      // Create the table with visible borders and nested columns
      autoTable(doc, {
        head: [
          [
            { content: 'Reg No', rowSpan: 2 },
            { content: 'Student Name', rowSpan: 2 },
            { content: 'Opener Tests', colSpan: 4 },
            { content: 'Mid-Term Tests', colSpan: 4 },
            { content: 'Final Tests', colSpan: 4 },
            { content: 'Grand Total', rowSpan: 2 },
            { content: 'Remark', rowSpan: 2 }
          ],
          [
            ' 1',
            ' 2',
            ' 3',
            'Total',
            ' 1',
            ' 2',
            ' 3',
            'Total',
            ' 1',
            ' 2',
            ' 3',
            'Total'
          ]
        ],
        body: tableData,
        startY: 40,
        styles: {
          cellPadding: 4,
          fontSize: 9, // Slightly smaller font to fit more columns
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          lineWidth: 0.3,
          lineColor: [0, 0, 0]
        },
        bodyStyles: {
          lineWidth: 0.2,
          lineColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
          lineWidth: 0.2,
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' }, // Reg No
          1: { cellWidth: 40 }, // Student Name
          2: { cellWidth: 12, halign: 'center' }, // Opener Test 1
          3: { cellWidth: 12, halign: 'center' }, // Opener Test 2
          4: { cellWidth: 12, halign: 'center' }, // Opener Test 3
          5: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Opener Total
          6: { cellWidth: 12, halign: 'center' }, // Mid-Term Test 1
          7: { cellWidth: 12, halign: 'center' }, // Mid-Term Test 2
          8: { cellWidth: 12, halign: 'center' }, // Mid-Term Test 3
          9: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Mid-Term Total
          10: { cellWidth: 12, halign: 'center' }, // Final Test 1
          11: { cellWidth: 12, halign: 'center' }, // Final Test 2
          12: { cellWidth: 12, halign: 'center' }, // Final Test 3
          13: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Final Total
          14: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }, // Grand Total
          15: { cellWidth: 25, halign: 'center' } // Remark
        },
        didDrawCell: (data) => {
          if (data.section === 'head') {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(
              data.cell.x,
              data.cell.y + data.cell.height,
              data.cell.x + data.cell.width,
              data.cell.y + data.cell.height
            );
          }
        },
        didDrawPage: function (data) {
          // Page number
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.setTextColor(100);
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
              `Page ${i} of ${pageCount}`,
              doc.internal.pageSize.width - 30,
              doc.internal.pageSize.height - 10
            );
          }
        }
      });
      
      // Add document border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
      
      // Footer with generation date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);
      
      doc.save(`Marks_Report_${commonData.class}_${commonData.stream}.pdf`);
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Fetch students when class or stream changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (commonData.class && commonData.stream) {
        setFetchingStudents(true);
        try {
          const response = await axios.get(
            `https://eps-dashboard.onrender.com/api/learners/${commonData.class}/${commonData.stream}`
          );
          
          setMarks(response.data.learners.map(student => ({
            regno: student.regno,
            score: null,
            studentName: student.name
          })));
        } catch (error) {
          toast.error("Failed to fetch students");
          console.error("Error fetching students:", error);
        } finally {
          setFetchingStudents(false);
        }
      }
    };

    fetchStudents();
  }, [commonData.class, commonData.stream]);

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarksChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMarks = [...marks];
    const studentIndex = marks.findIndex(m => m.regno === filteredMarks[index].regno);
    updatedMarks[studentIndex][name] = value === "" ? null : value;
    setMarks(updatedMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate scores
    const invalidScore = marks.some((mark) => {
      if (mark.score === null || mark.score === "") return false;
      const score = parseFloat(mark.score);
      return isNaN(score) || score < 0 || score > 100;
    });

    if (invalidScore) {
      toast.error("All entered scores must be between 0 and 100.");
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = marks.map((mark) => ({
      ...commonData,
      regno: mark.regno,
      score: mark.score === null ? null : parseFloat(mark.score),
      studentName: mark.studentName
    }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to login first");
        setLoading(false);
        return;
      }

      const response = await fetch(" https://eps-dashboard.onrender.com/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ marks: payload }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setMarks(marks.map(mark => ({ ...mark, score: null })));
        setCommonData(prev => ({
          ...prev,
          category: "",
          code: "",
        }));
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [classesRes, streamsRes, areasRes] = await Promise.all([
          axios.get("https://eps-dashboard.onrender.com/api/clase"),
          axios.get("https://eps-dashboard.onrender.com/api/streams"),
          axios.get("https://eps-dashboard.onrender.com/api/learning-areas")
        ]);
        setClases(classesRes.data);
        setStreams(streamsRes.data);
        setLearningAreas(areasRes.data);
      } catch (error) {
        toast.error("Failed to load initial data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  flex justify-between items-center">
          <h1 className="text-md font-bold text-gray-800">Marks  Portal</h1>
          <UserAccount />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-h-screen pb-20 md:pb-16  overflow-y-auto md:w-1/2  mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Enter Leaner Marks</h2>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parameter Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Year Selection */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                  <select
                    name="year"
                    value={commonData.year}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Term Selection */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Term</label>
                  <select
                    name="term"
                    value={commonData.term}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {termOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stream Selection */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Stream</label>
                  <select
                    name="stream"
                    value={commonData.stream}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Stream</option>
                    {streams.map((stream) => (
                      <option key={stream._id} value={stream.name}>
                        {stream.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <select
                    name="class"
                    value={commonData.class}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Class</option>
                    {clases.map((clase) => (
                      <option key={clase._id} value={clase.clasename}>
                        {clase.clasename}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assessment Category */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                  <select
                    name="category"
                    value={commonData.category}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Selection */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                  <select
                    name="code"
                    value={commonData.code}
                    onChange={handleCommonChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {learningAreas.map((area) => (
                      <option key={area._id} value={area.code}>
                        {area.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Marks Section */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-lg font-semibold text-gray-800">Student Marks Entry</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Filter Input */}
                    {marks.length > 0 && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiFilter className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Filter by Reg No..."
                          value={filterRegNo}
                          onChange={(e) => setFilterRegNo(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                      </div>
                    )}
                    
                    {/* Export Buttons */}
                    {marks.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={exportToPDF}
                          disabled={generatingPDF}
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            generatingPDF ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {generatingPDF ? (
                            <>
                              <FiLoader className="animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FiFileText className="mr-2" />
                              PDF
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={exportToExcel}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiFile className="mr-2" />
                          Excel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Data Count Info */}
                {marks.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">Data Status:</span> {nonEmpty} filled, {empty} empty
                  </div>
                )}
                
                {/* Loading State */}
                {fetchingStudents && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-600">Loading student data...</span>
                    </div>
                  </div>
                )}
                
                {/* Student Marks Table */}
                {!fetchingStudents && filteredMarks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score (0-100)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMarks.map((mark, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50"
                            ref={index === filteredMarks.length - 1 ? lastStudentRef : null}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <input
                                type="text"
                                name="regno"
                                value={mark.regno}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3  whitespace-wrap md:whitespace-nowrap text-sm text-gray-900">
                              {mark.studentName || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <input
                                type="number"
                                name="score"
                                value={mark.score || ""}
                                onChange={(e) => handleMarksChange(index, e)}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Enter score"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !fetchingStudents && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {commonData.class && commonData.stream 
                          ? filterRegNo 
                            ? "No students match your filter criteria" 
                            : "No students found for the selected class and stream" 
                          : "Please select a class and stream to view students"}
                      </h3>
                    </div>
                  )
                )}
              </div>

              {/* Submission Section */}
              {filteredMarks.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || fetchingStudents}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading || fetchingStudents ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiUpload className="-ml-1 mr-2 h-4 w-4" />
                        Submit Marks
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        toastClassName="rounded-lg"
        bodyClassName="p-3"
        progressClassName="bg-blue-500"
      />
    </div>
  );
};

export default AddMarks;