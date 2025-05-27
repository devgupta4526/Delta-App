"use client"

import type React from "react"
import { Link } from "react-router-dom"
import type { Pool } from "../../types"
import { useSocket } from "../../context/SocketContext"

interface ChatHeaderProps {
  pool: Pool
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ pool }) => {
  const { isConnected } = useSocket()

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/pool/${pool._id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="flex items-center space-x-3">
            <img
              src={pool.coverImage || "/placeholder.svg?height=40&width=40"}
              alt={pool.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{pool.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{pool.members.length} members</span>
                <span>•</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/pool/${pool._id}`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
