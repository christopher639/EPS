const mongoose = require("mongoose")

const engSchema = new mongoose.Schema({
    regno :String,
    score : Number
},{
    timestamps:true
  })

const engModel = mongoose.model.englishmark || mongoose.model("englishmark",engSchema)
module.exports = engModel