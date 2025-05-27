"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { Pool } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Card from "../ui/Card"
import Button from "../ui/Button"
import PoolActionsMenu from "./PoolActionsMenu"

interface PoolCardProps {
  pool: Pool
  isCreator: boolean
  onUpdate: (pool: Pool) => void
  onDelete: (poolId: string) => void
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, isCreator, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isUpcoming = date > now

    return {
      formatted: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUpcoming,
      isPast: date < now,
      isToday: date.toDateString() === now.toDateString(),
    }
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

  const handleLeavePool = async () => {
    if (!confirm("Are you sure you want to leave this pool?")) return

    try {
      setLoading(true)
      await apiRequest("DELETE", API_ENDPOINTS.WITHDRAW_REQUEST.replace(":id", pool._id))
      // Remove the pool from joined pools
      onDelete(pool._id)
    } catch (error: any) {
      console.error("Failed to leave pool:", error)
      alert(error.message || "Failed to leave pool")
    } finally {
      setLoading(false)
    }
  }

  const dateInfo = formatDate(pool.date)
  const hasUnreadMessages = false // This would come from your chat system
  const hasJoinRequests = isCreator && pool.joinRequests.length > 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group" padding="none">
      <div className="relative">
        {/* Cover Image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={pool.coverImage || "/placeholder.svg?height=200&width=300"}
            alt={pool.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pool.status)}`}>
            {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <PoolActionsMenu pool={pool} isCreator={isCreator} onUpdate={onUpdate} onDelete={onDelete} />
        </div>

        {/* Notifications */}
        {(hasUnreadMessages || hasJoinRequests) && (
          <div className="absolute bottom-3 right-3 flex space-x-2">
            {hasUnreadMessages && (
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" title="Unread messages" />
            )}
            {hasJoinRequests && (
              <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white" title="Join requests" />
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Pool Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{pool.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{pool.description.overview}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{pool.location}</span>
          </div>

          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span
              className={
                dateInfo.isUpcoming
                  ? dateInfo.isToday
                    ? "text-orange-600 font-medium"
                    : "text-green-600"
                  : "text-gray-500"
              }
            >
              {dateInfo.formatted}
            </span>
            {dateInfo.isToday && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Today</span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span>
                {pool.members.length}/{pool.maxMembers} members
              </span>
            </div>

            {isCreator && pool.joinRequests.length > 0 && (
              <span className="text-orange-600 font-medium text-xs">
                {pool.joinRequests.length} request{pool.joinRequests.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {pool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {pool.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {tag}
              </span>
            ))}
            {pool.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">+{pool.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link to={`/pool/${pool._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>

          {isCreator ? (
            <Link to={`/pool/${pool._id}/chat`}>
              <Button size="sm" className="relative">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Chat
                {hasUnreadMessages && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />}
              </Button>
            </Link>
          ) : (
            <Button onClick={handleLeavePool} loading={loading} variant="outline" size="sm">
              Leave
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PoolCard
