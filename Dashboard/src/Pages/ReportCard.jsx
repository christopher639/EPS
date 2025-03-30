import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserAccount from '../components/UserAccount';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Corrected import
import { toast } from 'react-toastify';

const ReportCard = () => {
  const [sideBar, setSideBar] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { state } = useLocation();
  const { data, classValue, yearValue, termValue } = state || {};
  const [searchQuery, setSearchQuery] = useState("");

  if (!data) {
    return <div className="text-center text-lg text-red-500">No data available</div>;
  }

  const filteredData = data.filter(
    (student) =>
      String(student.regno).toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.stream.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const exportToPDF = () => {
    try {
      setGeneratingPDF(true);
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });

      // Set document properties
      doc.setProperties({
        title: `Student Report Cards - ${classValue} ${termValue} ${yearValue}`,
        subject: 'Student Academic Report',
        author: 'SAMGE School',
        keywords: 'report, card, academic',
        creator: 'SAMGE School System'
      });

      // For each student, create a new page
      filteredData.forEach((student, index) => {
        if (index > 0) {
          doc.addPage();
        }

        const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
        const studentAverage = studentTotal / student.subjects.length;

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
        doc.text(`Name: ${student.studentName}`, 20, 50);
        doc.text(`Admission No: ${student.regno}`, 20, 56);
        doc.text(`Class: ${classValue}`, 20, 62);
        doc.text(`Stream: ${student.stream}`, 20, 68);
        
        doc.text(`Academic Year: ${yearValue}`, 150, 50);
        doc.text(`Term: ${termValue}`, 150, 56);
        doc.text(`Total Marks: ${studentTotal.toFixed(0)}/${student.subjects.length * 100}`, 150, 62);
        doc.text(`Average: ${studentAverage.toFixed(2)}% (${getRemark(studentAverage)})`, 150, 68);

        // Prepare subject data for the table
        const subjectHeaders = ['Subject', 'Teacher', 'Opener', 'Mid Term', 'End Term', 'Average', 'Remark'];
        const subjectData = student.subjects.map(subject => {
          const score = (subject.openerScore + subject.midTermScore + subject.finalScore) / 3;
          return [
            subject.name,
            subject.teacherName,
            subject.openerScore ?? "-",
            subject.midTermScore ?? "-",
            subject.finalScore ?? "-",
            score.toFixed(2),
            getRemark(score)
          ];
        });

        // Add subjects table
        doc.autoTable({
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

        doc.autoTable({
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
        doc.text(`Parents/Guardians: Ensure ${student.studentName} does revision while at home.`, 20, doc.lastAutoTable.finalY + 40);
        doc.text('Provide learning materials to improve academic performance next term.', 20, doc.lastAutoTable.finalY + 46);

        // Stamp and date
        doc.setFontSize(10);
        doc.setTextColor(41, 128, 185);
        doc.text(`Dated: ${getFormattedDate()}`, 150, doc.lastAutoTable.finalY + 40);
        doc.text('SAMGE SCHOOL', 150, doc.lastAutoTable.finalY + 46);
        doc.text('Stamp & Signature', 150, doc.lastAutoTable.finalY + 52);
      });

      // Save the PDF
      doc.save(`Student_Report_Cards_${classValue}_${termValue}_${yearValue}.pdf`);
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className='flex'>
      <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar/>
      </div>
      <div className="bg-gray-50 w-full">
        <div className='flex px-4 justify-between items-center bg-white shadow-sm border-b'>
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <div className='flex items-center gap-2'>
            <div className="hidden sm:flex sm:w-auto mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg max-w-32"
              />
            </div>
            <h1 className="text-xl py-3 font-bold text-gray-800 sm:text-sm md:text-md lg:text-lg hidden md:flex">SAMGE SCHOOL</h1>
            <p className="text-gray-500 hidden md:flex">Student Report Cards</p>
          </div>
          <div>
            <UserAccount/>
          </div>
        </div>

        <div className="container min-w-full p-4 bg-white shadow-lg rounded-lg overflow-y-scroll max-h-[90vh] pb-2 overflow-x-auto">
          {filteredData.map((student, index) => {
            const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
            const studentAverage = studentTotal / student.subjects.length;
            
            return (
              <div key={index} className="mb-8 p-4 border rounded-lg">
                <div className='flex justify-between items-center mb-4'>
                  <div className='flex items-center gap-4'>
                    <img
                      className='w-20 h-20 rounded-full border'
                      src={student.studentImage ? `https://localhost:3000${student.studentImage}` : '/avater.jpeg'}
                      alt="Student"
                    />
                    <div>
                      <h2 className='text-lg font-bold'>{student.studentName}</h2>
                      <p>Admission No: <span className="font-semibold">{student.regno}</span></p>
                      <p>Class: <span className="font-semibold">{classValue} {student.stream}</span></p>
                    </div>
                  </div>
                  <div className='text-center'>
                    <img
                      src="lion.jpg"
                      alt="School Logo"
                      className="w-20 h-20 mx-auto"
                    />
                    <h3 className='font-bold'>SAMGE SCHOOL</h3>
                  </div>
                </div>

                <div className='text-center mb-4'>
                  <h3 className='text-lg font-bold'>LEARNER PERFORMANCE REPORT CARD</h3>
                  <div className='flex justify-center gap-4'>
                    <p>Academic Year: <span className="font-semibold">{yearValue}</span></p>
                    <p>Term: <span className="font-semibold">{termValue}</span></p>
                    <p>Total: <span className="font-semibold">{studentTotal.toFixed(0)}/{student.subjects.length * 100}</span></p>
                    <p>Average: <span className="font-semibold">{studentAverage.toFixed(2)}%</span></p>
                    <p>Grade: <span className="font-semibold">{getRemark(studentAverage)}</span></p>
                  </div>
                </div>

                <table className="min-w-full border text-center mb-4">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">Teacher</th>
                      <th className="border p-2">Opener</th>
                      <th className="border p-2">Mid Term</th>
                      <th className="border p-2">End Term</th>
                      <th className="border p-2">Average</th>
                      <th className="border p-2">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.map((subject, subIndex) => {
                      const score = (subject.openerScore + subject.midTermScore + subject.finalScore) / 3;
                      return (
                        <tr key={subIndex}>
                          <td className="border p-2">{subject.name}</td>
                          <td className="border p-2">{subject.teacherName}</td>
                          <td className="border p-2">{subject.openerScore ?? "-"}</td>
                          <td className="border p-2">{subject.midTermScore ?? "-"}</td>
                          <td className="border p-2">{subject.finalScore ?? "-"}</td>
                          <td className="border p-2 font-semibold">{score.toFixed(2)}</td>
                          <td className="border p-2 font-semibold">{getRemark(score)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='w-full md:w-1/2'>
                    <h4 className='font-bold mb-2'>GRADING KEY</h4>
                    <table className="w-full border">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border p-2">Grade</th>
                          <th className="border p-2">Range</th>
                          <th className="border p-2">Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">E.E</td>
                          <td className="border p-2">75 - 100</td>
                          <td className="border p-2">Exceeding Expectation</td>
                        </tr>
                        <tr>
                          <td className="border p-2">M.E</td>
                          <td className="border p-2">50 - 74</td>
                          <td className="border p-2">Meeting Expectation</td>
                        </tr>
                        <tr>
                          <td className="border p-2">B.E</td>
                          <td className="border p-2">0 - 49</td>
                          <td className="border p-2">Below Expectation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className='w-full md:w-1/2'>
                    <h4 className='font-bold mb-2'>COMMENTS</h4>
                    <div className='border p-4'>
                      <p className='mb-4'>Class Teacher: .....................................................................</p>
                      <p className='mb-4'>Head Teacher: .....................................................................</p>
                      <p>Parents/Guardians: Ensure {student.studentName} does revision while at home. Always provide him with learning material to improve on academics coming next term.</p>
                    </div>
                  </div>
                </div>

                <div className='mt-4 text-right italic'>
                  <p>Dated: {getFormattedDate()}</p>
                  <p>Stamp & Signature</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;