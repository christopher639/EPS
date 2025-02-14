const FeeDistribution = require('../models/feeDistributionModel');

// 📌 Create a new fee distribution
exports.createFeeDistribution = async (req, res) => {
    try {
        const newFeeDistribution = new FeeDistribution(req.body);
        await newFeeDistribution.save();
        res.status(201).json(newFeeDistribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Get all fee distributions
exports.getAllFeeDistributions = async (req, res) => {
    try {
        const feeDistributions = await FeeDistribution.find();
        res.status(200).json(feeDistributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Get a single fee distribution by ID
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

// 📌 Update a fee distribution by ID
exports.updateFeeDistribution = async (req, res) => {
    try {
        const updatedFeeDistribution = await FeeDistribution.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (!updatedFeeDistribution) {
            return res.status(404).json({ message: 'Fee distribution not found' });
        }
        res.status(200).json(updatedFeeDistribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Delete a fee distribution by ID
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

// 📌 Get total fee amounts by grade, term, and studentType
exports.getFeeDistributionsByGroup = async (req, res) => {
    try {
        const { grade, term, studentType } = req.params;

        if (!grade || !term || !studentType) {
            return res.status(400).json({ message: "Grade, term, and studentType are required in the URL path." });
        }

        const feeDistributions = await FeeDistribution.find({
            grade: grade,
            term: term,
            studentType: studentType
        }).select("_id dateDistributed feesCategory feeAmount grade term studentType").lean();

        if (!feeDistributions.length) {
            return res.status(404).json({ message: "No fee distributions found for the given criteria." });
        }

        const overallFeesAmount = feeDistributions.reduce((sum, item) => sum + (item.feeAmount || 0), 0);

        res.status(200).json({
            overallFeesAmount,
            feeDistributions
        });

    } catch (error) {
        console.error("Error in getFeeDistributionsByGroup:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 📌 Get fee structure for every grade across all terms
exports.getFeeStructureByGrade = async (req, res) => {
    try {
        const result = await FeeDistribution.aggregate([
            {
                $group: {
                    _id: {
                        grade: "$grade",
                        term: "$term"
                    },
                    totalAmountPerTerm: { $sum: "$feeAmount" },
                    feeCategories: {
                        $push: {
                            category: "$feesCategory",
                            amount: "$feeAmount"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.grade",
                    terms: {
                        $push: {
                            term: "$_id.term",
                            totalAmount: "$totalAmountPerTerm",
                            feeCategories: "$feeCategories"
                        }
                    },
                    totalAmountAllTerms: { $sum: "$totalAmountPerTerm" }
                }
            },
            {
                $project: {
                    _id: 0,
                    grade: "$_id",
                    terms: 1,
                    totalAmountAllTerms: 1
                }
            },
            {
                $sort: { grade: 1 }
            }
        ]);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFeeStructureByStudentGrade = async (req, res) => {
    try {
        const { grade } = req.params;

        // Find the fee structure for the given grade
        const feeStructure = await FeeDistribution.aggregate([
            {
                $match: { grade: grade }
            },
            {
                $group: {
                    _id: {
                        grade: "$grade",
                        term: "$term"
                    },
                    totalAmountPerTerm: { $sum: "$feeAmount" },
                    feeCategories: {
                        $push: {
                            category: "$feesCategory",
                            amount: "$feeAmount"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.grade",
                    terms: {
                        $push: {
                            term: "$_id.term",
                            totalAmount: "$totalAmountPerTerm",
                            feeCategories: "$feeCategories"
                        }
                    },
                    totalAmountAllTerms: { $sum: "$totalAmountPerTerm" }
                }
            },
            {
                $project: {
                    _id: 0,
                    grade: "$_id",
                    terms: 1,
                    totalAmountAllTerms: 1
                }
            }
        ]);

        if (!feeStructure.length) {
            return res.status(404).json({ message: "Fee structure not found for this grade" });
        }

        res.status(200).json(feeStructure[0]); // Return only the first matching grade
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
