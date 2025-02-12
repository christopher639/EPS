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

// Get fee distributions and overall fee amount by year, grade, term, and studentType
exports.getFeeDistributionsByGroup = async (req, res) => {
    try {
        const { year, grade, term, studentType } = req.params;

        // Validate required parameters
        if (!year || !grade || !term || !studentType) {
            return res.status(400).json({ message: 'Year, grade, term, and studentType are required in the URL path.' });
        }

        // Find matching records
        const feeDistributions = await FeeDistribution.find({
            year: year,
            grade: grade,
            term: term,
            studentType: studentType
        }).select("_id dateDistributed feesCategory feeAmount grade term year studentType");

        // Calculate total fees amount
        const overallFeesAmount = feeDistributions.reduce((sum, item) => sum + item.feeAmount, 0);

        // Return data with overall fees amount
        res.status(200).json({
            overallFeesAmount,
            feeDistributions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get organized fee structure grouped by year and term
exports.getOrganizedFeeStructure = async (req, res) => {
    try {
        const { year, term } = req.params;

        // Validate required parameters
        if (!year || !term) {
            return res.status(400).json({ message: 'Year and term are required in the URL path.' });
        }

        // Aggregation pipeline
        const result = await FeeDistribution.aggregate([
            {
                $match: { year: year, term: term } // Filter by year and term
            },
            {
                $group: {
                    _id: {
                        grade: "$grade",
                        feesCategory: "$feesCategory"
                    },
                    totalAmount: { $sum: "$feeAmount" }
                }
            },
            {
                $group: {
                    _id: "$_id.grade",
                    feeCategories: {
                        $push: {
                            category: "$_id.feesCategory",
                            amount: "$totalAmount"
                        }
                    },
                    totalFeesAmount: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    grade: "$_id",
                    feeCategories: 1,
                    totalFeesAmount: 1
                }
            }
        ]);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


