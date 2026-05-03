const express = require("express")
const router = express.Router()

const Interaction = require("../models/interaction")

router.post("/interaction", async(req,res)=>{

const data = new Interaction(req.body)

await data.save()

res.json({message:"interaction saved"})

})

module.exports = router