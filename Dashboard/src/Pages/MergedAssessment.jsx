import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAccount from "../components/UserAccount";

const MergedAssessment = () => {
{/**   state: { data: marksData, year, stream, term }, */}
  const [stream, setClassValue] = useState("10");
  const [year, setYearValue] = useState("2024-2025");
  const [term, setTermValue] = useState("Term-1");
  const [marksData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/marks/${stream}/${year}/${term}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [stream, year, term]);

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

  const calculateAvgScores = (students) => {
    return students.map((student) => ({
      ...student,
      subjects: student.subjects.map((subject) => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore];
        const validScores = scores.filter((score) => score != null);
        const avgScore = validScores.length > 0 ? validScores.reduce((acc, score) => acc + score, 0) / validScores.length : 0;

        return {
          ...subject,
          avgScore,
        };
      }),
    }));
  };

  const updatedData = calculateAvgScores(marksData);

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto   bg-gray-50">
      {/* Top Controls */}
      <div className="flex justify-between p-2">
      <button
            onClick={handlePrint}
            className="text-center px-3 bg-green-800 text-white text-sm  border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900 whitespace-nowrap"
          >
            Print Sheet
          </button>
        
        <button
          onClick={() =>
            navigate("/report-card", {
              state: { data: marksData, year, stream, term },
            })
          }
          className="bg-green-800 text-white text-sm px-3  border border-slate-700 font-bold py-2 rounded-md hover:bg-green-900 transition"
        >
          Reports
        </button>
        <UserAccount/>
      </div>
      <div className="flex p-3 justify-between">
      <input
            type="text"
            className="text-center text-sm  border border-slate-300 outline-none py-2 px-3 text-sm rounded-md"
            placeholder="regno or stream"
            
          />
      <select
          value={stream}
          onChange={(e) => setClassValue(e.target.value)}
          className=" px-3 py-2 border rounded-md"
        >
          <option value="Form3">Form 3</option>
          <option value="Form4">Form 4</option>
          <option value="Form5">Form 5</option>
          <option value="Form6">Form 6</option>
        </select>
        <select
          value={year}
          onChange={(e) => setYearValue(e.target.value)}
          className=" px-3 py-2 border rounded-md"
        >
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        <select
          value={term}
          onChange={(e) => setTermValue(e.target.value)}
          className=" px-3 py-2 border rounded-md"
        >
          <option value="Term-1">Term-1</option>
          <option value="Term-2">Term-2</option>
          <option value="Term-3">Term-3</option>
        </select>
      </div>

    <div>
        {/* Table Section */}
      {updatedData.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No data found</p>
      ) : (
        <div  id="printableTable"  className=" bg-white shadow-lg rounded-lg px-4 overflow-x-auto overflow-y-auto max-h-[88vh]">
         <div className="flex justify-center mb-4">
              <img
                className="w-15 h-16  rounded-full"
                src="KIbabii-Logo.png"
                alt="School Logo"
              />
            </div>

          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="px-3 py-2 border-b">Academic Year</th>
                <th className="px-3 py-2 border-b">Class</th>
                <th className="px-3 py-2 border-b">Term</th>
                <th className="px-3 py-2 border-b">Exam Type</th>
                <th className="px-3 py-2 border-b">Best Subject</th>
                <th className="px-3 py-2 border-b">Least Subject</th>
                <th className="px-3 py-2 border-b">Mean Score</th>
                <th className="px-3 py-2 border-b">Grade</th>
                <th className="px-3 py-2 border-b">Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2 text-yellow-600">{year}</td>
                <td className="px-3 py-2 text-yellow-600">{stream}</td>
                <td className="px-3 py-2 text-yellow-600">{term}</td>
                <td className="px-3 py-2 text-yellow-600"></td>
                <td className="px-3 py-2 text-yellow-600"></td>
                <td className="px-3 py-2 text-yellow-600"></td>
                <td className="px-3 py-2 text-yellow-600"></td>
                <td className="px-3 py-2 text-yellow-600"></td>
                <td className="px-3 py-2 text-yellow-600"></td>
              </tr>
            </tbody>
          </table>

          {/* Scrollable Table */}
          <div  >
            <table className="min-w-full table-auto text-center">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-slate-800  text-yellow-900">
                  <th className="border  sticky top-0 bg-white py-2 ">Reg No</th>
                  <th className="border sticky top-0 bg-white py-2 ">Stream</th>
                  <th className="border sticky top-0 bg-white py-2 ">Subject Code</th>
                  <th className="border sticky top-0 bg-white py-2 ">Opener Score</th>
                  <th className="border sticky top-0 bg-white py-2 ">Mid Term Score</th>
                  <th className="border sticky top-0 bg-white py-2 ">Final Score</th>
                  <th className="border sticky top-0 bg-white py-2 ">Average Score</th>
                </tr>
              </thead>
              <tbody>
                {updatedData.map((student, studentIndex) =>
                  student.subjects.map((subject, subjectIndex) => (
                    <tr key={`${studentIndex}-${subjectIndex}`} className="hover:bg-slate-200">
                      {subjectIndex === 0 ? (
                        <>
                          <td rowSpan={student.subjects.length} className="border py-2">{student.regno}</td>
                          <td rowSpan={student.subjects.length} className="border py-2">{student.stream}</td>
                        </>
                      ) : null}
                      <td className="border py-2">{subject.code}</td>
                      <td className="border py-2">{subject.openerScore ?? "-"}</td>
                      <td className="border py-2">{subject.midTermScore ?? "-"}</td>
                      <td className="border py-2">{subject.finalScore ?? "-"}</td>
                      <td className="border py-2">{((subject.openerScore+subject.midTermScore+subject.finalScore)/3).toFixed(2) ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default MergedAssessment;
