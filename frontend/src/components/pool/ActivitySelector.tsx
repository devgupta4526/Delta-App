"use client"

import type React from "react"
import { useState } from "react"

interface ActivitySelectorProps {
  selectedActivities: string[]
  onChange: (activities: string[]) => void
  error?: string
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({ selectedActivities, onChange, error }) => {
  const [customActivity, setCustomActivity] = useState("")

  const predefinedActivities = [
    { name: "Swimming", icon: "🏊‍♀️" },
    { name: "Pool Games", icon: "🎯" },
    { name: "Water Volleyball", icon: "🏐" },
    { name: "BBQ/Grilling", icon: "🔥" },
    { name: "Music & Dancing", icon: "🎵" },
    { name: "Socializing", icon: "💬" },
    { name: "Sunbathing", icon: "☀️" },
    { name: "Pool Basketball", icon: "🏀" },
    { name: "Water Aerobics", icon: "💪" },
    { name: "Relaxation", icon: "🧘‍♀️" },
    { name: "Photography", icon: "📸" },
    { name: "Food & Drinks", icon: "🍹" },
  ]

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      onChange(selectedActivities.filter((a) => a !== activity))
    } else {
      onChange([...selectedActivities, activity])
    }
  }

  const addCustomActivity = () => {
    const trimmed = customActivity.trim()
    if (trimmed && !selectedActivities.includes(trimmed)) {
      onChange([...selectedActivities, trimmed])
      setCustomActivity("")
    }
  }

  const handleCustomActivityKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCustomActivity()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Activities <span className="text-red-500">*</span>
      </label>

      {/* Predefined Activities */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {predefinedActivities.map((activity) => (
          <button
            key={activity.name}
            type="button"
            onClick={() => toggleActivity(activity.name)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedActivities.includes(activity.name)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300 text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{activity.icon}</span>
              <span className="text-sm font-medium">{activity.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Activity Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={customActivity}
          onChange={(e) => setCustomActivity(e.target.value)}
          onKeyPress={handleCustomActivityKeyPress}
          placeholder="Add custom activity..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button
          type="button"
          onClick={addCustomActivity}
          disabled={!customActivity.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Add
        </button>
      </div>

      {/* Selected Activities */}
      {selectedActivities.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Activities:</p>
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map((activity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {activity}
                <button
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default ActivitySelector
