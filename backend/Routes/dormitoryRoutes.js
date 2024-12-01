const express = require('express');
const router = express.Router();
const dormitoryController = require('../controllers/dormitoryController');

// Routes for Dormitory
router.get('/', dormitoryController.getAllDormitories);       // GET all dormitories
router.get('/:id', dormitoryController.getDormitoryById);     // GET dormitory by ID
router.post('/', dormitoryController.createDormitory);        // CREATE a new dormitory
router.put('/:id', dormitoryController.updateDormitory);      // UPDATE a dormitory by ID
router.delete('/:id', dormitoryController.deleteDormitory);   // DELETE a dormitory by ID

module.exports = router;
