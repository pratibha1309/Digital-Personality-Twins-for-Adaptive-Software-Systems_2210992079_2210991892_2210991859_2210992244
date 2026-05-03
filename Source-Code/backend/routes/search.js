// const express = require("express")
// const axios = require("axios")
// const Interaction = require("../models/interaction")

// const router = express.Router()

// router.get("/search",async(req,res)=>{

// const query = req.query.q

// const response = await axios.get(
// `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`
// )

// res.json(response.data.query.search)

// })

// router.post("/log",async(req,res)=>{

// const interaction = new Interaction(req.body)

// await interaction.save()

// res.json({message:"Data saved"})

// })

// module.exports = router

const axios = require("axios")
const express = require("express")

const router = express.Router()

router.get("/search", async (req,res)=>{

try{

const query = req.query.q

const response = await axios.get(
"https://en.wikipedia.org/w/api.php",
{
params:{
action:"query",
list:"search",
srsearch:query,
format:"json"
},
headers:{
"User-Agent":"adaptive-search-system"
}
}
)

res.json(response.data.query.search)

}catch(err){
console.log(err)
res.status(500).json({error:"Search failed"})
}

})

module.exports = router