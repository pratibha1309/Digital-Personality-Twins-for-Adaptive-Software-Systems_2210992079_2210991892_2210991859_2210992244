import React from "react"

function Recommendation({personality}){

return(

<div className="text-center mt-10">

<h2 className="text-2xl font-bold">
Your Search Personality
</h2>

<p className="text-xl text-purple-600">
{personality}
</p>

</div>

)

}

export default Recommendation