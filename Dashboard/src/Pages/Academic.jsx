import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Academic = () => {
  // State variables to track selected values for the filters
  const [classInput, setClassInput] = useState('Form3');
  const [yearInput, setYearInput] = useState('2024-2025');
  const [streamInput, setStreamInput] = useState('Form3x');
  const [termInput, setTermInput] = useState('Term-1');
  const [categoryInput, setCategoryInput] = useState('Opener');

  const [marksData, setMarksData] = useState([]);
  const [subjectHeaders, setSubjectHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      // Dynamically construct the URL using the selected filter values
      const url = `http://localhost:3000/api/marks/${classInput}/${yearInput}/${streamInput}/${termInput}/${categoryInput}`;
      const response = await axios.get(url);
      const data = response.data;
      // Extract unique subject codes from the fetched data
      const subjects = Array.from(
        new Set(data.flatMap(student => student.marks.map(mark => mark.code)))
      );

      // Set the fetched data and subjects for the table
      setMarksData(data);
      setSubjectHeaders(subjects);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching marks data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  // Trigger fetchData whenever the filter values change
  useEffect(() => {
    fetchData();
  }, [classInput, yearInput, streamInput, termInput, categoryInput]);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // If no data found, show a message
  if (marksData.length === 0) {
    return <div>No data found for the selected criteria.</div>;
  }

  return (
    <div className="flex flex-col max-w-screen-xl mx-auto">
      {/* Filter Controls */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Class Input */}
        <div>
          <select
            className="w-full border py-2 px-3 text-sm rounded-md"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
          >
            <option value="Form1">Form1</option>
            <option value="Form2">Form2</option>
            <option value="Form3">Form3</option>
            <option value="Form4">Form4</option>
          </select>
        </div>

        {/* Year Input */}
        <div>
          <select
            className="w-full border py-2 px-3 text-sm rounded-md"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>

        {/* Stream Input */}
        <div>
          <select
            className="w-full border py-2 px-3 text-sm rounded-md"
            value={streamInput}
            onChange={(e) => setStreamInput(e.target.value)}
          >
            <option value="Form1x">Form1x</option>
            <option value="Form2x">Form2x</option>
            <option value="Form3x">Form3x</option>
            <option value="Form4x">Form4x</option>
          </select>
        </div>

        {/* Term Input */}
        <div>
          <select
            className="w-full border py-2 px-3 text-sm rounded-md"
            value={termInput}
            onChange={(e) => setTermInput(e.target.value)}
          >
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>

        {/* Category Input */}
        <div>
          <select
            className="w-full border py-2 px-3 text-sm rounded-md"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          >
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="Final">Final</option>
          </select>
        </div>
      </div>

      {/* Table for displaying student marks */}
      <div className="mx-4 md:mx-0 grid grid-cols-1 max-h-[72vh] md:max-h-[80vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0">
        <table className="min-w-full border border-slate-700">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-1 py-1">Reg No</th>
              {subjectHeaders.map((subject, index) => (
                <th key={index} className="border-x border-slate-700 px-1 py-1">{subject.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marksData.length === 0 ? (
              <tr>
                <td colSpan={subjectHeaders.length + 1} className="text-center py-1 text-red-600">No Data Found</td>
              </tr>
            ) : (
              marksData.map((student, index) => (
                <tr key={index} className="hover:bg-gray-300 hover:text-black hover:font-bold">
                  <td className="border border-slate-500 px-1 py-1">{student.regno}</td>
                  {subjectHeaders.map((subject, idx) => {
                    // Find the mark for the current subject
                    const mark = student.marks.find(m => m.code === subject);
                    return (
                      <td key={idx} className="border text-center border-slate-700 px-1 py-1">
                        {mark ? mark.score : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Academic;
