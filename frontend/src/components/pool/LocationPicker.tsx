"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Input from "../ui/Input"

interface LocationPickerProps {
  value: string
  coordinates: number[]
  onChange: (location: string, coordinates: number[]) => void
  error?: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, coordinates, onChange, error }) => {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced search for location suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.length > 2) {
        searchLocations(value)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  const searchLocations = async (query: string) => {
    try {
      setLoading(true)
      // Using a free geocoding service (you can replace with Google Places API if you have a key)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&types=place,locality,neighborhood,address`,
      )

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.features || [])
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Failed to search locations:", error)
      // Fallback: create a simple suggestion based on input
      setSuggestions([
        {
          place_name: value,
          center: [0, 0], // Default coordinates
        },
      ])
      setShowSuggestions(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (suggestion: any) => {
    onChange(suggestion.place_name, suggestion.center)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
            )

            if (response.ok) {
              const data = await response.json()
              const place = data.features[0]
              if (place) {
                onChange(place.place_name, [longitude, latitude])
              }
            }
          } catch (error) {
            console.error("Failed to get location name:", error)
            onChange(`${latitude}, ${longitude}`, [longitude, latitude])
          }
        },
        (error) => {
          console.error("Failed to get current location:", error)
          alert("Failed to get your current location. Please enter manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            label="Location"
            value={value}
            onChange={(e) => onChange(e.target.value, coordinates)}
            error={error}
            placeholder="Enter location (e.g., Central Park, New York)"
            required
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            title="Use current location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Location Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Searching...
              </div>
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{suggestion.place_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationPicker
