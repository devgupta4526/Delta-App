"use client"

import type React from "react"
import { useState, useRef } from "react"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  label?: string
  description?: string
  placeholder?: string
  maxTags?: number
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  label,
  description,
  placeholder = "Add a tag...",
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [suggestions] = useState([
    "Swimming",
    "Pool Party",
    "BBQ",
    "Music",
    "Games",
    "Relaxation",
    "Social",
    "Family Friendly",
    "Adults Only",
    "BYOB",
    "Food Included",
    "Outdoor",
    "Private",
    "Public",
    "Weekend",
    "Evening",
    "Afternoon",
    "Morning",
  ])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.some((tag) => tag.toLowerCase() === suggestion.toLowerCase()),
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.some((t) => t.toLowerCase() === trimmedTag.toLowerCase()) && tags.length < maxTags) {
      onChange([...tags, trimmedTag])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(e.target.value.length > 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {description && <span className="text-gray-500 font-normal"> - {description}</span>}
        </label>
      )}

      <div className="relative">
        <div className="min-h-[42px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {tags.length < maxTags && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                onFocus={() => setShowSuggestions(inputValue.length > 0)}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm"
              />
            )}
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>Press Enter or comma to add tags</span>
        <span>
          {tags.length}/{maxTags} tags
        </span>
      </div>
    </div>
  )
}

export default TagInput
