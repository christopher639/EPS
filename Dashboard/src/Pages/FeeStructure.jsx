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
  const [filterGrade, setFilterGrade] = useState(""); // State for filtering
  const [filteredFees, setFilteredFees] = useState([]); // State for filtered fees

  useEffect(() => {
    fetchFeesStructures();
  }, []);


  const fetchFeesStructures = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/fee-distributions/2025/FirstTerm");
      setFees(res.data);
      setFilteredFees(res.data); // Initially, show all fees
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
      setFilteredFees(fees); // If no grade is entered, show all fees
    } else {
      const filtered = fees.filter(fee => fee.grade.toLowerCase() === filterGrade.toLowerCase());
      setFilteredFees(filtered);
    }
  };
  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");

    // Function to add background colors to odd and even rows
    const addRowBackgroundColors = (content) => {
      const rows = content.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index % 2 === 0) {
          row.style.backgroundColor = '#e6f7ff'; // Light blue for even rows
        } else {
          row.style.backgroundColor = '#f0f8ff'; // Lighter blue for odd rows
        }
      });
      return content;
    };

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
    printWindow.document.write(`
      <style>
        ${styles}
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #4a90e2;
        }
        th, td {
          border: 2px solid #ddd;
          padding: 10px;
          text-align: center;
        }
        #bo {
          border: 1px solid #4a90e2;
        }
      </style>
    `); // Add custom styles to the print window
    printWindow.document.write("</head><body>");
    
    // Create a temporary element to hold the content and apply row background colors
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContent;
    addRowBackgroundColors(tempDiv);

    // Write the modified content (with row background colors) to the print window
    printWindow.document.write(tempDiv.innerHTML);
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
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
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
          className="bg-green-800 max-w-32 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition mt-4 sm:mt-0"
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
                  <div key={index} className="overflow-x-auto page-break   border rounded">
                    <h3 className="text-lg font-bold bg-gray-100 px-4 py-2">
                      Grade: {feeStructure.grade}
                    </h3>
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="py-3 px-4 border-b text-left">Fees Category</th>
                          <th className="py-3 px-4 border-b text-left">Amount (Ksh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeStructure.feeCategories.map((fee, idx) => (
                          <tr key={idx} className="hover:bg-gray-100 transition-colors">
                            <td className="py-3 px-4 border-b">{fee.category}</td>
                            <td className="py-3 px-4 border-b">Ksh {fee.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                        {/* Total row */}
                        <tr className="bg-gray-100 font-bold">
                          <td className="py-3 px-4 border-t">Total</td>
                          <td className="py-3 px-4 border-t">Ksh {feeStructure.totalFeesAmount.toLocaleString()}</td>
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
