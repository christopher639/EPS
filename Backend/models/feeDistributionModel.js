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
     { type: String }
},{
    timestamps:true
});

const FeeDistribution = mongoose.model('FeeDistribution', feeDistributionSchema);

module.exports = FeeDistribution;