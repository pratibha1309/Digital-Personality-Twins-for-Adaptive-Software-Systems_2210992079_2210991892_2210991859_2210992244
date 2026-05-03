import React, { useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ResultCard from "../components/ResultCard"

const PERSONALITY_INFO = {
  Explorer: {
    emoji: "🧭",
    desc: "You scroll deep and explore content thoroughly before clicking.",
    color: "from-blue-500/20 to-purple-500/20 border-blue-300 dark:border-blue-700",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
  },
  Focused: {
    emoji: "🎯",
    desc: "You decide fast and click early — you know exactly what you want.",
    color: "from-green-500/20 to-teal-500/20 border-green-300 dark:border-green-700",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
  },
  Casual: {
    emoji: "☕",
    desc: "You take your time reading before deciding, no rush at all.",
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-300 dark:border-yellow-700",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
  }
}

function Home() {
  const [results, setResults]         = useState([])
  const [personality, setPersonality] = useState(localStorage.getItem("personality") || "")
  const [searchTime, setSearchTime]   = useState(null)
  const [linksOpened, setLinksOpened] = useState(0)

  const handleNewResults = (data) => { setResults(data); setLinksOpened(0) }
  const handleLinkOpen   = () => setLinksOpened((prev) => prev + 1)
  const info = PERSONALITY_INFO[personality]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
      <Navbar />
      <Hero setResults={handleNewResults} setSearchTime={setSearchTime} />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Personality Card — pops in when detected */}
        {personality && info && (
          <div className={`mb-8 p-5 rounded-2xl border bg-gradient-to-r ${info.color} backdrop-blur-sm flex items-center gap-5 shadow-sm animate-pop-in`}>
            <div className="text-5xl">{info.emoji}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Your Search Personality
              </p>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-2xl font-extrabold text-gray-900 dark:text-white`}>
                  {personality}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${info.badge}`}>
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.desc}</p>
            </div>
            {linksOpened > 0 && (
              <div className="text-center px-5 border-l border-black/10 dark:border-white/10">
                <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{linksOpened}</p>
                <p className="text-xs text-gray-400 mt-0.5">links opened</p>
              </div>
            )}
          </div>
        )}

        {/* Results header */}
        {results.length > 0 && (
          <div className="flex items-center justify-between mb-6 animate-fade-slide-up">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Search Results
              <span className="ml-2 text-sm font-normal text-gray-400">
                {results.length} articles found
              </span>
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Click any result to track your behavior
            </span>
          </div>
        )}

        {/* Results grid */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-slide-up">
            {/* Animated search icon */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-400 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Start Searching
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm max-w-sm">
              Type anything in the search bar above. Your clicks will be analyzed to discover your search personality.
            </p>
            {/* Quick search chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Artificial Intelligence", "Space", "Climate Change", "DNA"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400 cursor-default"
                >
                  🔍 {s}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((item, index) => (
              <ResultCard
                key={index}
                item={item}
                index={index}
                setPersonality={setPersonality}
                searchTime={searchTime}
                onLinkOpen={handleLinkOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
