import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAccount from "../components/UserAccount";
const GeneralReport = () => {
  const [classValue, setClassValue] = useState("10");
  const [yearValue, setYearValue] = useState("2024-2025");
  const [termValue, setTermValue] = useState("Term-1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [classValue, yearValue, termValue]);

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
    printWindow.document.write(`<style>${styles} #bo{border:1px solid black} </style>`);  // Include the styles in the print window
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
  const calculateStudentTotalsAndAverages = (students) => {
    return students.map((student) => {
      const totalScores = student.subjects.reduce((total, subject) => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore];
        const validScores = scores.filter((score) => score != null);
        const avgScore = validScores.length > 0 ? validScores.reduce((acc, score) => acc + score, 0) / validScores.length : 0;
        return total + avgScore;
      }, 0);

      const avgScore = student.subjects.length > 0 ? totalScores / student.subjects.length : 0;

      return {
        ...student,
        totalScore: totalScores,
        avgScore: avgScore,
        subjects: student.subjects.map((subject) => ({
          ...subject,
          avgScore: (subject.openerScore + subject.midTermScore + subject.finalScore) / 3
        })),
      };
    });
  };

  const updatedData = calculateStudentTotalsAndAverages(data);

  const calculateClassTotalAndAverage = () => {
    const totalScores = updatedData.reduce((sum, student) => sum + student.totalScore, 0);
    const subjectCount = updatedData.reduce((sum, student) => sum + student.subjects.length, 0);

    const classAverage = subjectCount > 0 ? totalScores / subjectCount : 0;

    return {
      total: totalScores,
      average: classAverage
    };
  };

  const classStats = calculateClassTotalAndAverage();

  const subjectStats = updatedData.reduce((acc, student) => {
    student.subjects.forEach(subject => {
      const existingSubject = acc.find(sub => sub.code === subject.code);
      if (existingSubject) {
        existingSubject.total += subject.avgScore;
        existingSubject.count++;
      } else {
        acc.push({
          code: subject.code,
          total: subject.avgScore,
          count: 1
        });
      }
    });
    return acc;
  }, []);

  subjectStats.sort((a, b) => (b.total / b.count) - (a.total / a.count));

  const calculateSubjectTotalsAndAverages = () => {
    return subjectStats.map(subjectStat => ({
      ...subjectStat,
      average: subjectStat.total / subjectStat.count
    }));
  };

  const subjectTotalsAndAverages = calculateSubjectTotalsAndAverages();

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center flex justify-center items-center text-lg text-red-500">
       <div>
       Error: {error}
       </div>
      </div>
    );
  }

  return (
    <div className="container    p-2 bg-gray-50 ">
      {/* Top Controls */}
      <div className="flex justify-between ">

        <button
          onClick={handlePrint}
          className="bg-green-800 max-w-32 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
        >
          Print Sheet
        </button>
       
        
        <button
          onClick={() =>
            navigate("/report-card", {
              state: { data: updatedData, classValue, yearValue, termValue },
            })
          }
          className="bg-green-800  text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
        >
          Reports
        </button>
        <UserAccount/>
      </div>
        <div className="flex justify-between  p-2">
          <input
            type="text"
            className="text-center text-sm  border border-slate-300 outline-none py-2 px-3 text-sm rounded-md"
            placeholder="regno or stream"
            
          />
            <select
          value={classValue}
          onChange={(e) => setClassValue(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Form3">Form 3</option>
          <option value="Form4">Form 4</option>
          <option value="Form5">Form 5</option>
          <option value="Form6">Form 6</option>
        </select>
        <select
          value={yearValue}
          onChange={(e) => setYearValue(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        <select
          value={termValue}
          onChange={(e) => setTermValue(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Term-1">Term-1</option>
          <option value="Term-2">Term-2</option>
          <option value="Term-3">Term-3</option>
        </select>
        </div>
      

      {/* Table Section */}
      <div className="overflow-x-auto   overflow-y-auto bg-white shadow-lg rounded-lg px-4 max-h-[86vh]">
        {updatedData.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No data found</p>
        ) : (
          <div id="printableTable">
            <div className="flex justify-center mb-4">
              <img
                className="w-15 h-16  rounded-full"
                src="KIbabii-Logo.png"
                alt="School Logo"
              />
            </div>

            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr  id='bo'  className="bg-gray-200 text-gray-800">
                  <th id='bo'  className=" py-2 border-b">Academic Year</th>
                  <th id='bo'  className=" py-2 border-b">Class</th>
                  <th id='bo'  className=" py-2 border-b">Term</th>
                  <th id='bo'  className=" py-2 border-b">Exam Type</th>
                  <th  id='bo' className=" py-2 border-b">Best Subject</th>
                  <th id='bo'  className=" py-2 border-b">Least Subject</th>
                  <th id='bo'  className=" py-2 border-b">Mean Score</th>
                  <th id='bo'  className=" py-2 border-b">Grade</th>
                  <th id='bo'  className=" py-2 border-b">Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr id='bo' className="border-b">
                  <td  id='bo'className="px-3 py-2 text-yellow-600">{yearValue}</td>
                  <td id='bo' className="px-3 py-2 text-yellow-600">{classValue}</td>
                  <td id='bo' className="px-3 py-2 text-yellow-600">{termValue}</td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                  <td id='bo' className="px-3 py-2 text-yellow-600"></td>
                </tr>
              </tbody>
            </table>

            <table className="min-w-full table-auto text-center mt-6">
              <thead className="sticky top-0 bg-white">
                <tr  id='bo' className="bg-gray-200">
                <th id='bo' className="border sticky top-0 bg-white  py-2">Name</th>
                  <th id='bo' className="border sticky top-0 bg-white  py-2">Reg No</th>
                  <th id='bo' className="border  sticky top-0 bg-white py-2">Stream</th>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <th id='bo' key={index} className="border sticky top-0 bg-white  py-2">
                      <p className="text-yellow-600">{index + 1}</p>
                      <p>{subjectStat.code}</p>
                    </th>
                  ))}
                  <th id='bo' className="border sticky top-0 bg-white  py-2">Total</th>
                  <th id='bo' className="border sticky top-0 bg-white  py-2">Average</th>
                </tr>
              </thead>
              <tbody>
                {updatedData.map((student, studentIndex) => {
                  const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
                  const studentAverage = studentTotal / student.subjects.length;

                  return (
                    <tr key={studentIndex} className="hover:bg-gray-100">
                      <td className="border  py-2">{student.studentName}</td>
                      <td className="border  py-2">{student.regno}</td>
                      <td className="border  py-2">{student.stream}</td>
                      {subjectTotalsAndAverages.map((subjectStat, subjectIndex) => {
                        const subject = student.subjects.find((sub) => sub.code === subjectStat.code);
                        return (
                          <td key={subjectIndex} className="border  py-2">
                            {subject ? subject.avgScore.toFixed(2) : "-"}
                          </td>
                        );
                      })}
                      <td className="border  py-2">{studentTotal.toFixed(2)}</td>
                      <td className="border  py-2">{studentAverage.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-gray-200">
                  <td colSpan={3} className="border py-2">Total</td>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <td key={index} className="border  py-2">
                      {subjectStat.total.toFixed(2)}
                    </td>
                  ))}
                  <td className="border py-2">{classStats.total.toFixed(2)}</td>
                </tr>
                <tr className="font-bold bg-gray-200">
                  <td colSpan={3} className="border  py-2">Average</td>
                  {subjectTotalsAndAverages.map((subjectStat, index) => (
                    <td key={index} className="border  py-2">
                      {subjectStat.average.toFixed(2)}
                    </td>
                  ))}
                  <td className="border  py-2">{classStats.average.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralReport;
