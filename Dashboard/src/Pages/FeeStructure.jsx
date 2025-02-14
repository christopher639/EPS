import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "http://localhost:3000";

const FeesStructures = () => {
  const [sideBar, setSideBar] = useState(true);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGrade, setFilterGrade] = useState("");
  const [filteredFees, setFilteredFees] = useState([]);

  useEffect(() => {
    fetchFeesStructures();
  }, []);

  const fetchFeesStructures = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/fee-distributions/feeStructure");
      setFees(res.data);
      setFilteredFees(res.data); 
    } catch (error) {
      toast.error("Failed to fetch fees structures");
    }
    setLoading(false);
  };

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const handleFilter = () => {
    if (filterGrade.trim() === "") {
      setFilteredFees(fees);
    } else {
      const filtered = fees.filter(
        (fee) => fee.grade.toLowerCase() === filterGrade.toLowerCase()
      );
      setFilteredFees(filtered);
    }
  };

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
    printWindow.document.write(`<style>${styles}
      /* Reduce text size and adjust layout for printing */
      body {
        font-size: 16px !important; /* Smaller font size */
        margin: 0;
        padding: 0;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      th, td {
        padding: 5px !important; /* Reduce padding */
        font-size: 14px !important; /* Smaller font size */
      }
      #bo { border: 1px solid black; }
      #floating-stamp {
        position: absolute;
        bottom: 1.25rem; /* 5 * 0.25rem */
        right: 180px; /* Position from the right */
        transform: rotate(-12deg);
        background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent */
        border: 2px solid #1e40af; /* border-blue-900 */
        padding: 0.5rem; /* p-2 */
        max-width: 28rem; /* max-w-md */
        max-height: auto; /* max-h-auto */
        text-align: center;
        font-family: 'Sans-Serif', Arial, sans-serif; /* font-sans */
        z-index: 10;
        pointer-events: none;
        opacity: 0.4; /* Make the stamp slightly transparent */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Add a shadow for a realistic effect */
      }
      @media print {
        #floating-stamp {
          opacity: 0.8; /* Make the stamp slightly transparent when printing */
          background-color: rgba(255, 255, 255, 0.8); /* Ensure the background is visible */
        }
      }
    </style>`); // Include the styles in the print window
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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? "w-72" : "w-16"
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col bg-white w-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-sm p-4 border-b">
          <SidebarToggleButton
            toggleSidebar={toggleSideBar}
            isSidebarCollapsed={!sideBar}
          />
          <h1 className="text-xl font-bold text-gray-800">Fees Structures</h1>
          <UserAccount />
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-y-auto max-h-[87vh]">
          {/* Grade Filter */}
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Enter Grade..."
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="border p-2 rounded w-48"
            />
            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Filter
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-800 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
            >
              Print
            </button>
          </div>

          {/* Fees Structure Tables */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-semibold text-gray-600">Loading...</p>
            </div>
          ) : (
            <div id="printableTable" className="space-y-6">
              {filteredFees.length > 0 ? (
                filteredFees.map((feeStructure, index) => (
                  <div key={index} className=" p-4 ">
                     <div className="text-center">
                <img
                  src="lion.jpg"
                  alt="School Logo"
                  className="w-[110px] h-[108px] mx-auto"
                />
              </div> <p>
                Fees Structure
              </p>
                    <h3 className="text-lg font-bold bg-gray-200 p-2 rounded">
                      Grade: {feeStructure.grade}
                    </h3>

                    <table className="w-full bg-white border-collapse mt-2">
                      <thead>
                        <tr className="bg-gray-300">
                          
                          <th className="py-3 px-4 border text-left">FeesStructure</th>
                          <th className="py-3 px-4 border text-left"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeStructure.terms.map((term, termIdx) => (
                          <React.Fragment key={termIdx}>
                            {/* Term Header Row */}
                            <tr className="term-header">
                              <td className="py-3 px-4 border font-bold" >
                                {term.term}
                              </td>
                              <td className="py-3 px-4 border font-bold">
                              Amount (Ksh)
                              </td>

                            </tr>
                            {/* Fee Categories for Term */}
                            {term.feeCategories.map((fee, feeIdx) => (
                              <tr key={feeIdx} className="hover:bg-gray-100 transition">
                              
                                <td className="py-3 px-4 border">{fee.category}</td>
                                <td className="py-3 px-4 border">
                                  Ksh {fee.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                            {/* Term Total Row */}
                            <tr className="total-row">
                              <td className="py-3 px-4 border font-bold">Total for {term.term}</td>
                              
                              <td className="py-3 px-4 border font-bold">
                                Ksh {term.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                        {/* Overall Total Row */}
                        <tr className="bg-gray-300 font-bold">
                          <td className="py-3 px-4 border">Overall Total</td>
                
                          <td className="py-3 px-4 border">Ksh {feeStructure.totalAmountAllTerms.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 font-semibold">
                  No fee structures available for the entered grade.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FeesStructures;
