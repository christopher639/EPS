const express = require('express');
const router = express.Router();
const feeDistributionController = require('../Controllers/feeDistributionController');

// 📌 FIX: Place specific routes before dynamic ones to avoid conflicts
router.get('/feeStructure', feeDistributionController.getFeeStructureByGrade);
router.get('/:grade/:term/:studentType', feeDistributionController.getFeeDistributionsByGroup);

// CRUD Routes
router.post('/', feeDistributionController.createFeeDistribution);
router.get('/', feeDistributionController.getAllFeeDistributions);
router.get('/:id', feeDistributionController.getFeeDistributionById);
router.put('/:id', feeDistributionController.updateFeeDistribution);
router.delete('/:id', feeDistributionController.deleteFeeDistribution);
router.get('/student/:grade', feeDistributionController.getFeeStructureByStudentGrade);

module.exports = router;
