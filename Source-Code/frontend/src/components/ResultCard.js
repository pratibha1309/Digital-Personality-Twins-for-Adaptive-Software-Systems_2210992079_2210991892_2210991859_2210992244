import React, { useState } from "react"
import axios from "axios"

function getUserId() {
  let userId = localStorage.getItem("userId")
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("userId", userId)
  }
  return userId
}

function ResultCard({ item, index, setPersonality, searchTime, onLinkOpen }) {
  const [clicked, setClicked]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleClick = async () => {
    if (loading) return
    onLinkOpen()
    setLoading(true)

    const decisionTime = searchTime ? (Date.now() - searchTime) / 1000 : 0
    const scrollDepth  = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)) * 100
    ) || 0

    try {
      const res = await axios.post("http://localhost:5000/api/log", {
        userId:        getUserId(),
        query:         item.title,
        clickPosition: index,
        decisionTime:  parseFloat(decisionTime.toFixed(2)),
        scrollDepth:   scrollDepth,
        linksOpened:   index + 1
      })
      setPersonality(res.data.personality)
      localStorage.setItem("personality", res.data.personality)
    } catch (err) {
      console.error("Log error:", err)
    } finally {
      setClicked(true)
      setLoading(false)
    }

    window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`, "_blank")
  }

  // generate a soft color per card based on index
  const colors = [
    "from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800",
    "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800",
    "from-green-500/10 to-teal-500/10 border-green-200 dark:border-green-800",
    "from-orange-500/10 to-yellow-500/10 border-orange-200 dark:border-orange-800",
    "from-pink-500/10 to-rose-500/10 border-pink-200 dark:border-pink-800",
    "from-indigo-500/10 to-violet-500/10 border-indigo-200 dark:border-indigo-800",
  ]
  const colorClass = colors[index % colors.length]

  // stagger delay based on index (max 9 cards staggered)
  const staggerDelay = `${Math.min(index * 80, 700)}ms`

  return (
    <div
      onClick={handleClick}
      style={{ animationDelay: staggerDelay }}
      className={`group relative p-6 rounded-2xl border bg-gradient-to-br
        ${colorClass}
        dark:bg-gray-800/50
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 cursor-pointer
        animate-card-in
        ${clicked ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-gray-900" : ""}
      `}
    >
      {/* Result number badge */}
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
        {index + 1}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 pr-8 leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
        {item.title}
      </h3>

      {/* Snippet */}
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
        {item.snippet
          ? item.snippet.replace(/<[^>]+>/g, "")
          : "Click to explore this Wikipedia article."}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 dark:border-white/5">
        <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Wikipedia
        </span>

        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
          clicked
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : loading
            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400"
        }`}>
          {clicked ? "✓ Opened" : loading ? "Opening..." : "Open ↗"}
        </span>
      </div>
    </div>
  )
}

export default ResultCard
