const mongoose = require("mongoose")

const behaviorSchema = new mongoose.Schema({
//   decisionTime: Number,
//   clickPosition: Number,
//   linksOpened: Number
userId:String,
query:String,
linksOpened:Number,
clickPosition:Number,
decisionTime:Number,
scrollDepth:Number
})

module.exports = mongoose.model("Behavior", behaviorSchema)