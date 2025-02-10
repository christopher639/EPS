const FeeDistribution = require('../models/feeDistributionModel');

// Create a new fee distribution
exports.createFeeDistribution = async (req, res) => {
    try {
        const newFeeDistribution = new FeeDistribution(req.body);
        await newFeeDistribution.save();
        res.status(201).json(newFeeDistribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all fee distributions
exports.getAllFeeDistributions = async (req, res) => {
    try {
        const feeDistributions = await FeeDistribution.find();
        res.status(200).json(feeDistributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single fee distribution by ID
exports.getFeeDistributionById = async (req, res) => {
    try {
        const feeDistribution = await FeeDistribution.findById(req.params.id);
        if (!feeDistribution) {
            return res.status(404).json({ message: 'Fee distribution not found' });
        }
        res.status(200).json(feeDistribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a fee distribution by ID
exports.updateFeeDistribution = async (req, res) => {
    try {
        const updatedFeeDistribution = await FeeDistribution.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFeeDistribution) {
            return res.status(404).json({ message: 'Fee distribution not found' });
        }
        res.status(200).json(updatedFeeDistribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a fee distribution by ID
exports.deleteFeeDistribution = async (req, res) => {
    try {
        const deletedFeeDistribution = await FeeDistribution.findByIdAndDelete(req.params.id);
        if (!deletedFeeDistribution) {
            return res.status(404).json({ message: 'Fee distribution not found' });
        }
        res.status(200).json({ message: 'Fee distribution deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get total fee amounts by category, grouped by grade, term, and year
exports.getTotalFeeAmountsByCategory = async (req, res) => {
    try {
        const { year, term, grade } = req.params;

        // Validate required parameters
        if (!year || !term || !grade) {
            return res.status(400).json({ message: 'Year, term, and grade are required in the URL path.' });
        }

        // Aggregation pipeline to group by category and calculate total fee amounts
        const result = await FeeDistribution.aggregate([
            {
                $match: { 
                    grade: grade, 
                    term: term, 
                    year: parseInt(year) // Convert year to a number
                }
            },
            {
                $group: {
                    _id: "$feesCategory", // Group by fees category
                    totalAmount: { $sum: "$feeAmount" } // Calculate total fee amount for each category
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    category: "$_id", // Rename _id to category
                    totalAmount: 1 // Include totalAmount field
                }
            }
        ]);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};