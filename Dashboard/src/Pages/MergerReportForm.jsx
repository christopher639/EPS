import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MergerReportForm = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selecting stream, year, and term
  const [stream, setStream] = useState('form1x'); // Default stream
  const [year, setYear] = useState('2025-2026');  // Default year
  const [term, setTerm] = useState('Term-1');     // Default term

  // State for filtering by RegNo
  const [regNoFilter, setRegNoFilter] = useState('');

  // Function to fetch the report card data
  const fetchMarksData = async () => {
    const url = `http://localhost:3000/api/marks/${stream}/${year}/${term}`;
    
    try {
      const response = await axios.get(url);
      setMarksData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Not Found');
      setLoading(false);
    }
  };

  // Fetch the data initially when the component mounts, and when selections change
  useEffect(() => {
    fetchMarksData();
  }, [stream, year, term]); // Re-run whenever any selection changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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

  // Filter marksData by RegNo
  const filteredMarksData = regNoFilter
    ? marksData.filter(mark => mark.regno.toLowerCase().includes(regNoFilter.toLowerCase()))
    : marksData;

  // Group the filtered marks data
  const filteredGroupedByRegNo = filteredMarksData.reduce((acc, mark) => {
    if (!acc[mark.regno]) {
      acc[mark.regno] = [];
    }
    acc[mark.regno].push(mark);
    return acc;
  }, {});
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
      {/* Stream, Year, Term, and RegNo Filter */}
      <div className="grid grid-cols-6 gap-5 pb-5">
        <div className="min-w-full">
          <select
            className="px-3 py-2 w-full text-sm outline-none border rounded"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            <option value="form1x">Form 1X</option>
            <option value="form2x">Form 2X</option>
            <option value="form3x">Form 3X</option>
            <option value="form4x">Form 4X</option>
          </select>
        </div>

        <div className="min-w-full">
          <select
            className="px-3 py-2 w-full text-sm outline-none border rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>

        <div className="min-w-full">
          <select
            className="px-3 py-2 w-full text-sm outline-none border rounded"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>

        {/* RegNo Filter Input */}
        <div className="min-w-full">
          <input
            type="text"
            placeholder="Filter by RegNo"
            className="px-3 py-2 w-full text-sm outline-none border rounded"
            value={regNoFilter}
            onChange={(e) => setRegNoFilter(e.target.value)}
          />
        </div>
         

       < div>
      <button onClick={handlePrint}  className="text-center px-3 text-slate-500 text-sm w-full  border border-1 border-slate-700 font-bold     py-2 rounded hover:text-slate-900">
            Print Reports
          </button>
      </div>
      </div>

      {/* Render Report Cards */}
      <div id="printableTable" style={{ maxHeight: '430px', overflowY: 'auto', overflowX: 'auto' }}>
        {Object.keys(filteredGroupedByRegNo).length === 0 ? (
          <p>No data found</p>
        ) : (
          <>
            {Object.keys(filteredGroupedByRegNo).map((regno) => {
              const studentMarks = filteredGroupedByRegNo[regno];
              const overallAverage = calculateOverallAverage(studentMarks);
              const overallRemark = getRemark(overallAverage); // Get general remark for overall average

              return (
                <div key={regno} className="page-break"   style={{ marginBottom: '20px', border: '', padding: '10px' }}>
                  <div className="text-center">
                    <img
                      src="KIbabii-Logo.png"
                      alt="School Logo"
                      className="w-[54px] h-[54px] mx-auto"
                    />
                  </div>
                  {/* Display Stream, Year, and Term below the Logo */}
                  <div className="text-center ">
                   
                    <p><strong>Year: </strong>{year}</p>
                    <p><strong>Term: </strong>{term}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-yellow-800">Reg No: <span>{regno}</span></p>
                    <p><strong>Stream: </strong><span className='text-yellow-700'>{stream}</span></p>
                    <p><strong>Avg:</strong> <strong className='text-yellow-800'>{overallAverage.toFixed(2)}</strong> 
                       <span className='pl-5'>Remark</span>  <span className="ml-2 text-sm  text-yellow-700 font-semibold">{overallRemark}</span></p>
                        
                  </div>
                  <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Subject</th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Opener Score</th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Mid-Term Score</th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Final Score</th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Average Score</th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Remarks</th>
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
                            <td style={{ padding: '4px'  ,border: '1px solid black'}}>{mark.subjectCode}</td>
                            <td style={{ padding: '4px' ,border: '1px solid black' }}>{openerScore}</td>
                            <td style={{ padding: '4px' ,border: '1px solid black' }}>{midTermScore}</td>
                            <td style={{ padding: '4px' ,border: '1px solid black'}}>{finalScore}</td>
                            <td style={{ padding: '4px' ,border: '1px solid black' }}>{subjectAverage.toFixed(2)}</td>
                            <td style={{ padding: '4px' ,border: '1px solid black'}}>{remark}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className='flex flex-col md:flex-row gap-5 mt-5'>
                      <div className='border w-full border-slate-500'>
                        <table className='w-full'>
                          <caption>KEY</caption>
                          <tbody>
                            <tr className='border-t border-slate-500'>
                              <td>E.E</td>
                              <td>75 -100</td>
                              <td>Exceeding Expectation</td>
                            </tr>
                            <tr className='border-t border-slate-500'>
                              <td>M.E</td>
                              <td>50 -74</td>
                              <td>Meeting Expectation</td>
                            </tr>
                            <tr className='border-t border-slate-500'>
                              <td>B.E</td>
                              <td>0 -49</td>
                              <td>Below Expectation</td>
                            </tr>
                            <tr className='border-t border-slate-500'>
                              <td>F</td>
                              <td>NULL</td>
                              <td>Never did exam</td>
                            </tr>
                            <tr className='border-t border-slate-500'>
                              <td>AVG</td>
                              <td>Total divided by 9</td>
                              <td>Average</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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

export default MergerReportForm;
