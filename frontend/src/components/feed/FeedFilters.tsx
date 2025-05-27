"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import type { Pool } from "../../types"
import { apiRequest } from "../../utils/api"
import Card from "../ui/Card"

interface FeedFiltersProps {
  filters: {
    poolId: string
    sortBy: string
    mediaOnly: boolean
  }
  onFiltersChange: (filters: { poolId: string; sortBy: string; mediaOnly: boolean }) => void
}

const FeedFilters: React.FC<FeedFiltersProps> = ({ filters, onFiltersChange }) => {
  const { user } = useAuth()
  const [userPools, setUserPools] = useState<Pool[]>([])

  useEffect(() => {
    fetchUserPools()
  }, [])

  const fetchUserPools = async () => {
    try {
      const response = await apiRequest<{ joined: Pool[] }>("GET", "/users/my-pools")
      setUserPools(response.data.joined)
    } catch (error) {
      console.error("Failed to fetch user pools:", error)
    }
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Pool Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Pool:</label>
            <select
              value={filters.poolId}
              onChange={(e) => handleFilterChange("poolId", e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
            >
              <option value="all">All Pools</option>
              {userPools.map((pool) => (
                <option key={pool._id} value={pool._id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>

          {/* Media Only Filter */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.mediaOnly}
                onChange={(e) => handleFilterChange("mediaOnly", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Media only</span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.poolId !== "all" || filters.sortBy !== "recent" || filters.mediaOnly) && (
          <button
            onClick={() => onFiltersChange({ poolId: "all", sortBy: "recent", mediaOnly: false })}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    </Card>
  )
}

export default FeedFilters
