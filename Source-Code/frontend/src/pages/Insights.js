import React, { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from "recharts"

const PERSONALITY_EMOJI = { Explorer: "🧭", Focused: "🎯", Casual: "☕" }
const PIE_COLORS = ["#7c3aed", "#10b981", "#f59e0b"]

const PERSONALITY_DETAILS = {
  Explorer: {
    emoji:       "🧭",
    color:       "from-blue-600 to-purple-600",
    bg:          "from-blue-500/10 to-purple-500/10",
    border:      "border-blue-300 dark:border-blue-700",
    badge:       "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    tag:         "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    desc:        "You explore deeply before deciding. High scroll depth and moderate decision time define your style.",
    traits:      ["Deep Reader", "Thorough", "Curious"]
  },
  Focused: {
    emoji:       "🎯",
    color:       "from-green-600 to-teal-600",
    bg:          "from-green-500/10 to-teal-500/10",
    border:      "border-green-300 dark:border-green-700",
    badge:       "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    tag:         "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    desc:        "You know what you want. Fast decisions and low scroll depth show laser-sharp focus.",
    traits:      ["Fast Decider", "Precise", "Efficient"]
  },
  Casual: {
    emoji:       "☕",
    color:       "from-yellow-500 to-orange-500",
    bg:          "from-yellow-500/10 to-orange-500/10",
    border:      "border-yellow-300 dark:border-yellow-700",
    badge:       "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    tag:         "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300",
    desc:        "You take your time and browse without pressure. Slow decisions with low scroll depth.",
    traits:      ["Relaxed", "Patient", "Laid-back"]
  }
}

// classify a single behavior record into a personality
function classifyBehavior(b) {
  if (b.scrollDepth > 60)       return "Explorer"
  if (b.decisionTime < 30)      return "Focused"
  return "Casual"
}

function Insights() {
  const [behaviors, setBehaviors] = useState([])
  const [loading, setLoading]     = useState(true)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/behaviors?userId=${userId}`)
        setBehaviors(res.data)
      } catch (err) {
        console.error("Failed to fetch behaviors:", err)
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchData()
    else setLoading(false)
  }, [userId])

  // ── Stats ──
  const avgDecisionTime = behaviors.length
    ? (behaviors.reduce((s, b) => s + b.decisionTime, 0) / behaviors.length).toFixed(1) : 0
  const avgScrollDepth = behaviors.length
    ? (behaviors.reduce((s, b) => s + b.scrollDepth, 0) / behaviors.length).toFixed(1) : 0

  // ── Overall personality from full history ──
  const personalityCount = { Explorer: 0, Focused: 0, Casual: 0 }
  behaviors.forEach(b => { personalityCount[classifyBehavior(b)]++ })

  const overallPersonality = behaviors.length
    ? Object.entries(personalityCount).sort((a, b) => b[1] - a[1])[0][0]
    : null

  const overallInfo = overallPersonality ? PERSONALITY_DETAILS[overallPersonality] : null

  // ── Chart data ──
  const barData = [
    { name: "Decision Time (s)", value: parseFloat(avgDecisionTime) },
    { name: "Scroll Depth (%)",  value: parseFloat(avgScrollDepth) },
    { name: "Avg Click Pos",
      value: behaviors.length
        ? parseFloat((behaviors.reduce((s, b) => s + b.clickPosition, 0) / behaviors.length).toFixed(1))
        : 0
    }
  ]

  const trendData = behaviors.map((b, i) => ({
    search: `#${i + 1}`, decisionTime: b.decisionTime, scrollDepth: b.scrollDepth
  }))

  const pieData = Object.entries(personalityCount)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  // ── Personality streak in history ──
  const behaviorWithPersonality = behaviors.slice().reverse().map((b, i) => ({
    ...b,
    index:       behaviors.length - i,
    personality: classifyBehavior(b)
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Your Search Insights</h2>
        <p className="text-gray-400 mb-8">Based on your complete search history on this device.</p>

        {/* ── Overall Personality Hero Card ── */}
        {overallPersonality && overallInfo && (
          <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${overallInfo.bg} ${overallInfo.border} p-8 mb-10 animate-fade-slide-up`}>

            {/* Big background emoji */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none pointer-events-none">
              {overallInfo.emoji}
            </div>

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Overall Search Personality
              </p>

              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{overallInfo.emoji}</span>
                <div>
                  <h3 className={`text-4xl font-extrabold bg-gradient-to-r ${overallInfo.color} bg-clip-text text-transparent`}>
                    {overallPersonality}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 max-w-md">
                    {overallInfo.desc}
                  </p>
                </div>
              </div>

              {/* Trait badges */}
              <div className="flex gap-2 mt-4">
                {overallInfo.traits.map(t => (
                  <span key={t} className={`px-3 py-1 rounded-full text-xs font-semibold ${overallInfo.badge}`}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Personality breakdown mini stats */}
              <div className="flex gap-6 mt-5 pt-5 border-t border-black/10 dark:border-white/10">
                {Object.entries(personalityCount).map(([name, count]) => (
                  <div key={name} className="text-center">
                    <p className="text-xl font-bold text-gray-800 dark:text-white">{count}</p>
                    <p className="text-xs text-gray-400">{PERSONALITY_EMOJI[name]} {name}</p>
                  </div>
                ))}
                <div className="text-center ml-auto">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{behaviors.length}</p>
                  <p className="text-xs text-gray-400">Total Searches</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-blue-600">{behaviors.length}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Total Searches</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{avgDecisionTime}s</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Avg Decision Time</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{avgScrollDepth}%</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Avg Scroll Depth</p>
          </div>
        </div>

        {behaviors.length > 0 && (
          <>
            {/* ── Bar + Pie ── */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Behavior Overview</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Personality Distribution</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={4} dataKey="value"
                        label={({ name, percent }) =>
                          `${PERSONALITY_EMOJI[name]} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-sm text-center mt-10">Not enough data yet</p>
                )}
              </div>
            </div>

            {/* ── Trend line ── */}
            {trendData.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Behavior Trend Over Searches</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="search" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="decisionTime" stroke="#7c3aed" strokeWidth={2} dot={false} name="Decision Time (s)" />
                    <Line type="monotone" dataKey="scrollDepth"  stroke="#10b981" strokeWidth={2} dot={false} name="Scroll Depth (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* ── History Table with per-row personality ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Search History</h3>
            {behaviors.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {behaviors.length} records
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading...</p>
          ) : behaviors.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No data yet — go search something first!</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Query</th>
                  <th className="px-6 py-3 text-left">Personality</th>
                  <th className="px-6 py-3 text-left">Decision Time</th>
                  <th className="px-6 py-3 text-left">Scroll Depth</th>
                  <th className="px-6 py-3 text-left">Click Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {behaviorWithPersonality.map((b, i) => {
                  const pInfo = PERSONALITY_DETAILS[b.personality]
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 dark:text-gray-500">{b.index}</td>
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200 max-w-[180px] truncate">
                        {b.query}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pInfo.tag}`}>
                          {pInfo.emoji} {b.personality}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.decisionTime}s</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.scrollDepth}%</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">#{b.clickPosition + 1}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Insights
