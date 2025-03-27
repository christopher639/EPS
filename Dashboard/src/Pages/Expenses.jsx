import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import UserAccount from '../components/UserAccount';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../config';
axios.defaults.baseURL = BASE_URL;

const Expenses = () => {
  // Sidebar state
  const [sideBar, setSideBar] = useState(true);
  
  // Expenses list state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // For adding a new expense
  const [formData, setFormData] = useState({
    dateIncurred: '',
    expenseCategory: '',
    amount: '',
    description: '',
    paidTo: '',
    paymentMethod: '',
    approvedBy: ''
  });
  
  // For updating an expense
  const [updateFormData, setUpdateFormData] = useState(null);
  
  // For deletion
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Fetch all expenses from the backend
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/expenses');
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate total expense amount
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Handle add expense form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: Number(formData.amount)
      };
      await axios.post('http://localhost:3000/api/expenses', expenseData);
      toast.success("Expense added successfully");
      setShowAddModal(false);
      setFormData({
        dateIncurred: '',
        expenseCategory: '',
        amount: '',
        description: '',
        paidTo: '',
        paymentMethod: '',
        approvedBy: ''
      });
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to add expense");
      console.error(error);
    }
  };

  // Open update modal and pre-fill form data
  const openUpdateModal = (expense) => {
    setUpdateFormData(expense);
    setShowUpdateModal(true);
  };

  // Handle update form submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/expenses/${updateFormData._id}`, {
        ...updateFormData,
        amount: Number(updateFormData.amount)
      });
      toast.success("Expense updated successfully");
      setShowUpdateModal(false);
      setUpdateFormData(null);
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to update expense");
      console.error(error);
    }
  };

  // Open delete modal
  const openDeleteModal = (expenseId) => {
    setExpenseToDelete(expenseId);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const confirmDeleteExpense = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/expenses/${expenseToDelete}`);
      toast.success("Expense deleted successfully");
      setShowDeleteModal(false);
      setExpenseToDelete(null);
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error(error);
    }
  };

  const toggleSideBar = () => {
    setSideBar(prev => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col  bg-white w-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-sm p-4 border-b">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <h1 className="text-xl font-bold text-gray-800">Expenses</h1>
          <UserAccount />
        </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Header Section: Total Expense & Add Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <div className="p-4 bg-white rounded shadow-sm flex items-center">
              <h2 className="text-lg font-bold">Total Expense:</h2>
              <span className="ml-2 text-xl font-semibold text-black">
                ksh{totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow"
              >
                Add Expense
              </button>
            </div>
          </div>

          {/* Expense List Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-semibold text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-96 shadow-lg border rounded">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Date</th>
                    <th className="py-3 px-4 border-b text-left">Category</th>
                    <th className="py-3 px-4 border-b text-left">Amount</th>
                    <th className="py-3 px-4 border-b text-left">Description</th>
                    <th className="py-3 px-4 border-b text-left">Paid To</th>
                    <th className="py-3 px-4 border-b text-left">Payment Method</th>
                    <th className="py-3 px-4 border-b text-left">Approved By</th>
                    <th className="py-3 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense._id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4 border-b">
                        {new Date(expense.dateIncurred).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b">{expense.expenseCategory}</td>
                      <td className="py-3 px-4 border-b">ksh{expense.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 border-b">{expense.description}</td>
                      <td className="py-3 px-4 border-b">{expense.paidTo}</td>
                      <td className="py-3 px-4 border-b">{expense.paymentMethod}</td>
                      <td className="py-3 px-4 border-b">{expense.approvedBy}</td>
                      <td className="py-3 px-4 border-b">
                        <button 
                          onClick={() => openUpdateModal(expense)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => openDeleteModal(expense._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Adding Expense */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-4/5   rounded-lg shadow-lg   p-6">
            <div className="flex  justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Expense</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                X
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Incurred</label>
                <input
                  type="date"
                  value={formData.dateIncurred}
                  onChange={(e) => setFormData({ ...formData, dateIncurred: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expense Category</label>
                <input
                  type="text"
                  value={formData.expenseCategory}
                  onChange={(e) => setFormData({ ...formData, expenseCategory: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Office Supplies, Travel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paid To</label>
                <input
                  type="text"
                  value={formData.paidTo}
                  onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <input
                  type="text"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Cash, Credit Card"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved By</label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Updating Expense */}
      {showUpdateModal && updateFormData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg  shadow-lg  w-4/5  p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Expense</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                X
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Incurred</label>
                <input
                  type="date"
                  value={updateFormData.dateIncurred?.split('T')[0] || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, dateIncurred: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expense Category</label>
                <input
                  type="text"
                  value={updateFormData.expenseCategory || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, expenseCategory: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Office Supplies, Travel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={updateFormData.amount || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, amount: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={updateFormData.description || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paid To</label>
                <input
                  type="text"
                  value={updateFormData.paidTo || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, paidTo: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <input
                  type="text"
                  value={updateFormData.paymentMethod || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, paymentMethod: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Cash, Credit Card"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved By</label>
                <input
                  type="text"
                  value={updateFormData.approvedBy || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, approvedBy: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Deleting Expense Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this expense?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteExpense}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default Expenses;
