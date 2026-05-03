const mongoose = require("mongoose")

const InteractionSchema = new mongoose.Schema({

userId:String,
query:String,
linksOpened:Number,
clickPosition:Number,
decisionTime:Number,
scrollDepth:Number

})

module.exports = mongoose.model("Interaction",InteractionSchema)