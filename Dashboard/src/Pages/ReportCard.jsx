import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ReportCard = () => {
  const { state } = useLocation();  // Retrieve the state passed from GeneralReport
  const { data, classValue, yearValue, termValue } = state || {};  // Destructure the data

  const [searchQuery, setSearchQuery] = useState(""); // State for managing the search query

  if (!data) {
    return <div className="text-center text-lg text-red-500">No data available</div>;
  }

  // Function to filter data based on search query (RegNo or Stream)
// Function to filter data based on search query (RegNo or Stream)
const filteredData = data.filter(
  (student) =>
    String(student.regno).toLowerCase().includes(searchQuery.toLowerCase()) || // Convert regno to string
    student.stream.toLowerCase().includes(searchQuery.toLowerCase())
);


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
    printWindow.document.write(`<style>${styles} #bo{border:1px solid black}</style>`);  // Include the styles in the print window
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
    if (score >= 0) return "B.E";  // Below Expectation
    return "F";                    // Failed or not attended
  };

  return (
   <div>
     <h2 className="text-xl font-bold text-center mb-6">Student Report Card</h2>
     
   

     <div className="text-center flex justify-between mx-5 mb-4">
         {/* Search Input */}
     <div className="text-center hidden sm:flex ">
       <input
         type="text"
         placeholder="Search by RegNo or Stream"
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         className="p-2 border border-gray-300 rounded-lg min-w-full max-w-sm"
       />
     </div>
        <p><strong>Class:</strong> {classValue}</p>
        <p><strong>Academic Year:</strong> {yearValue}</p>
        <p><strong>Term:</strong> {termValue}</p>
        <button
          onClick={handlePrint}
          className="bg-green-800 max-w-32 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
        >
          Print Sheet
        </button>
      </div>

        {/* Search Input */}
     <div className="text-center sm:hidden mb-4">
       <input
         type="text"
         placeholder="Search by RegNo or Stream"
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         className="p-2 border border-gray-300 rounded-lg w-full max-w-sm"
       />
     </div>

     <div id="printableTable" className="container p-4 bg-gray-50 overflow-y-scroll max-h-[84vh]">
      {/* Loop through the filtered student data and display the report */}
      {filteredData.map((student, index) => (
      <div  key={index} className="page-break">
          <div  className="mb-6 border p-4 rounded-lg  bg-white">
            <div className="text-center">
              <img
                src="KIbabii-Logo.png"
                alt="School Logo"
                className="w-[54px] h-[54px] mx-auto "
              /> 
            </div>
           <div className="text-center flex justify-center  mb-4">
            
       <div className='flex gap-5'>
       <p><strong>Class:</strong> {classValue}</p>
        <p><strong>Academic Year:</strong> {yearValue}</p>
        <p><strong>Term:</strong> <span className='text-yellow-700'>{termValue}</span></p>
       </div>
      </div>
        {/* Display the total score and average */}
        <div className="mt-4 text-center flex justify-between">
        <p>{student.name}</p>
            <p>RegNo:<span className="font-bold text-yellow-800">{student.regno}</span></p>
            <p>Stream:<span  className="font-bold text-yellow-800">{student.stream}</span></p>
            <p><strong>Total Score:</strong> {student.totalScore.toFixed(2)}</p>
            <p><strong>Mean Score:</strong> {student.avgScore.toFixed(2)} <span>%</span></p>
            <p><strong>Grade:</strong> <span className="font-bold text-yellow-800">{getRemark(student.avgScore)}</span></p>
          </div>
      
          <table className="min-w-full table-auto text-center mt-4 border-collapse">
            <thead>
              <tr id='bo' className="bg-gray-200">
                <th  id='bo' className="border px-3 py-2">Code</th>
                <th  id='bo' className="border px-3 py-2">Opener</th>
                <th id='bo' className="border px-3 py-2">Mid_term</th>
                <th id='bo' className="border px-3 py-2">End_term</th>
                <th id='bo' className="border px-3 py-2">AVG Score</th>
                <th  id='bo' className="border px-3 py-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, subIndex) => {
                const score = (subject.openerScore + subject.midTermScore + subject.finalScore) / 3;

                return (
                  <tr id='bo' key={subIndex} className="border-b">
                     <td  id='bo' className="border px-3   py-2">{subject.code}</td>
                    <td id='bo' className="border px-3  py-2">{subject.openerScore ?? "-"}</td>
                    <td id='bo' className="border px-3  py-2">{subject.midTermScore ?? "-"}</td>
                    <td id='bo' className="border px-3  py-2">{subject.finalScore ?? "-"}</td>
                    <td id='bo' className="border px-3 text-yellow-700  py-2">{score.toFixed(2)}</td>
                    <td id='bo' className="border font-semibold px-3 text-yellow-800 py-2">{getRemark(score)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='flex flex-col md:flex-row gap-5 mt-5'>
                    <div className=' w-full'>
                      <table className='w-full'>
                       <tr >
                            <td className='font-bold text-black'>KEY</td>
                            <td className='font-bold text-black'>RANGE</td>
                            <td className='font-bold text-black'>MEANING</td>
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
                          <tr >
                            <td>AVG</td>
                            <td></td>
                            <td>Average</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
        </div>
      </div>
      ))}
    </div>
   </div>
  );
};

export default ReportCard;
