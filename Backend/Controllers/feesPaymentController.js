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

exports.getPaymentsWithStudentDetails = async (req, res) => {
    try {
        // Fetch payments with student details
        const paymentsWithStudents = await FeesPayment.aggregate([
            {
                $lookup: {
                    from: "learners", // Ensure this matches your learners collection name
                    localField: "regno",
                    foreignField: "regno",
                    as: "studentDetails"
                }
            },
            {
                $unwind: {
                    path: "$studentDetails",
                    preserveNullAndEmptyArrays: true // Keeps payments even if no student is found
                }
            },
            {
                $project: {
                    _id: 1,
                    regno: 1,
                    paymentDate: 1,
                    amountPaid: 1,
                    paymentMethod: 1,
                    receiptNumber: 1,
                    paidBy: 1,
                    remarks: 1,
                    "studentDetails.name": 1,
                    "studentDetails.stream": 1,
                    "studentDetails.class": 1
                }
            }
        ]);

        // Calculate total fees paid across all learners
        const totalFees = await FeesPayment.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amountPaid" } // Sum all payments
                }
            }
        ]);

        const totalAmountPaid = totalFees.length > 0 ? totalFees[0].totalAmount : 0;

        // Send response including payments and total fees
        res.status(200).json({
            totalFeesPaid: totalAmountPaid,
            payments: paymentsWithStudents
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get fees payment records by Reg No.
exports.getFeesPaymentsByRegNo = async (req, res) => {
    try {
        const { regno } = req.params;
        const feesPayments = await FeesPayment.find({ regno });

        if (!feesPayments.length) {
            return res.status(404).json({ message: "No payment records found for this registration number" });
        }

        res.status(200).json(feesPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
