import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import UserAccount from "../../components/UserAccount";
import axios from "axios";

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

 // Export to PDF function with borders and additional columns
const exportToPDF = () => {
  try {
    setGeneratingPDF(true);
    const doc = new jsPDF();
    
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
      "", // Opener (placeholder)
      "", // Mid-Term (placeholder)
      "", // Final (placeholder)
      ""  // Total (will be calculated)
    ]);
    
    // Create the table with visible borders
    autoTable(doc, {
      head: [['Reg No', 'Student Name', 'Opener', 'Mid-Term', 'Final', 'Total','Remark']],
      body: tableData,
      startY: 40,
      styles: {
        cellPadding: 4,
        fontSize: 10,
        valign: 'middle',
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0.3,
        lineColor: [0, 0, 0] // Black borders for header
      },
      bodyStyles: {
        lineWidth: 0.2,
        lineColor: [0, 0, 0] // Black borders for body
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
        lineWidth: 0.2,
        lineColor: [0, 0, 0] // Black borders for alternate rows
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' }, // Reg No
        1: { cellWidth: 50 }, // Student Name
        2: { cellWidth: 20, halign: 'center' }, // Opener
        3: { cellWidth: 25, halign: 'center' }, // Mid-Term
        4: { cellWidth: 20, halign: 'center' }, // Final
        5: { cellWidth: 20, halign: 'center', fontStyle: 'bold' } // Total
      },
      didDrawCell: (data) => {
        // Add thicker borders for header
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
    doc.text(`Generated on: ${date}`, 14, doc.lastAutoTable.finalY + 15);
    
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
            `http://localhost:3000/api/learners/${commonData.class}/${commonData.stream}`
          );
          
          setMarks(response.data.learners.map(student => ({
            regno: student.regno,
            score: null, // Initialize scores as null
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
    const studentIndex = marks.findIndex(m => m.regno === updatedMarks[index].regno);
    updatedMarks[studentIndex][name] = value === "" ? null : value;
    setMarks(updatedMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate scores (only check non-null values)
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

    // Prepare payload (include all students, even those without marks)
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

      const response = await fetch("http://localhost:3000/api/marks", {
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
        // Reset only the scores, keep the student list
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
          axios.get("http://localhost:3000/api/clase"),
          axios.get("http://localhost:3000/api/streams"),
          axios.get("http://localhost:3000/api/learning-areas")
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
    <div className="mx-auto overflow-y-auto max-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="font-bold text-xl text-gray-800">Sagme - Marks Management</h1>
        <UserAccount />
      </div>
      
      <div className="flex justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Set Assessment Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parameter Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Academic Year</label>
                  <select
                    name="year"
                    value={commonData.year}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Term Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Term</label>
                  <select
                    name="term"
                    value={commonData.term}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {termOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stream Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Stream</label>
                  <select
                    name="stream"
                    value={commonData.stream}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Class</label>
                  <select
                    name="class"
                    value={commonData.class}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Assessment Type</label>
                  <select
                    name="category"
                    value={commonData.category}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Subject Code</label>
                  <select
                    name="code"
                    value={commonData.code}
                    onChange={handleCommonChange}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <h2 className="text-xl font-semibold text-gray-800">Student Marks Entry</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Filter Input */}
                    {marks.length > 0 && (
                      <input
                        type="text"
                        placeholder="Filter by Reg No..."
                        value={filterRegNo}
                        onChange={(e) => setFilterRegNo(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    
                    {/* Export Buttons */}
                    {marks.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={exportToPDF}
                          disabled={generatingPDF}
                          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition ${
                            generatingPDF ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {generatingPDF ? 'Generating...' : 'Export PDF'}
                        </button>
                        <button
                          type="button"
                          onClick={exportToExcel}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition"
                        >
                          Export Excel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Loading State */}
                {fetchingStudents && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading student data...</p>
                  </div>
                )}
                
                {/* Student Marks Table */}
                {!fetchingStudents && filteredMarks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Reg No</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Student Name</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-700">Score (0-100)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMarks.map((mark, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50"
                            ref={index === filteredMarks.length - 1 ? lastStudentRef : null}
                          >
                            <td className="p-3">
                              <input
                                type="text"
                                name="regno"
                                value={mark.regno}
                                readOnly
                                className="w-full p-2 border border-gray-200 rounded bg-gray-50"
                              />
                            </td>
                            <td className="p-3">
                              {mark.studentName || "N/A"}
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                name="score"
                                value={mark.score || ""}
                                onChange={(e) => handleMarksChange(index, e)}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        {commonData.class && commonData.stream 
                          ? filterRegNo 
                            ? "No students match your filter criteria" 
                            : "No students found for the selected class and stream" 
                          : "Please select a class and stream to view students"}
                      </p>
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
                    className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                      loading || fetchingStudents 
                        ? "bg-blue-300 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        Processing...
                      </span>
                    ) : (
                      "Submit Marks"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
};

export default AddMarks;