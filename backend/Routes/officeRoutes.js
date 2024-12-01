const express = require('express');
const router = express.Router();
const officeController = require('../Controllers/officeController.js');

router.post('/', officeController.createOffice);
router.get('/', officeController.getAllOffices);
router.get('/:id', officeController.getOfficeById);
router.put('/:id', officeController.updateOffice);
router.delete('/:id', officeController.deleteOffice);

module.exports = router;
