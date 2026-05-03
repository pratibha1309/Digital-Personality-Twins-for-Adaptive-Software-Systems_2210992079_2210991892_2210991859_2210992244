import React, { useState } from "react"
import axios from "axios"

function SearchBar({ setResults, setSearchTime }) {

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await axios.get(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
      )
      setResults(res.data)
      setSearchTime(Date.now())
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search()
  }

  return (
    <div className="flex justify-center mt-8 px-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search something..."
        className="p-3 border border-gray-300 rounded-l-lg w-96 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={search}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg disabled:opacity-50 transition"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  )
}

export default SearchBar
