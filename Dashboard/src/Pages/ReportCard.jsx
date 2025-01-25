import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserAccount from '../components/UserAccount';

const ReportCard = () => {
  const { state } = useLocation(); // Retrieve the state passed from GeneralReport
  const { data, classValue, yearValue, termValue } = state || {}; // Destructure the data

  const [searchQuery, setSearchQuery] = useState(""); // State for managing the search query

  if (!data) {
    return <div className="text-center text-lg text-red-500">No data available</div>;
  }

  // Function to filter data based on search query (RegNo or Stream)
  const filteredData = data.filter(
    (student) =>
      String(student.regno).toLowerCase().includes(searchQuery.toLowerCase()) || // Convert regno to string
      student.stream.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to format the current date
  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th)
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th'; // Handle 11th, 12th, 13th, etc.
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");

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
    printWindow.document.write(`<style>${styles}
      #bo { border: 1px solid black; }
      #floating-stamp {
        position: absolute;
        bottom: 1.25rem; /* 5 * 0.25rem */
        right: 180px; /* Position from the right */
        transform: rotate(-12deg);
        background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent */
        border: 2px solid #1e40af; /* border-blue-900 */
        padding: 0.5rem; /* p-2 */
        max-width: 28rem; /* max-w-md */
        max-height: auto; /* max-h-auto */
        text-align: center;
        font-family: 'Sans-Serif', Arial, sans-serif; /* font-sans */
        z-index: 10;
        pointer-events: none;
        opacity: 0.4; /* Make the stamp slightly transparent */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Add a shadow for a realistic effect */
      }
      @media print {
        #floating-stamp {
          opacity: 0.8; /* Make the stamp slightly transparent when printing */
          background-color: rgba(255, 255, 255, 0.8); /* Ensure the background is visible */
        }
      }
    </style>`); // Include the styles in the print window
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
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

  // Function to get remarks based on average score
  const getRemark = (score) => {
    if (score >= 75) return "E.E"; // Exceeding Expectation
    if (score >= 50) return "M.E"; // Meeting Expectation
    if (score >= 0) return "B.E"; // Below Expectation
    return "F"; // Failed or not attended
  };

  return (
    <div className="p-4 bg-gray-50">
     <div className='flex justify-between'>
      <div>
         <h2 className="text-2xl font-bold text-center mb-6">Student Report Card</h2>
      </div>
      <div>
         <UserAccount/>
      </div>
     </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mx-4">
        {/* Search Input */}
        <div className="hidden sm:flex w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search by RegNo or Stream"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-center sm:text-left">
          <p>
            <strong>Class:</strong> {classValue}
          </p>
          <p>
            <strong>Academic Year:</strong> {yearValue}
          </p>
          <p>
            <strong>Term:</strong> {termValue}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-green-800 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition mt-4 sm:mt-0"
        >
          Print Sheet
        </button>
      </div>

      {/* Search Input for Mobile */}
      <div className="sm:hidden mb-4 mx-4">
        <input
          type="text"
          placeholder="Search by RegNo or Stream"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <div id="printableTable" className="container p-4 bg-white shadow-lg rounded-lg overflow-y-scroll max-h-[84vh]">
        {/* Loop through the filtered student data and display the report */}
        {filteredData.map((student, index) =>{
            const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
            const studentAverage = studentTotal / student.subjects.length;
          return ( 
          <div key={index} className="page-break relative mb-8">
            <div className="mb-6 p-4 bg-white">
              <div className="text-center">
                <img
                  src="KIbabii-Logo.png"
                  alt="School Logo"
                  className="w-14 h-14 mx-auto"
                />
              </div>
              <div className="text-center flex justify-center mb-4">
                <div className="flex gap-5">
                  <p>
                    <strong>Class:</strong> {classValue}
                  </p>
                  <p>
                  Stream: <span className="font-bold text-yellow-800">{student.stream}</span>
                </p>
                  <p>
                    <strong>Academic Year:</strong> {yearValue}
                  </p>
                  <p>
                    <strong>Term:</strong> <span className="text-yellow-700">{termValue}</span>
                  </p>
                </div>
              </div>
              {/* Display the total score and average */}
              <div className="mt-4 text-center flex flex-col sm:flex-row justify-between">
                <p>Name: <span className='font-bold text-yellow-800' >{student.studentName}</span></p>
                <p>
                  RegNo: <span className="font-bold text-yellow-800">{student.regno}</span>
                </p>
               
                <p>
                  <strong>Total:</strong> {studentTotal.toFixed(0)}/
                 <span>{ student.subjects.length * 100}</span> </p>
                <p>
                  <strong>Mean:</strong> {studentAverage.toFixed(2)} <span>%</span>
                </p>
                <p>
                  <strong>Grade:</strong> <span className="font-bold text-yellow-800">{getRemark(studentAverage)}</span>
                </p>
              </div>

              <table className="min-w-full table-auto text-center mt-4 border-collapse">
                <thead>
                  <tr id="bo" className="bg-gray-200">
                    <th id="bo" className="border px-3 py-2">
                      Code
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Title
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Tought_By
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Opener
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Mid_Term
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      End_Term
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Average
                    </th>
                    <th id="bo" className="border px-3 py-2">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((subject, subIndex) => {
                    const score =
                      (subject.openerScore +
                        subject.midTermScore +
                        subject.finalScore) /
                      3;

                    return (
                      <tr id="bo" key={subIndex} className="border-b">
                        <td id="bo" className="border px-3 py-2">
                          {subject.code}
                        </td>
                        <td id="bo" className="border px-3 py-2">
                          {subject.name}
                        </td>
                        <td id="bo" className="border px-3 py-2">
                          {subject.teacherName}
                        </td>
                        <td id="bo" className="border px-3 py-2">
                          {subject.openerScore ?? "-"}
                        </td>
                        <td id="bo" className="border px-3 py-2">
                          {subject.midTermScore ?? "-"}
                        </td>
                        <td id="bo" className="border px-3 py-2">
                          {subject.finalScore ?? "-"}
                        </td>
                        <td
                          id="bo"
                          className="border px-3 text-yellow-700 py-2"
                        >
                          {score.toFixed(2)}
                        </td>
                        <td
                          id="bo"
                          className="border font-semibold px-3 text-yellow-800 py-2"
                        >
                          {getRemark(score)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex flex-col md:flex-row gap-5 mt-5">
                <div className="w-full">
                  <table className="w-full">
                    <tr>
                      <td className="font-bold text-black">KEY</td>
                      <td className="font-bold text-black">RANGE</td>
                      <td className="font-bold text-black">MEANING</td>
                    </tr>
                    <tbody>
                      <tr>
                        <td>E.E</td>
                        <td>75 - 100</td>
                        <td>Exceeding Expectation</td>
                      </tr>
                      <tr>
                        <td>M.E</td>
                        <td>50 - 74</td>
                        <td>Meeting Expectation</td>
                      </tr>
                      <tr>
                        <td>B.E</td>
                        <td>0 - 49</td>
                        <td>Below Expectation</td>
                      </tr>
                      <tr>
                        <td>F</td>
                        <td>Cheated</td>
                        <td>Null and Void</td>
                      </tr>
                      <tr>
                        <td>-</td>
                        <td>NULL</td>
                        <td>Missing/Never did exam</td>
                      </tr>
                      <tr>
                        <td>AVG</td>
                        <td></td>
                        <td>Average</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Floating Stamp */}
            <div id="floating-stamp"
              className="absolute bottom-10 right-40 transform rotate-12 bg-white bg-opacity-80 border-2 border-blue-900 p-2 max-w-md max-h-auto text-center font-sans"
              style={{ pointerEvents: "none" }} // Ensures it doesn't block interaction with underlying content
            >
              <h2 className="text-blue-900 text-sm font-bold">
                Dated - {getFormattedDate()} {/* Dynamically display the current date */}
              </h2>
              <p className="font-semibold">Bungoma High School</p>
              <p className="text-sm">
                Period: <strong>{yearValue} - {termValue}</strong>
              </p>
              <p className="text-sm">Class Master____________</p>
              <p className="text-blue-900 text-sm">www.bungomahigh.ac.ke</p>
              <p className="text-sm">
                P.O. BOX 123 - 50200, BUNGOMA
              </p>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default ReportCard;