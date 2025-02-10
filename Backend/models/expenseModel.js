const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    dateIncurred: { type: Date, required: true },
    expenseCategory: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    paidTo: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    approvedBy: { type: String, required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;