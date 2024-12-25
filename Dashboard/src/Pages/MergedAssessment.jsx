import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MergedAssessment = () => {
  // State variables for class, year, term, data, loading, and error states
  const [classValue, setClassValue] = useState("Form3");
  const [yearValue, setYearValue] = useState("2024-2025");
  const [termValue, setTermValue] = useState("Term-1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch data when the component mounts or the selected values change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/marks/${classValue}/${yearValue}/${termValue}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result); // Set fetched data into state
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [classValue, yearValue, termValue]);

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");

    printWindow.document.write("<html><head><title>Print</title>");
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

    printWindow.document.write(`<style>${styles}</style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  // Calculate average score for each subject of each student
  const calculateAvgScores = (students) => {
    return students.map((student) => ({
      ...student,
      subjects: student.subjects.map((subject) => {
        // Calculate the average score for each subject
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore];
        const validScores = scores.filter(score => score != null); // Remove null/undefined scores
        const avgScore = validScores.length > 0 ? validScores.reduce((acc, score) => acc + score, 0) / validScores.length : 0;

        return {
          ...subject,
          avgScore: avgScore, // Add avgScore to subject
        };
      }),
    }));
  };

  const updatedData = calculateAvgScores(data); // Updated data with avg scores

  // Render loading, error, or the table
  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Input fields for class, year, and term */}
      <div className="grid grid-cols-5 gap-4">
        <div className="w-24">
          <button
            onClick={handlePrint}
            className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900"
          >
            Print
          </button>
        </div>
        {/* Class Dropdown */}
        <div>
          <select
            id="class"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Form3">Form 3</option>
            <option value="Form4">Form 4</option>
            <option value="Form5">Form 5</option>
            <option value="Form6">Form 6</option>
          </select>
        </div>

        {/* Year Dropdown */}
        <div>
          <select
            id="year"
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>

        {/* Term Dropdown */}
        <div>
          <select
            id="term"
            value={termValue}
            onChange={(e) => setTermValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>

        {/* Avg Only Button */}
        

        {/* Reports Button */}
        <div>
          <button
            onClick={() =>
              navigate("/report-card", {
                state: { data: updatedData, classValue, yearValue, termValue },
              })
            }
            className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900"
          >
            Reports
          </button>
        </div>
      </div>

      {/* Table for displaying term report */}
      {updatedData.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div
          id="printableTable"
          className="mt-5"
          style={{ maxHeight: "430px", overflowY: "auto", overflowX: "auto" }}
        >
          <table className="min-w-full table-auto text-center border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-700">Reg No</th>
                <th className="border border-slate-700">Stream</th>
                <th className="border border-slate-700">Subject Code</th>
                <th className="border border-slate-700">Opener Score</th>
                <th className="border border-slate-700">Mid Term Score</th>
                <th className="border border-slate-700">Final Score</th>
                <th className="border border-slate-700">Average Score</th>
              </tr>
            </thead>
            <tbody>
              {updatedData.map((student, studentIndex) =>
                student.subjects.map((subject, subjectIndex) => (
                  <tr className="hover:bg-slate-300 text-black" key={`${studentIndex}-${subjectIndex}`}>
                    {subjectIndex === 0 ? (
                      <>
                        <td
                          rowSpan={student.subjects.length}
                          style={{ border: "1px solid black", padding: "2px" }}
                        >
                          {student.regno}
                        </td>
                        <td
                          rowSpan={student.subjects.length}
                          style={{ border: "1px solid black", padding: "2px" }}
                        >
                          {student.stream}
                        </td>
                      </>
                    ) : null}
                    <td style={{ border: "1px solid black", padding: "2px" }}>
                      {subject.code}
                    </td>
                    <td style={{ border: "1px solid black", padding: "2px" }}>
                      {subject.openerScore ?? "-"}
                    </td>
                    <td style={{ border: "1px solid black", padding: "2px" }}>
                      {subject.midTermScore ?? "-"}
                    </td>
                    <td style={{ border: "1px solid black", padding: "2px" }}>
                      {subject.finalScore ?? "-"}
                    </td>
                    <td style={{ border: "1px solid black", padding: "2px" }}>
                      {subject.avgScore.toFixed(2) ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MergedAssessment;
