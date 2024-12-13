const mongoose = require("mongoose")
const streamSchema = new mongoose.Schema({
     name :String,
     teacher :String,
},{
    timestamps:true
  })
const streamModel = mongoose.model.stream || mongoose.model("stream",streamSchema)
module.exports = streamModel