import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
axios.defaults.baseURL = BASE_URL;
const AverageMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selecting stream, year, and term
  const [stream, setStream] = useState('form2x'); // Default stream
  const [year, setYear] = useState('2025-2026');  // Default year
  const [term, setTerm] = useState('Term-2');     // Default term

  // Function to fetch data with selected parameters
  const fetchMarksData = async () => {
    const url = `/api/marks/${stream}/${year}/${term}`;
    
    try {
      const response = await axios.get(url);
      setMarksData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
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

  // Get unique subjects from all marks
  const subjects = Array.from(
    new Set(marksData.map(mark => mark.subjectCode))
  );

  return (
    <div>
      <h1>Merged Marks (Average Score Only)</h1>
      
      {/* Stream, Year, and Term Selection */}
      <div className="min-w-full flex gap-4 mb-4">
      <div className="w-1/3">
          <select
            className="px-3 py-2 w-full text-sm outline-none border rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>

        <div className="w-1/3">
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
        
       
        <div className="w-1/3">
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
      </div>

      {/* Display Stream, Year, and Term in a Table */}
      <div className="mb-4">
        <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Stream</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Year</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Term</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px' }}>{stream}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{year}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{term}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Table Displaying the Merged Marks (Only Average Score) */}
      {marksData.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div
          style={{
            maxHeight: '300px',
            minHeight: '300px',
            minWidth: '800px',
            overflowY: 'auto',
            overflowX: 'auto',
            border: '1px solid black',
          }}
        >
          <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>RegNo</th>
                {/* Render column headers for each subject */}
                {subjects.map((subject, idx) => (
                  <th key={idx} style={{ border: '1px solid black', padding: '8px' }}>
                    {subject}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedByRegNo).map((regno) => {
                const studentMarks = groupedByRegNo[regno];

                return (
                  <tr key={regno}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{regno}</td>
                    {/* For each subject, display the average score in the corresponding column */}
                    {subjects.map((subject) => {
                      const markForSubject = studentMarks.find(
                        (mark) => mark.subjectCode === subject
                      );
                      const averageScore = markForSubject ? markForSubject.averageScore : '-';

                      return (
                        <td key={subject} style={{ border: '1px solid black', padding: '8px' }}>
                          {averageScore !== '-' ? averageScore.toFixed(2) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AverageMarks;
