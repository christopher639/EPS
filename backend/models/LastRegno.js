// models/LastRegno.js
const mongoose = require('mongoose');

const lastRegnoSchema = new mongoose.Schema({
  lastRegno: {
    type: Number,
    required: true,
    default: 5000 // Initial default value
  }
});

module.exports = mongoose.model('LastRegno', lastRegnoSchema);
