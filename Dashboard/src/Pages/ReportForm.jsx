import React from 'react';
import { useLocation } from 'react-router-dom';

const ReportForm = () => {
  const location = useLocation();
  const { marksData, subjectHeaders } = location.state || {}; // Destructure data passed via location

  if (!marksData || !subjectHeaders) {
    return <div>Error: No data passed from the previous page.</div>;
  }

  // Function to get remarks based on the score
  const getRemark = (score) => {
    if (score >= 75) return "E.E"; // Exceeding Expectation
    if (score >= 50) return "M.E"; // Meeting Expectation
    if (score >= 0) return "B.E";  // Below Expectation
    return "F";                    // Failed or not attended
  };

  // Function to handle printing each report card
  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  return (
   <div>
    <div className='flex justify-between px-5 mx-2'>
      <div>search</div>
      <div>
      <button onClick={handlePrint}  className="text-center px-3 text-slate-500 text-sm w-full  border border-1 border-slate-700 font-bold     py-2 rounded hover:text-slate-900">
            Print Reports
          </button>
      </div>
    </div>

     <div id="printableTable" className='flex min-w-full max-h-[82vh] flex-col gap-4  overflow-y-auto overflow-x-hidden'>
      {/* Render each student's report card */}
      {marksData.map((student, index) => {
        // Ensure student.marks exists and is an array
        const marks = student.marks || [];
        // Safe check for student fields before calling `toUpperCase()`
        const studentName = student.name ? student.name.toUpperCase() : 'N/A';
        const regNo = student.regno || 'N/A';
        const stream = student.stream || 'N/A';

        return (
          <div key={index} className="page-break" >
            {/* Header with student personal details */}
            <div className="text-center">
              <img
                src="KIbabii-Logo.png"
                alt="School Logo"
                className="w-[54px] h-[54px] mx-auto "
              /> 
            </div>
             <div className='flex justify-between mx-5'>
             <p className="text-sm font-semibold text-yellow-800">{studentName}</p>
             <p>Reg No: <span className="font-semibold text-yellow-800">{regNo}</span></p>
             <p>Stream: <span className="font-semibold text-yellow-800">{stream}</span></p>
             <p><strong >Avg:</strong><strong className='text-yellow-800'>{(marks.reduce((sum, mark) => sum + mark.score, 0) / marks.length).toFixed(2)}</strong></p>
             <p><strong>Grade:</strong> <strong className='text-yellow-800'>{getRemark(marks.reduce((sum, mark) => sum + mark.score, 0) / marks.length)}</strong></p>
             </div>
            
            <div className="">
              <div className="flex justify-between">
      
              </div>
            </div>
            {/* Marks Table */}
            <div className="">
              <table className="w-full  table-auto">
                <thead className="text-sm text-left">
                  <tr>
                    <th className="border-b border-slate-700 p-2">Subject</th>
                    <th className="border-b border-slate-700 text-center p-2">Score</th>
                    <th className="border-b border-slate-700 text-center p-2">Remark</th>
                  </tr>
                </thead>
                <tbody className=''>
                  {/* Ensure subjectHeaders is valid before mapping */}
                  {subjectHeaders && subjectHeaders.length > 0 ? subjectHeaders.map((subject, idx) => {
                    const mark = marks.find((m) => m.subjectCode === subject);
                    const score = mark ? mark.score : "-";
                    return (
                      <tr key={idx} className="text-sm  ">
                        <td className="border border-slate-800  p-2">{subject ? subject.toUpperCase() : 'N/A'}</td>
                        <td className="border border-slate-800 text-center p-2 text-center">{score}</td>
                        <td className="border border-slate-800 p-2 text-center">{getRemark(score)}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="3" className="text-center">No subjects available</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className='flex flex-col md:flex-row gap-5 mt-5'>
                    <div className=' w-full'>
                      <table className='w-full'>
                      
                          <tr >
                            <td className='font-bold text-black'>REMARK</td>
                            <td className='font-bold text-black'>RANGE</td>
                            <td className='font-bold text-black'>MEANING</td>
                          </tr>
                        
          
                        <tbody>
                          <tr>
                            <td>E.E</td>
                            <td>75 -100</td>
                            <td>Exceeding Expectation</td>
                          </tr>
                          <tr>
                            <td>M.E</td>
                            <td>50 -74</td>
                            <td>Meeting Expectation</td>
                          </tr>
                          <tr>
                            <td>B.E</td>
                            <td>0 -49</td>
                            <td>Below Expectation</td>
                          </tr>
                          <tr>
                            <td>F</td>
                            <td>NULL</td>
                            <td>Never did exam</td>
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
            {/* Button to print individual student report */}
           
          </div>
        );
      })}
    </div>
   </div>
  );
};

export default ReportForm;
