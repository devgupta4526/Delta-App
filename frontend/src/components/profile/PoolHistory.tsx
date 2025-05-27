"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { Pool } from "../../types"
import Card from "../ui/Card"

interface PoolHistoryProps {
  createdPools: Pool[]
  joinedPools: Pool[]
  isOwnProfile: boolean
}

const PoolHistory: React.FC<PoolHistoryProps> = ({ createdPools, joinedPools, isOwnProfile }) => {
  const [activeSection, setActiveSection] = useState<"created" | "joined">("created")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderPoolCard = (pool: Pool) => (
    <Link key={pool._id} to={`/pool/${pool._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" padding="none">
        <div className="flex">
          <img
            src={pool.coverImage || "/placeholder.svg?height=120&width=160"}
            alt={pool.name}
            className="w-40 h-30 object-cover rounded-l-lg"
          />
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{pool.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{pool.description.overview}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pool.status)}`}>
                {pool.status}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {pool.location}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(pool.date)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  {pool.members.length}/{pool.maxMembers} members
                </div>

                {pool.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {pool.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {pool.tags.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{pool.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection("created")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeSection === "created" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {isOwnProfile ? "Created by Me" : "Created"} ({createdPools.length})
        </button>
        <button
          onClick={() => setActiveSection("joined")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeSection === "joined" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {isOwnProfile ? "Joined by Me" : "Joined"} ({joinedPools.length})
        </button>
      </div>

      {/* Pool List */}
      <div className="space-y-4">
        {activeSection === "created" ? (
          createdPools.length > 0 ? (
            createdPools.map(renderPoolCard)
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isOwnProfile ? "No pools created yet" : "No pools created"}
              </h3>
              <p className="text-gray-600">
                {isOwnProfile ? "Start by creating your first pool!" : "This user hasn't created any pools yet."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/create-pool"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  Create Pool
                </Link>
              )}
            </Card>
          )
        ) : joinedPools.length > 0 ? (
          joinedPools.map(renderPoolCard)
        ) : (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isOwnProfile ? "No pools joined yet" : "No pools joined"}
            </h3>
            <p className="text-gray-600">
              {isOwnProfile ? "Discover and join pools in your area!" : "This user hasn't joined any pools yet."}
            </p>
            {isOwnProfile && (
              <Link
                to="/discover"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-4"
              >
                Discover Pools
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default PoolHistory
