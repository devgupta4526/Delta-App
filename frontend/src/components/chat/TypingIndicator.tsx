"use client"

import type React from "react"
import type { User } from "../../types"

interface TypingIndicatorProps {
  users: User[]
  currentUser: User
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users, currentUser }) => {
  const typingUsers = users.filter((user) => user._id !== currentUser._id)

  if (typingUsers.length === 0) {
    return null
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].fullName} is typing...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].fullName} and ${typingUsers[1].fullName} are typing...`
    } else {
      return `${typingUsers[0].fullName} and ${typingUsers.length - 1} others are typing...`
    }
  }

  return (
    <div className="px-4 py-2 text-sm text-gray-500">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <span>{getTypingText()}</span>
      </div>
    </div>
  )
}

export default TypingIndicator
