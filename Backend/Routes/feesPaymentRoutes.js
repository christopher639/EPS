const express = require('express');
const router = express.Router();
const feesPaymentController = require('../Controllers/feesPaymentController');

// Create a new fees payment record
router.post('/', feesPaymentController.createFeesPayment);

// Get all fees payment records
router.get('/', feesPaymentController.getAllFeesPayments);

// Get a single fees payment record by ID
router.get('/:id', feesPaymentController.getFeesPaymentById);

// Update a fees payment record by ID
router.put('/:id', feesPaymentController.updateFeesPayment);

// Delete a fees payment record by ID
router.delete('/:id', feesPaymentController.deleteFeesPayment);

module.exports = router;