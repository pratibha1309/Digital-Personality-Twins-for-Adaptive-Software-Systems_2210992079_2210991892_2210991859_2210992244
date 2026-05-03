import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

function Navbar() {
  const navigate             = useNavigate()
  const location             = useLocation()
  const { user, logout }     = useAuth()
  const { dark, toggleDark } = useTheme()

  const navBtn = (label, path) => {
    const active = location.pathname === path
    return (
      <button
        onClick={() => navigate(path)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4
      bg-black/80 dark:bg-gray-950/90 backdrop-blur-md
      border-b border-white/10 text-white transition-colors"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg">
          A
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          AdaptiveSearch
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-base"
          title="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            {navBtn("Home", "/")}
            {navBtn("Insights", "/insights")}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
              <button
                onClick={() => { logout(); navigate("/login") }}
                className="text-xs text-red-400 hover:text-red-300 transition ml-1"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-300 hover:text-white px-3 py-1.5 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-full transition shadow-lg shadow-purple-500/20"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
