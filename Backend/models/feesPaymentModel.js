const mongoose = require('mongoose');

const feesPaymentSchema = new mongoose.Schema({
    regno: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    receiptNumber: { type: String, required: true, unique: true },
    paidBy: { type: String, required: true },
});

const FeesPayment = mongoose.model('FeesPayment', feesPaymentSchema);

module.exports = FeesPayment;