import React, { useState, useRef, useEffect } from "react"
import axios from "axios"

const SUGGESTIONS = [
  "Artificial Intelligence", "Space Exploration", "Climate Change",
  "Quantum Computing", "Black Holes", "Machine Learning",
  "World War II", "DNA", "Solar System", "Blockchain",
  "Python Programming", "Human Brain", "Electric Vehicles"
]

const PLACEHOLDERS = [
  "Try 'Artificial Intelligence'...",
  "Try 'Space Exploration'...",
  "Try 'Climate Change'...",
  "Try 'Quantum Computing'...",
  "Try 'Black Holes'...",
]

const PERSONALITY_BADGES = [
  { emoji: "🧭", label: "Explorer", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { emoji: "🎯", label: "Focused",  color: "bg-green-500/20 text-green-300 border-green-500/30" },
  { emoji: "☕", label: "Casual",   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
]

function Hero({ setResults, setSearchTime }) {
  const [query, setQuery]             = useState("")
  const [loading, setLoading]         = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSugg, setShowSugg]       = useState(false)
  const [focused, setFocused]         = useState(false)
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0])
  const [videoEnded, setVideoEnded]   = useState(false)
  const inputRef   = useRef()
  const phIndexRef = useRef(0)

  // cycle placeholder text every 3s when input is empty and not focused
  useEffect(() => {
    if (focused || query) return
    const interval = setInterval(() => {
      phIndexRef.current = (phIndexRef.current + 1) % PLACEHOLDERS.length
      setPlaceholder(PLACEHOLDERS[phIndexRef.current])
    }, 3000)
    return () => clearInterval(interval)
  }, [focused, query])

  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return }
    setSuggestions(
      SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    )
  }, [query])

  const search = async (q = query) => {
    if (!q.trim()) return
    setQuery(q)
    setShowSugg(false)
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}`)
      setResults(res.data)
      setSearchTime(Date.now())
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden text-center py-24 px-4 text-white bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      {/* Background video — plays once then fades out */}
      <video
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoEnded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
          videoEnded ? "opacity-0" : "opacity-100"
        }`}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Floating blobs — visible after video ends */}
      <div className={`transition-opacity duration-1000 ${
        videoEnded ? "opacity-100" : "opacity-0"
      }`}>
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-pink-600/10 rounded-full blur-2xl pointer-events-none animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* All content above overlay */}
      <div className="relative z-20">

      {/* Headline */}
      <h1 className="text-6xl font-extrabold mb-4 leading-tight tracking-tight animate-fade-slide-up">
        Search That{" "}
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Knows You
        </span>
      </h1>

      <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto animate-fade-slide-up delay-200">
        Every click teaches the system your search personality.
        Discover whether you're an Explorer, Focused, or Casual searcher.
      </p>

      {/* Search bar */}
      <div className="flex justify-center animate-fade-slide-up delay-300">
        <div className="relative w-full max-w-xl">
          <div
            className={`flex rounded-2xl overflow-visible shadow-2xl shadow-purple-900/50 transition-all duration-300 ${
              focused ? "animate-glow" : ""
            }`}
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSugg(true) }}
                onKeyDown={(e) => e.key === "Enter" && search()}
                onFocus={() => { setFocused(true); setShowSugg(true) }}
                onBlur={() => { setFocused(false); setTimeout(() => setShowSugg(false), 150) }}
                placeholder={placeholder}
                className="w-full px-6 py-4 text-gray-800 dark:text-white dark:bg-gray-800 text-base focus:outline-none rounded-l-2xl transition-all duration-300"
              />

              {/* Suggestions */}
              {showSugg && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-pop-in">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onMouseDown={() => search(s)}
                      className="px-5 py-3 text-gray-700 dark:text-gray-200 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-3 transition"
                    >
                      <span className="text-purple-400">🔍</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => search()}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-r-2xl disabled:opacity-50 transition-all duration-200 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Searching
                </span>
              ) : "Search →"}
            </button>
          </div>
        </div>
      </div>

      {/* Personality badges — staggered */}
      <div className="flex justify-center gap-3 mt-10">
        {PERSONALITY_BADGES.map((b, i) => (
          <span
            key={b.label}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm animate-fade-slide-up ${b.color}`}
            style={{ animationDelay: `${400 + i * 100}ms` }}
          >
            {b.emoji} {b.label}
          </span>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Hero
