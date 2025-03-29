import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAccount from "../components/UserAccount";
import SidebarToggleButton from "../components/SidebarToggleButton";
import SideBar from "../components/SideBar";
import { FaFileExcel, FaFilePdf, FaUserGraduate, FaSearch, FaFilter, FaFileDownload } from "react-icons/fa";
import BASE_URL from "../config";
import axios from "axios";
import MobileNav from "../components/MobileNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Tooltip } from 'react-tooltip';
import { saveAs } from "file-saver";

axios.defaults.baseURL = BASE_URL;

const GeneralReport = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [clases, setClases] = useState([]);
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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingExcel, setGeneratingExcel] = useState(false);
  const [generatingReportCards, setGeneratingReportCards] = useState(false);
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
        `http://localhost:3000/api/marks/${appliedFilters.class}/${appliedFilters.year}/${appliedFilters.term}`
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

  // Fetch all classes
  const fetchClases = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/clase");
      setClases(data);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  // Helper functions for report cards
  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  };

  const getRemark = (score) => {
    if (score >= 75) return "E.E";
    if (score >= 50) return "M.E";
    if (score >= 0) return "B.E";
    return "F";
  };

  // PDF Export Function for General Report
  const exportToPDF = () => {
    try {
      setGeneratingPDF(true);
      const doc = new jsPDF("landscape");
      
      // Title and header information
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`Student Marks Report - ${appliedFilters.class} ${appliedFilters.year} ${appliedFilters.term}`, 14, 15);
      
      // Prepare table data
      const headers = [
        "No.",
        "Name",
        "Reg No",
        "Stream",
        ...subjectTotalsAndAverages.map(subject => subject.code),
        "Total",
        "Average"
      ];
      
      const tableData = filteredData.map((student, index) => {
        const row = [
          index + 1,
          student.studentName || "-",
          student.regno || "-",
          student.stream || "-",
          ...subjectTotalsAndAverages.map(subjectStat => {
            const subject = student.subjects?.find(sub => sub?.code === subjectStat.code);
            return subject ? subject.avgScore?.toFixed(2) || "-" : "-";
          }),
          student.subjects?.reduce((sum, subject) => sum + (subject.avgScore || 0), 0).toFixed(2) || "0.00",
          (student.subjects?.length > 0 
            ? student.subjects.reduce((sum, subject) => sum + (subject.avgScore || 0), 0) / student.subjects.length 
            : 0).toFixed(2)
        ];
        return row;
      });

      // Add summary rows
      tableData.push([
        "",
        "TOTAL",
        "",
        "",
        ...subjectTotalsAndAverages.map(subject => subject.total.toFixed(2)),
        classStats.total.toFixed(2),
        ""
      ]);
      
      tableData.push([
        "",
        "AVERAGE",
        "",
        "",
        ...subjectTotalsAndAverages.map(subject => subject.average.toFixed(2)),
        classStats.average.toFixed(2),
        ""
      ]);

      // Create the table with borders
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 25,
        styles: {
          cellPadding: 4,
          fontSize: 9,
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          lineWidth: 0.3
        },
        bodyStyles: {
          lineWidth: 0.2
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 25 },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(10);
          doc.setTextColor(100);
          const date = new Date().toLocaleDateString();
          doc.text(`Generated on: ${date}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`Marks_Report_${appliedFilters.class}_${appliedFilters.term}_${appliedFilters.year}.pdf`);
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Excel Export Function
  const exportToExcel = () => {
    try {
      setGeneratingExcel(true);
      
      // Prepare worksheet data
      const headers = [
        "No.",
        "Name",
        "Reg No",
        "Stream",
        ...subjectTotalsAndAverages.map(subject => subject.code),
        "Total",
        "Average"
      ];
      
      const excelData = filteredData.map((student, index) => {
        return [
          index + 1,
          student.studentName || "-",
          student.regno || "-",
          student.stream || "-",
          ...subjectTotalsAndAverages.map(subjectStat => {
            const subject = student.subjects?.find(sub => sub?.code === subjectStat.code);
            return subject ? subject.avgScore?.toFixed(2) || "-" : "-";
          }),
          student.subjects?.reduce((sum, subject) => sum + (subject.avgScore || 0), 0).toFixed(2) || "0.00",
          (student.subjects?.length > 0 
            ? student.subjects.reduce((sum, subject) => sum + (subject.avgScore || 0), 0) / student.subjects.length 
            : 0).toFixed(2)
        ];
      });

      // Add summary rows
      excelData.push([
        "",
        "TOTAL",
        "",
        "",
        ...subjectTotalsAndAverages.map(subject => subject.total.toFixed(2)),
        classStats.total.toFixed(2),
        ""
      ]);
      
      excelData.push([
        "",
        "AVERAGE",
        "",
        "",
        ...subjectTotalsAndAverages.map(subject => subject.average.toFixed(2)),
        classStats.average.toFixed(2),
        ""
      ]);

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Marks Report");
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(data, `Marks_Report_${appliedFilters.class}_${appliedFilters.term}_${appliedFilters.year}.xlsx`);
    } catch (error) {
      toast.error("Failed to generate Excel file");
      console.error("Excel generation error:", error);
    } finally {
      setGeneratingExcel(false);
    }
  };
 // Button with Tooltip Component
 const ActionButton = ({ 
  onClick, 
  disabled, 
  icon: Icon, 
  label, 
  loadingLabel, 
  tooltip, 
  bgColor = 'bg-blue-600',
  hoverColor = 'hover:bg-blue-700'
}) => (
  <>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${bgColor} ${hoverColor} text-white px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      data-tooltip-id={`tooltip-${label}`}
      data-tooltip-content={tooltip}
    >
      <Icon />
      {disabled ? loadingLabel : label}
    </button>
    <Tooltip id={`tooltip-${label}`} />
  </>
);
// Function to export individual report card
const exportReportCard = (student) => {
  try {
    setGeneratingPDF(true);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });

    // Set document properties
    doc.setProperties({
      title: `Report Card - ${student.studentName}`,
      subject: 'Student Academic Report',
      author: 'SAMGE School',
      keywords: 'report, card, academic',
      creator: 'SAMGE School System'
    });

    const studentTotal = student.subjects?.reduce((sum, subject) => sum + (subject.avgScore || 0), 0) || 0;
    const studentAverage = student.subjects?.length > 0 ? studentTotal / student.subjects.length : 0;

    // Set initial font settings
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);

    // School header
    doc.text('SAMGE SCHOOL', 105, 15, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('P.O. BOX 109-30102, Burnt Forest', 105, 22, { align: 'center' });
    doc.text('Tel: 0721790694', 105, 28, { align: 'center' });

    // Report title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('LEARNER PERFORMANCE REPORT CARD', 105, 40, { align: 'center' });

    // Student information
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Name: ${student.studentName || "-"}`, 20, 50);
    doc.text(`Admission No: ${student.regno || "-"}`, 20, 56);
    doc.text(`Class: ${appliedFilters.class}`, 20, 62);
    doc.text(`Stream: ${student.stream || "-"}`, 20, 68);
    
    doc.text(`Academic Year: ${appliedFilters.year}`, 150, 50);
    doc.text(`Term: ${appliedFilters.term}`, 150, 56);
    doc.text(`Total Marks: ${studentTotal.toFixed(0)}/${student.subjects?.length * 100 || 0}`, 150, 62);
    doc.text(`Average: ${studentAverage.toFixed(2)}% (${getRemark(studentAverage)})`, 150, 68);

    // Prepare subject data for the table
    const subjectHeaders = ['Subject', 'Teacher', 'Opener', 'Mid Term', 'End Term', 'Average', 'Remark'];
    const subjectData = student.subjects?.map(subject => {
      const scores = [subject.openerScore, subject.midTermScore, subject.finalScore].filter(score => score != null);
      const avgScore = scores.length > 0 ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
      return [
        subject.name || "-",
        subject.teacherName || "-",
        subject.openerScore ?? "-",
        subject.midTermScore ?? "-",
        subject.finalScore ?? "-",
        avgScore.toFixed(2),
        getRemark(avgScore)
      ];
    }) || [];

    // Add subjects table
    autoTable(doc, {
      head: [subjectHeaders],
      body: subjectData,
      startY: 80,
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0.3
      }
    });

    // Grading key table
    const gradingHeaders = ['Grade', 'Range', 'Meaning'];
    const gradingData = [
      ['E.E', '75 - 100', 'Exceeding Expectation'],
      ['M.E', '50 - 74', 'Meeting Expectation'],
      ['B.E', '0 - 49', 'Below Expectation'],
      ['F', 'Cheated', 'Null and Void'],
      ['-', 'NULL', 'Missing/Never did exam']
    ];

    autoTable(doc, {
      head: [gradingHeaders],
      body: gradingData,
      startY: doc.lastAutoTable.finalY + 10,
      margin: { left: 20 },
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0.3
      }
    });

    // Comments section
    doc.setFontSize(10);
    doc.text('COMMENTS:', 20, doc.lastAutoTable.finalY + 15);
    doc.text('Class Teacher: .....................................................................', 20, doc.lastAutoTable.finalY + 25);
    doc.text('Head Teacher: .....................................................................', 20, doc.lastAutoTable.finalY + 31);
    doc.text(`Parents/Guardians: Ensure ${student.studentName || "the student"} does revision while at home.`, 20, doc.lastAutoTable.finalY + 40);
    doc.text('Provide learning materials to improve academic performance next term.', 20, doc.lastAutoTable.finalY + 46);

    // Stamp and date
    doc.setFontSize(10);
    doc.setTextColor(41, 128, 185);
    doc.text(`Dated: ${getFormattedDate()}`, 150, doc.lastAutoTable.finalY + 40);
    doc.text('SAMGE SCHOOL', 150, doc.lastAutoTable.finalY + 46);
    doc.text('Stamp & Signature', 150, doc.lastAutoTable.finalY + 52);

    // Save the PDF
    doc.save(`Report_Card_${student.regno || student.studentName}_${appliedFilters.class}_${appliedFilters.term}_${appliedFilters.year}.pdf`);
  } catch (error) {
    toast.error("Failed to export report card");
    console.error("Report card export error:", error);
  } finally {
    setGeneratingPDF(false);
  }
};

// Function to export all report cards as PDF
const exportAllReportCards = async () => {
  try {
    setGeneratingReportCards(true);
    
    // Create a new PDF document that will contain all report cards
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });

    // For each student, create a new page
    filteredData.forEach((student, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const studentTotal = student.subjects?.reduce((sum, subject) => sum + (subject.avgScore || 0), 0) || 0;
      const studentAverage = student.subjects?.length > 0 ? studentTotal / student.subjects.length : 0;

      // Set initial font settings
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);

      // School header
      doc.text('SAMGE SCHOOL', 105, 15, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('P.O. BOX 109-30102, Burnt Forest', 105, 22, { align: 'center' });
      doc.text('Tel: 0721790694', 105, 28, { align: 'center' });

      // Report title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('LEARNER PERFORMANCE REPORT CARD', 105, 40, { align: 'center' });

      // Student information
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Name: ${student.studentName || "-"}`, 20, 50);
      doc.text(`Admission No: ${student.regno || "-"}`, 20, 56);
      doc.text(`Class: ${appliedFilters.class}`, 20, 62);
      doc.text(`Stream: ${student.stream || "-"}`, 20, 68);
      
      doc.text(`Academic Year: ${appliedFilters.year}`, 150, 50);
      doc.text(`Term: ${appliedFilters.term}`, 150, 56);
      doc.text(`Total Marks: ${studentTotal.toFixed(0)}/${student.subjects?.length * 100 || 0}`, 150, 62);
      doc.text(`Average: ${studentAverage.toFixed(2)}% (${getRemark(studentAverage)})`, 150, 68);

      // Prepare subject data for the table
      const subjectHeaders = ['Subject', 'Teacher', 'Opener', 'Mid Term', 'End Term', 'Average', 'Remark'];
      const subjectData = student.subjects?.map(subject => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore].filter(score => score != null);
        const avgScore = scores.length > 0 ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
        return [
          subject.name || "-",
          subject.teacherName || "-",
          subject.openerScore ?? "-",
          subject.midTermScore ?? "-",
          subject.finalScore ?? "-",
          avgScore.toFixed(2),
          getRemark(avgScore)
        ];
      }) || [];

      // Add subjects table
      autoTable(doc, {
        head: [subjectHeaders],
        body: subjectData,
        startY: 80,
        styles: {
          cellPadding: 3,
          fontSize: 9,
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          lineWidth: 0.3
        }
      });

      // Grading key table
      const gradingHeaders = ['Grade', 'Range', 'Meaning'];
      const gradingData = [
        ['E.E', '75 - 100', 'Exceeding Expectation'],
        ['M.E', '50 - 74', 'Meeting Expectation'],
        ['B.E', '0 - 49', 'Below Expectation'],
        ['F', 'Cheated', 'Null and Void'],
        ['-', 'NULL', 'Missing/Never did exam']
      ];

      autoTable(doc, {
        head: [gradingHeaders],
        body: gradingData,
        startY: doc.lastAutoTable.finalY + 10,
        margin: { left: 20 },
        styles: {
          cellPadding: 3,
          fontSize: 9,
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          lineWidth: 0.3
        }
      });

      // Comments section
      doc.setFontSize(10);
      doc.text('COMMENTS:', 20, doc.lastAutoTable.finalY + 15);
      doc.text('Class Teacher: .....................................................................', 20, doc.lastAutoTable.finalY + 25);
      doc.text('Head Teacher: .....................................................................', 20, doc.lastAutoTable.finalY + 31);
      doc.text(`Parents/Guardians: Ensure ${student.studentName || "the student"} does revision while at home.`, 20, doc.lastAutoTable.finalY + 40);
      doc.text('Provide learning materials to improve academic performance next term.', 20, doc.lastAutoTable.finalY + 46);

      // Stamp and date
      doc.setFontSize(10);
      doc.setTextColor(41, 128, 185);
      doc.text(`Dated: ${getFormattedDate()}`, 150, doc.lastAutoTable.finalY + 40);
      doc.text('SAMGE SCHOOL', 150, doc.lastAutoTable.finalY + 46);
      doc.text('Stamp & Signature', 150, doc.lastAutoTable.finalY + 52);
    });

    // Save the PDF
    doc.save(`All_Report_Cards_${appliedFilters.class}_${appliedFilters.term}_${appliedFilters.year}.pdf`);
  } catch (error) {
    toast.error("Failed to export report cards");
    console.error("Report cards export error:", error);
  } finally {
    setGeneratingReportCards(false);
  }
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
             {/* Filter Section */}
        <div className="hidden md:grid p-4 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-2 px-3 bg-white shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-center max-w-48 text-sm border border-gray-300 py-2 px-3 rounded-md"
            placeholder="Search by name or regno"
          />
          
          {/* Class Select Dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Class</option>
            {clases.map((clase) => (
              <option key={clase._id} value={clase.clasename}>
                {clase.clasename}
              </option>
            ))}
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
          <ActionButton
            onClick={handleApplyFilters}
            disabled={loading || !selectedClass || !selectedYear || !selectedTerm}
            icon={FaSearch}
            label=""
            loadingLabel=""
            tooltip="Search "
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-700"
          />
        </div>
          <UserAccount />
        </div>

        {/* Filter Section */}
        <div className="grid md:hidden p-4 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-2 px-3 bg-white shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-center max-w-48 text-sm border border-gray-300 py-2 px-3 rounded-md"
            placeholder="Search by name or regno"
          />
          
          {/* Class Select Dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border max-w-48 border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Class</option>
            {clases.map((clase) => (
              <option key={clase._id} value={clase.clasename}>
                {clase.clasename}
              </option>
            ))}
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

        {/* Action Buttons Section */}
        {data.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:mx-10 mx-5 mt-4 gap-4">
            <div className="flex gap-2">
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
                View Reports
              </button>
              <ActionButton
                onClick={exportAllReportCards}
                disabled={generatingReportCards}
                icon={FaFileDownload}
                label=""
                loadingLabel="Downloading..."
                tooltip="Download PDF report cards for all students"
                bgColor="bg-purple-600"
                hoverColor="hover:bg-purple-700"
              />
            </div>
            <div className="flex gap-2">
            <ActionButton
                onClick={exportToPDF}
                disabled={generatingPDF}
                icon={FaFilePdf}
                label="PDF"
                loadingLabel="Generating..."
                tooltip="Export class summary as PDF"
                bgColor="bg-red-600"
                hoverColor="hover:bg-red-700"
              />
             <ActionButton
                onClick={exportToExcel}
                disabled={generatingExcel}
                icon={FaFileExcel}
                label="Excel"
                loadingLabel="..."
                tooltip="Export data to Excel spreadsheet"
                bgColor="bg-green-600"
                hoverColor="hover:bg-green-700"
              />
            </div>
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
            <div>
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
                  <tr className="bg-gray-200">
                    <th className="border px-3 sticky top-0 bg-white py-2">Name</th>
                    <th className="border px-3 sticky top-0 bg-white py-2">Reg No</th>
                    <th className="border px-3 sticky top-0 bg-white py-2">Stream</th>
                    {subjectTotalsAndAverages.map((subjectStat, index) => (
                      <th key={index} className="border sticky top-0 bg-white py-2">
                        <p className="text-yellow-600">{index + 1}</p>
                        <p className="px-3 text-sm">{subjectStat.code}</p>
                      </th>
                    ))}
                    <th className="border sticky top-0 bg-white py-2">Total</th>
                    <th className="border sticky top-0 bg-white py-2">Average</th>
                    <th className="border sticky top-0 bg-white py-2">Actions</th>
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
                        <td className="border px-3 py-2">
                        <ActionButton
              onClick={() => exportReportCard(student)}
              icon={FaFilePdf}
              label="card"
              tooltip="Download learner report card"
              bgColor="bg-blue-600"
              hoverColor="hover:bg-blue-700"
              className="text-sm"
            />
                        </td>
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
                    <td className="border px-3 py-2"></td>
                  </tr>
                  <tr className="font-bold bg-gray-200">
                    <td colSpan={3} className="border px-3 py-2">Average</td>
                    {subjectTotalsAndAverages.map((subjectStat, index) => (
                      <td key={index} className="border px-3 py-2">
                        {subjectStat.average.toFixed(2)}
                      </td>
                    ))}
                    <td className="border px-3 py-2">{classStats.average.toFixed(2)}</td>
                    <td className="border px-3 py-2"></td>
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