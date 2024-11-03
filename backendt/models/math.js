const mongoose = require("mongoose")

const mathSchema = new mongoose.Schema({
    regno :String,
    score : Number
},{
    timestamps:true
  })

const mathModel = mongoose.model.mathmark || mongoose.model("mathmark",mathSchema)
module.exports = mathModel