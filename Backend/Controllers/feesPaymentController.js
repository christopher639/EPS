const FeesPayment = require('../models/feesPaymentModel');

// Create a new fees payment record
exports.createFeesPayment = async (req, res) => {
    try {
        const newFeesPayment = new FeesPayment(req.body);
        await newFeesPayment.save();
        res.status(201).json(newFeesPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all fees payment records
exports.getAllFeesPayments = async (req, res) => {
    try {
        const feesPayments = await FeesPayment.find();
        res.status(200).json(feesPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single fees payment record by ID
exports.getFeesPaymentById = async (req, res) => {
    try {
        const feesPayment = await FeesPayment.findById(req.params.id);
        if (!feesPayment) {
            return res.status(404).json({ message: 'Fees payment record not found' });
        }
        res.status(200).json(feesPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a fees payment record by ID
exports.updateFeesPayment = async (req, res) => {
    try {
        const updatedFeesPayment = await FeesPayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFeesPayment) {
            return res.status(404).json({ message: 'Fees payment record not found' });
        }
        res.status(200).json(updatedFeesPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a fees payment record by ID
exports.deleteFeesPayment = async (req, res) => {
    try {
        const deletedFeesPayment = await FeesPayment.findByIdAndDelete(req.params.id);
        if (!deletedFeesPayment) {
            return res.status(404).json({ message: 'Fees payment record not found' });
        }
        res.status(200).json({ message: 'Fees payment record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};