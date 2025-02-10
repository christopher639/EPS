const mongoose = require('mongoose');

const feeDistributionSchema = new mongoose.Schema({
    dateDistributed:
     { type: Date },
    feesCategory:
     { type: String},
    feeAmount:
     { type: Number },
    grade:
     { type: String },
    term:
     { type: String },
    year:
     { type: String },
    studentType: 
    { type: String }
});

const FeeDistribution = mongoose.model('FeeDistribution', feeDistributionSchema);

module.exports = FeeDistribution;