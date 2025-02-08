
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
const MergedReportForm = () => {
  const location = useLocation();
  // Destructure marksData, year, stream, and term from location.state
  const { marksData, year, stream, term } = location.state || {};
    console.log(marksData)
  if (!marksData || marksData.length === 0) {
    console.log("Do data")
  }
  // State for the filter input
  const [filterRegno, setFilterRegno] = useState("");
  // Function to handle printing the report card
  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  // Group marks by RegNo
  const groupedByRegNo = marksData.reduce((acc, mark) => {
    if (!acc[mark.regno]) {
      acc[mark.regno] = [];
    }
    acc[mark.regno].push(mark);
    return acc;
  }, {});
  // Function to calculate the average score of a student for a subject
  const calculateSubjectAverage = (scores) => {
    const validScores = scores.filter(score => score !== "-"); // Remove invalid scores
    const totalScore = validScores.reduce((sum, score) => sum + score, 0);
    return totalScore / validScores.length || 0; // Avoid dividing by zero
  };
  // Function to calculate the overall average for the student
  const calculateOverallAverage = (studentMarks) => {
    const subjectAverages = studentMarks.map(mark => {
      const openerScore = mark.scores.find(score => score.examCategory === 'opener')?.score || "-";
      const midTermScore = mark.scores.find(score => score.examCategory === 'mid-term')?.score || "-";
      const finalScore = mark.scores.find(score => score.examCategory === 'final')?.score || "-";
      return calculateSubjectAverage([openerScore, midTermScore, finalScore]);
    });
    const totalAverage = subjectAverages.reduce((sum, avg) => sum + avg, 0);
    return totalAverage / subjectAverages.length || 0; // Avoid dividing by zero
  };
  // Function to get the remark based on the score
  const getRemark = (score) => {
    if (score >= 75) return "E.E"; // Exceeding Expectation
    if (score >= 50) return "M.E"; // Meeting Expectation
    if (score >= 0) return "B.E";  // Below Expectation
    return "F";                    // Failed or not attended
  };
  // Filtered data based on the filterRegno state
  const filteredByRegno = Object.keys(groupedByRegNo).filter((regno) => {
    return regno.includes(filterRegno);
  });
  return (
    <div>
      <div className='flex w-full justify-between'>
         {/* Filter by RegNo Input */}
       <div className="text-center mb-4">
        <input
          type="text"
          placeholder="Search by RegNo"
          value={filterRegno}
          onChange={(e) => setFilterRegno(e.target.value)}
          className="px-3 py-2 border border-slate-500 text-sm w-full max-w-xs mx-auto mb-2"
        />
      </div>
      {/* Print button */}
      <div className="text-center mb-4">
        <button onClick={handlePrint} className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900">
          Print Reports
        </button>
      </div>
      </div>
      {/* Render Report Cards */}
      <div id="printableTable" style={{ maxHeight: '430px', overflowY: 'auto', overflowX: 'auto' }}>
        {filteredByRegno.length === 0 ? (
          <p>No data found</p>
        ) : (
          <>
            {filteredByRegno.map((regno) => {
              const studentMarks = groupedByRegNo[regno];
              const overallAverage = calculateOverallAverage(studentMarks);
              const overallRemark = getRemark(overallAverage); // Get general remark for overall average
              const studentStream = studentMarks[0]?.stream || stream; // Stream for each student
              const studentYear = studentMarks[0]?.year || year; // If stream or year not in mark, use from location.state
              const studentTerm = studentMarks[0]?.term || term; // Similarly, if term not in mark, use from location.state

              return (
                <div key={regno} className="page-break" style={{ marginBottom: '20px', border: '', padding: '10px' }}>
                  <div className="text-center">
                    <img
                      src="lion.jpg"
                      alt="School Logo"
                      className="w-[54px] h-[54px] mx-auto"
                    />
                  </div>
                  {/* Display Stream, Year, and Term below the Logo */}
                  <div className="text-center ">
                    <p><strong>Year: </strong>{studentYear}</p>
                    <p><strong>Term: </strong>{studentTerm}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-yellow-800">Reg No: <span>{regno}</span></p>
                    <p><strong>Stream: </strong><span className='text-yellow-700'>{studentStream}</span></p>
                    <p><strong>Avg:</strong> <strong className='text-yellow-800'>{overallAverage.toFixed(2)}</strong> 
                       <span className='pl-5'>Remark</span>  <span className="ml-2 text-sm text-yellow-700 font-semibold">{overallRemark}</span></p>
                  </div>
                  <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Subject</th>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Opener Score</th>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Mid-Term Score</th>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Final Score</th>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Average Score</th>
                        <th style={{ border: '1px solid black', padding: '1px' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.map((mark, index) => {
                        const openerScore = mark.scores.find(score => score.examCategory === 'opener')?.score || "-";
                        const midTermScore = mark.scores.find(score => score.examCategory === 'mid-term')?.score || "-";
                        const finalScore = mark.scores.find(score => score.examCategory === 'final')?.score || "-";
                        const subjectAverage = calculateSubjectAverage([openerScore, midTermScore, finalScore]);
                        const remark = getRemark(subjectAverage); // Get the remark for the subject average
                        return (
                          <tr key={index} style={{ border: '1px solid black' }}>
                            <td style={{ padding: '1px', border: '1px solid black' }}>{mark.subjectCode}</td>
                            <td style={{ padding: '1px', border: '1px solid black' }}>{openerScore}</td>
                            <td style={{ padding: '1px', border: '1px solid black' }}>{midTermScore}</td>
                            <td style={{ padding: '1px', border: '1px solid black' }}>{finalScore}</td>
                            <td className='text-yellow-900 font-semibold' style={{ padding: '1px', border: '1px solid black' }}>{subjectAverage.toFixed(2)}</td>
                            <td className='text-yellow-800 font-semibold' style={{ padding: '1px', border: '1px solid black' }}>{remark}</td>
                          </tr>
                        );
                      })}
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
                  <div>
                    {/**the graph show be in this part */}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
export default MergedReportForm;
