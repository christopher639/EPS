import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MergedMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stream, setStream] = useState('form1x'); // Default stream
  const [year, setYear] = useState('2025-2026'); // Default year
  const [term, setTerm] = useState('Term-1'); // Default term

  const navigate = useNavigate();

  // Function to fetch marks data based on selected filters
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

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchMarksData();
  }, [stream, year, term]);

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

  // Function to handle print
  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <div>
      {/* Stream, Year, Term Selection */}
      <div className='grid grid-cols-6 gap-5 pb-5'>
        <div className='w-24'>
          <button onClick={handlePrint} className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900">
            Print 
          </button>
        </div>
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

        <div>
          <button onClick={() => navigate('')} className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900">
            Avg Only
          </button>
        </div>

        <div>
          {/* Button to navigate to MergedReportForm */}
          <button 
            onClick={() => navigate('/report-card', { state: { marksData, stream, year, term } })}
            className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900"
          >
            Reports 
          </button>
        </div>
      </div>

      {/* Table to display the Merged Marks */}
      {marksData.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div id="printableTable" style={{ maxHeight: '430px', overflowY: 'auto', overflowX: 'auto' }}>
          {/* Table for Year, Stream, and Term */}
          <div style={{ marginBottom: '0px' }}>
            <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '2px' }}>Year</th>
                  <th style={{ border: '1px solid black', padding: '2px' }}>Stream</th>
                  <th style={{ border: '1px solid black', padding: '2px' }}>Term</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='text-yellow-700' style={{ border: '1px solid black', padding: '2px' }}>{year}</td>
                  <td className='text-yellow-700' style={{ border: '1px solid black', padding: '2px' }}>{stream}</td>
                  <td className='text-yellow-700' style={{ border: '1px solid black', padding: '2px' }}>{term}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '4px' }}>RegNo</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Subject</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Opener Score</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Mid-Term Score</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Final Score</th>
                <th style={{ border: '1px solid black', padding: '4px' }}>Average Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedByRegNo).map((regno) => {
                const studentMarks = groupedByRegNo[regno];

                return studentMarks.map((mark, index) => {
                  const openerScore = mark.scores.find(score => score.examCategory === 'opener')?.score || "-";
                  const midTermScore = mark.scores.find(score => score.examCategory === 'mid-term')?.score ||"-" ;
                  const finalScore = mark.scores.find(score => score.examCategory === 'final')?.score || "-";

                  return (
                    <tr className='hover:bg-slate-300 text-black' key={index}>
                      {index === 0 ? (
                        <td rowSpan={studentMarks.length} style={{ border: '1px solid black', padding: '8px' }}>
                          {mark.regno}
                        </td>
                      ) : null}
                      <td style={{ border: '1px solid black', padding: '2px' }}>{mark.subjectCode}</td>
                      <td style={{ border: '1px solid black', padding: '2px' }}>{openerScore}</td>
                      <td style={{ border: '1px solid black', padding: '2px' }}>{midTermScore}</td>
                      <td style={{ border: '1px solid black', padding: '2px' }}>{finalScore}</td>
                      <td style={{ border: '1px solid black', padding: '2px' }}>{mark.averageScore.toFixed(2)}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MergedMarks;
