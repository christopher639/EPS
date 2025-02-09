import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserAccount from '../components/UserAccount';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';

const ReportCard = () => {
   const [sideBar, setSideBar] = useState(true); // To control the visibility of the sidebar
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
      /* Reduce text size and adjust layout for printing */
      body {
        font-size: 16px !important; /* Smaller font size */
        margin: 0;
        padding: 0;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      th, td {
        padding: 5px !important; /* Reduce padding */
        font-size: 14px !important; /* Smaller font size */
      }
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

  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };
  return (
   <div className='flex '>
       <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}
      >
        <SideBar/> {/* Conditionally render based on sidebar state */}
      </div>
     <div className=" bg-gray-50  ">
     <div className='flex px-4 justify-between items-center bg-white shadow-sm  border-b'>
        <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
     <div className='flex items-center gap-2'>
          <h1 className="text-xl py-3 font-bold text-gray-800 sm:text-sm md:text-md lg:text-lg">SAMGE SCHOOL</h1>
          <p className="text-gray-500">Student Report Cards</p>
        </div>
      <div>
         <UserAccount/>
      </div>
     </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-2  items-center mb-6 mx-4">
        {/* Search Input */}
        <div className="hidden sm:flex  sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border  border-gray-300 rounded-lg max-w-32 "
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
          className="bg-green-800 max-w-32 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition mt-4 sm:mt-0"
        >
          Print Sheet
        </button>
      </div>

      {/* Search Input for Mobile */}
      <div className="sm:hidden mb-4 mx-4">
        <input
          type="text"
          placeholder="Search "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg  "
        />
      </div>

      <div id="printableTable" className="container p-4 bg-white shadow-lg rounded-lg overflow-y-scroll max-h-[78vh] pb-2">
        {/* Loop through the filtered student data and display the report */}
        {filteredData.map((student, index) =>{
            const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
            const studentAverage = studentTotal / student.subjects.length;
          return ( 
          <div key={index} className="page-break relative mb-4">
            <div className="mb-3 p-2 bg-white">
             <div className='flex justify-between w-3/4'>
              <div>
                
              <img
          className='w-20 h-20 rounded-full'
          src={student.studentImage ? `http://localhost:3000${student.studentImage}` : '/avater.jpeg'}
          alt="Student"
        />
              </div>
              <p className='text-lg font-semibold'>SAMGE</p>
             <div className="text-center">
                <img
                  src="lion.jpg"
                  alt="School Logo"
                  className="w-[110px] h-[108px] mx-auto"
                />
              </div>
              <p className='text-lg font-semibold'>SCHOOL</p>
             </div>
            <div className='flex  justify-center'>
            <div>
            <p className='font-semibold text-lg'>Lerner Performance Report Card</p>
            </div>
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
                    {/* <th id="bo" className="border text-left pl-1 py-2">
                      Code
                    </th> */}
                    <th id="bo" className="border px-1 py-2">
                      Title
                    </th>
                    <th id="bo" className="border px-1 py-2">
                      Tought_By
                    </th>
                    <th id="bo" className="border px-1 py-2">
                      Opener
                    </th>
                    <th id="bo" className="border px-1 py-2">
                      Mid_Term
                    </th>
                    <th id="bo" className="border px-1 py-2">
                      End_Term
                    </th>
                    <th id="bo" className="border px-1 py-2">
                      Average
                    </th>
                    <th id="bo" className="border px-1 py-2">
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
                        {/* <td id="bo" className="border text-left px-1 py-2">
                          {subject.code}
                        </td> */}
                        <td id="bo" className="border px-1 py-2">
                          {subject.name}
                        </td>
                        <td id="bo" className="border px-1 py-2">
                          {subject.teacherName}
                        </td>
                        <td id="bo" className="border px-1 py-2">
                          {subject.openerScore ?? "-"}
                        </td>
                        <td id="bo" className="border px-1 py-2">
                          {subject.midTermScore ?? "-"}
                        </td>
                        <td id="bo" className="border px-1 py-2">
                          {subject.finalScore ?? "-"}
                        </td>
                        <td
                          id="bo"
                          className="border px-1 text-yellow-700 py-2"
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
              <div className="flex flex-col md:flex-row gap-1 mt-2">
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
                <div className='w-3/4'>
                  <p>Parents or gurdians to {student.studentName} make sure the student does some revision while at home.Alway provide him with learning material to impove on academics coming next term </p>
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
              
              <p className="font-semibold">Samge Bording School</p>
              <p className="text-sm">
                Period: <strong>{yearValue} - {termValue}</strong>
              </p>
              <p className="text-sm">Class Master____________</p>
              <p className="text-blue-900 text-sm">Cell: 0721790694</p>
              <p className="text-sm">
                P.O. BOX 109-30102, Burnt Forest
              </p>
            </div>
          </div>
        )})}
      </div>
    </div>
   </div>
  );
};

export default ReportCard;