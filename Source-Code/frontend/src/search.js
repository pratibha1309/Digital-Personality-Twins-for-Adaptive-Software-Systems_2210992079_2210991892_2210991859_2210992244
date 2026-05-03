// import React,{useState} from "react"
// import axios from "axios"

// function Search(){

// const [query,setQuery] = useState("")
// const [results,setResults] = useState([])

// const search = async ()=>{

// const res = await axios.get(
// `http://localhost:5000/api/search?q=${query}`
// )

// setResults(res.data)

// }

// return(

// <div>

// <h2>Adaptive Search System</h2>

// <input
// value={query}
// onChange={(e)=>setQuery(e.target.value)}
// />

// <button onClick={search}>
// Search
// </button>

// <ul>

// {results.map((item,index)=>(
// <li key={index}>
// {item.title}
// </li>
// ))}

// </ul>

// </div>

// )

// }

// export default Search

// import React,{useState} from "react"
// import axios from "axios"

// function Search(){

// const [query,setQuery] = useState("")
// const [results,setResults] = useState([])
// const [startTime,setStartTime] = useState(null)
// const [linksOpened,setLinksOpened] = useState(0)

// const search = async ()=>{

// // start timer when search begins
// setStartTime(Date.now())

// // reset link counter
// setLinksOpened(0)

// const res = await axios.get(
// `http://localhost:5000/api/search?q=${query}`
// )

// setResults(res.data)

// }

// // function runs when user clicks a result
// const handleClick = async(position)=>{

// const decisionTime = Date.now() - startTime

// const openedLinks = linksOpened + 1
// setLinksOpened(openedLinks)

// await axios.post("http://localhost:5000/api/log",{

// userId:"user1",
// query:query,
// linksOpened:openedLinks,
// clickPosition:position,
// decisionTime:decisionTime,
// scrollDepth:window.scrollY

// })

// }

// return(

// <div style={{padding:"40px"}}>

// <h2>Adaptive Search System</h2>

// <input
// value={query}
// onChange={(e)=>setQuery(e.target.value)}
// placeholder="Search here"
// />

// <button onClick={search}>
// Search
// </button>

// <ul>

// {results.map((item,index)=>(

// <li
// key={index}
// onClick={()=>handleClick(index)}
// style={{cursor:"pointer",margin:"10px"}}
// >

// {item.title}

// </li>

// ))}

// </ul>

// </div>

// )

// }

// export default Search

// import React,{useState,useEffect} from "react"
// import axios from "axios"

// function Search(){

// const [query,setQuery] = useState("")
// const [results,setResults] = useState([])
// const [startTime,setStartTime] = useState(0)

// const search = async ()=>{

// setStartTime(Date.now())

// const res = await axios.get(
// `http://localhost:5000/api/search?q=${query}`
// )

// setResults(res.data)

// }

// const handleClick = async (index)=>{

// const decisionTime = (Date.now() - startTime)/1000

// await axios.post("http://localhost:5000/api/interaction",{
// query:query,
// clickPosition:index,
// decisionTime:decisionTime,
// linksOpened:1,
// scrollDepth:window.scrollY
// })

// }

// return(

// <div>

// {/* <h2>Adaptive Search System</h2> */}

// <input
// value={query}
// onChange={(e)=>setQuery(e.target.value)}
// />

// <button onClick={search}>
// Search
// </button>

// <ul>

// {results.map((item,index)=>(
// <li key={index} onClick={()=>handleClick(index)}>
// {item.title}
// </li>
// ))}

// </ul>

// </div>

// )

// }

// export default Search

import React, { useState } from "react"
import axios from "axios"

function Search() {

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [startTime, setStartTime] = useState(0)

  // 🔍 Search Function
  const search = async () => {
    try {
      setStartTime(Date.now())

      const res = await axios.get(
        `http://localhost:5000/api/search?q=${query}`
      )

      setResults(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  // 🧠 Handle Click (Behavior Tracking)
  const handleClick = async (position) => {
    console.log("CLICK FUNCTION CALLED")
    try {
      const decisionTime = Date.now() - startTime
      console.log("Sending data...")

      await axios.post("http://localhost:5000/api/log", {
        query: query,
        decisionTime,
        clickPosition: position,
        linksOpened: results.length
      })

      alert("Behavior Logged!")

    } catch (error) {
      console.error("ERROR:", error)
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

      <h2>Adaptive Search System</h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anything..."
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={search} style={{ padding: "10px 20px" }}>
        Search
      </button>

      <div style={{ marginTop: "50px" }}>
  <h3>Search Results</h3>

  {results.map((item, index) => (
    <div
      key={index}
      onClick={() => handleClick(index)}
      style={{
        cursor: "pointer",
        padding: "10px",
        borderBottom: "1px solid #ccc"
      }}
    >
      {item.title}
    </div>
  ))}
</div>

    </div>
  )
}

export default Search