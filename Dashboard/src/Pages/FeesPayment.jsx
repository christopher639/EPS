import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";

axios.defaults.baseURL = "http://localhost:3000";

const FeesPayment = () => {
  const [sideBar, setSideBar] = useState(true);
  const [payments, setPayments] = useState([]);
  const [totalFeesPaid, setTotalFeesPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    regno: "",
    paymentDate: "",
    amountPaid: "",
    paymentMethod: "",
    receiptNumber: "",
    paidBy: "",
    remarks: "",
  });

  // Fetch payments from API
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

  // Handle modal form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/fees-payments", formData);
      fetchPayments(); // Refresh data
      setIsModalOpen(false); // Close modal
      setFormData({
        regno: "",
        paymentDate: "",
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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? "w-72" : "w-16"} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-md p-4 border-b">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <h1 className="text-2xl font-semibold text-gray-800">Fees Payment Transactions</h1>
          <UserAccount />
        </div>

        {/* Total Fees Paid & Add Payment Button */}
        <div className="p-6 flex justify-between">
          <div className="bg-white flex gap-3  border rounded-lg p-2 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Fees Paid</h2>
            <p className="text-2xl font-bold text-black">
              Ksh {new Intl.NumberFormat("en-US").format(totalFeesPaid)}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Payment
          </button>
        </div>

        {/* Transactions Table */}
        <div className="px-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-semibold text-gray-600">Loading transactions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[69vh] pb-8 bg-white shadow-lg border rounded-lg">
              <table className="min-w-full border-collapse text-sm text-left">
                <thead className="bg-gray-900 text-black uppercase text-xs">
                  <tr>
                    <th className="py-2 px-3 border">Transaction ID</th>
                    <th className="py-2 px-3 border">Reg No.</th>
                    <th className="py-2 px-3 border">Student Name</th>
                    <th className="py-2 px-3 border">Amount Paid (Ksh)</th>
                    <th className="py-2 px-3 border">Payment Method</th>
                    <th className="py-2 px-3 border">Receipt No.</th>
                    <th className="py-2 px-3 border">Date Paid</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment._id} className="border hover:bg-gray-50 text-sm">
                        <td className="py-2 px-3 border">{payment._id}</td>
                        <td className="py-2 px-3 border">{payment.regno}</td>
                        <td className="py-2 px-3 border">
                          {payment.studentDetails ? payment.studentDetails.name : "N/A"}
                        </td>
                        <td className="py-2 px-3 border text-right font-semibold">
                          {new Intl.NumberFormat("en-US").format(payment.amountPaid)}
                        </td>
                        <td className="py-2 px-3 border">{payment.paymentMethod}</td>
                        <td className="py-2 px-3 border">{payment.receiptNumber || "N/A"}</td>
                        <td className="py-2 px-3 border">
                          {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 text-center text-gray-600">
                        No payment records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

       {/* Payment Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
      <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4  grid grid-cols-11 md:grid-cols-3 gap-5">
        
        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium">Registration Number</label>
          <input
            type="text"
            name="regno"
            value={formData.regno}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Payment Date */}
        <div>
          <label className="block text-sm font-medium">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Amount Paid */}
        <div>
          <label className="block text-sm font-medium">Amount Paid (Ksh)</label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Payment Method */}
        <div >
          <label className="block text-sm font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Mobile Money">Mobile Money</option>
          </select>
        </div>

        {/* Receipt Number */}
        <div>
          <label className="block text-sm font-medium">Receipt Number</label>
          <input
            type="text"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Paid By */}
        <div>
          <label className="block text-sm font-medium">Paid By</label>
          <input
            type="text"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default FeesPayment;
