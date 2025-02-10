const express = require('express');
const router = express.Router();
const feeDistributionController = require('../Controllers/feeDistributionController');

// Create a new fee distribution
router.post('/', feeDistributionController.createFeeDistribution);

// Get all fee distributions
router.get('/', feeDistributionController.getAllFeeDistributions);

// Get a single fee distribution by ID
router.get('/:id', feeDistributionController.getFeeDistributionById);

// Update a fee distribution by ID
router.put('/:id', feeDistributionController.updateFeeDistribution);

// Delete a fee distribution by ID
router.delete('/:id', feeDistributionController.deleteFeeDistribution);
// New route for getting total fee amounts by category
router.get('/:year/:term/:grade', feeDistributionController.getTotalFeeAmountsByCategory);
module.exports = router;