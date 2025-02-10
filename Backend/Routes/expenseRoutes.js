const express = require('express');
const router = express.Router();
const expenseController = require('../Controllers/expenseController');

// Create a new expense
router.post('/', expenseController.createExpense);

// Get all expenses
router.get('/', expenseController.getAllExpenses);

// Get a single expense by ID
router.get('/:id', expenseController.getExpenseById);

// Update an expense by ID
router.put('/:id', expenseController.updateExpense);

// Delete an expense by ID
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;