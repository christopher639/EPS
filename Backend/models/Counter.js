const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Identifier for the counter (e.g., "learnerRegNo")
  sequence_value: { type: Number, default: 0 }, // Current value of the counter
});

const Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;