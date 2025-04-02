import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import { FaFilePdf, FaFileExcel, FaPrint, FaPlus, FaReceipt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import BASE_URL from "../config";

axios.defaults.baseURL = BASE_URL;

const FeesPayment = () => {
  const [sideBar, setSideBar] = useState(true);
  const [payments, setPayments] = useState([]);
  const [totalFeesPaid, setTotalFeesPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    regno: "",
    paymentDate: new Date().toISOString().split('T')[0],
    amountPaid: "",
    paymentMethod: "",
    receiptNumber: "",
    paidBy: "",
    remarks: "",
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/fees-payments");
      setPayments(res.data.payments);
      setTotalFeesPaid(res.data.totalFeesPaid);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/fees-payments", formData);
      fetchPayments();
      setIsModalOpen(false);
      setFormData({
        regno: "",
        paymentDate: new Date().toISOString().split('T')[0],
        amountPaid: "",
        paymentMethod: "",
        receiptNumber: "",
        paidBy: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Error adding payment", error);
    }
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // School Header
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text("SAMGE BOARDING SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Fees Payment Report", 105, 30, { align: "center" });
    
    // Summary Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`Total Payments: ${payments.length}`, 14, 45);
    doc.text(`Total Amount: Ksh ${totalFeesPaid.toLocaleString()}`, 14, 50);
    
    // Table Data
    const tableData = payments.map(payment => [
      payment.receiptNumber || "N/A",
      payment.regno,
      payment.studentDetails?.name || "N/A",
      payment.amountPaid.toLocaleString(),
      payment.paymentMethod,
      new Date(payment.paymentDate).toLocaleDateString()
    ]);
    
    // AutoTable
    autoTable(doc, {
      head: [['Receipt No', 'Reg No', 'Student', 'Amount', 'Method', 'Date']],
      body: tableData,
      startY: 60,
      styles: {
        cellPadding: 3,
        fontSize: 8,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        3: { cellWidth: 'auto', halign: 'right' }
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
    }
    
    doc.save(`fees_payments_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Generate Excel Report
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      payments.map(payment => ({
        "Receipt No": payment.receiptNumber || "N/A",
        "Reg No": payment.regno,
        "Student": payment.studentDetails?.name || "N/A",
        "Amount": payment.amountPaid,
        "Method": payment.paymentMethod,
        "Date": new Date(payment.paymentDate).toLocaleDateString(),
        "Paid By": payment.paidBy,
        "Remarks": payment.remarks || "N/A"
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    
    // Add summary info
    const summaryData = [
      ["Report Generated", new Date().toLocaleString()],
      ["Total Records", payments.length],
      ["Total Amount", totalFeesPaid]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    
    XLSX.writeFile(workbook, `fees_payments_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Generate Receipt PDF
  const generateReceipt = (payment) => {
    const doc = new jsPDF();
    
    // School Header
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text("SAMGE BOARDING SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("OFFICIAL PAYMENT RECEIPT", 105, 28, { align: "center" });
    
    // Receipt Details
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    // Receipt Number and Date
    doc.text(`Receipt No: ${payment.receiptNumber || "N/A"}`, 14, 40);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 160, 40, { align: "right" });
    
    // Line separator
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);
    
    // Student Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT DETAILS", 14, 55);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Registration No: ${payment.regno}`, 14, 65);
    doc.text(`Name: ${payment.studentDetails?.name || "N/A"}`, 14, 72);
    
    // Payment Details
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", 14, 85);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Amount: Ksh ${payment.amountPaid.toLocaleString()}`, 14, 95);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 14, 102);
    doc.text(`Received By: ${payment.paidBy || "School Accounts"}`, 14, 109);
    doc.text(`Remarks: ${payment.remarks || "School Fees Payment"}`, 14, 116);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is an official receipt. Please keep it safe.", 105, 150, { align: "center" });
    
    // Signature line
    doc.setFontSize(10);
    doc.text("Authorized Signature: _________________________", 105, 170, { align: "center" });
    doc.text("Stamp & Date", 105, 180, { align: "center" });
    
    return doc;
  };

  // Download Receipt
  const downloadReceipt = (payment) => {
    const doc = generateReceipt(payment);
    doc.save(`receipt_${payment.receiptNumber || payment._id}.pdf`);
  };

  // Print Receipt using jsPDF
  const printReceipt = (payment) => {
    const doc = generateReceipt(payment);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  };

  return (
    <div className="flex  bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${sideBar ? "w-0 md:w-64" : "w-0"} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className=" bg-gray-50 w-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-[19px] border-b ">
          <div className="flex items-center ">
            <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
            <p className="text-md px-4 font-semibold text-gray-800">Fees Payment Transactions Records</p>
          </div>
          <UserAccount />
        </div>

          {/* Dashboard */}
          <div className="p-2 md:p-1">
        {/* Summary Card and Action Buttons */}


          {/* Transactions Table */}
          <div className="bg-white mx-2 md:mx-2  mx-0 grid gri-cols-1 pb-4 md:pb-6 max-h-screen md:max-h-[90vh] pb-20 md:pb-5 overflow-y-auto overflow-x-auto rounded-lg p-2 sm:p-4">
          <div className="flex   justify-between items-start md:items-center gap-3 mb-2">
<div className="bg-white p-1.5 rounded-md shadow-sm border flex items-center gap-1.5">
  <div className="p-1 bg-blue-100 rounded-full">
    <FaReceipt className="text-blue-600 text-sm" />
  </div>
  <div>
    <p className="text-[10px] text-gray-500">Total Fees Paid</p>
    <p className="text-sm font-semibold text-gray-800">
      Ksh {new Intl.NumberFormat("en-US").format(totalFeesPaid)}
    </p>
  </div>
</div>
    <button
      onClick={generatePDF}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 text-sm"
      data-tooltip-id="pdf-tooltip"
    >
      <FaFilePdf /> PDF
      <Tooltip id="pdf-tooltip" place="top">Download as PDF</Tooltip>
    </button>

    <button
      onClick={generateExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 text-sm"
      data-tooltip-id="excel-tooltip"
    >
      <FaFileExcel /> Excel
      <Tooltip id="excel-tooltip" place="top">Download as Excel</Tooltip>
    </button>

    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 text-sm"
      data-tooltip-id="add-payment-tooltip"
    >
      <FaPlus /> Add
      <Tooltip id="add-payment-tooltip" place="top">Record new payment</Tooltip>
    </button>
 
</div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[70vh]  rounded-lg">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 uppercase tracking-wider text-xs">Receipt No</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 uppercase tracking-wider text-xs">Reg No</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 uppercase tracking-wider text-xs">Student</th>
                    <th className="px-4 py-2.5 text-right font-medium text-gray-600 uppercase tracking-wider text-xs">Amount</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 uppercase tracking-wider text-xs">Method</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 uppercase tracking-wider text-xs">Date</th>
                    <th className="px-4 py-2.5 text-right font-medium text-gray-600 uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
  {payments.length > 0 ? (
    payments.map((payment) => (
      <tr key={payment._id} className="bg-white">
        <td className="px-4 py-1 whitespace-nowrap text-gray-700">{payment.receiptNumber || "N/A"}</td>
        <td className="px-4 py-1 whitespace-nowrap text-gray-700 font-medium">{payment.regno}</td>
        <td className="px-4 py-1 whitespace-nowrap text-gray-900">
          {payment.studentDetails?.name || "N/A"}
        </td>
        <td className="px-4 py-1 whitespace-nowrap text-right text-gray-900 font-medium">
          {new Intl.NumberFormat("en-US").format(payment.amountPaid)}
        </td>
        <td className="px-4 py-1 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs ${
            payment.paymentMethod === 'MPESA' ? 'bg-green-100 text-green-800' :
            payment.paymentMethod === 'CASH' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-gray-800'
          }`}>
            {payment.paymentMethod}
          </span>
        </td>
        <td className="px-4 py-1 whitespace-nowrap text-gray-500">
          {new Date(payment.paymentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="px-4 py-1 whitespace-nowrap text-right space-x-1">
          <button
            onClick={() => downloadReceipt(payment)}
            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
            data-tooltip-id="pdf-receipt-tooltip"
          >
            <FaFilePdf className="text-base" />
            <Tooltip id="pdf-receipt-tooltip" place="top">
              Download PDF Receipt
            </Tooltip>
          </button>
          <button
            onClick={() => printReceipt(payment)}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors"
            data-tooltip-id="print-receipt-tooltip"
          >
            <FaPrint className="text-base" />
            <Tooltip id="print-receipt-tooltip" place="top">
              Print Receipt
            </Tooltip>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr className="bg-white">
      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center space-y-2">
          <FaFileInvoice className="text-2xl text-gray-300" />
          <span>No payment records found</span>
        </div>
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Record Payment</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      <input
                        type="text"
                        name="regno"
                        value={formData.regno}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Ksh)</label>
                      <input
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="M-Pesa">M-Pesa</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
                      <input
                        type="text"
                        name="paidBy"
                        value={formData.paidBy}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    
    </div>
  );
};

export default FeesPayment;