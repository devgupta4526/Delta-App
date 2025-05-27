"use client"

import type React from "react"

interface PoolFiltersProps {
  filters: {
    status: string
    dateRange: string
    sortBy: string
  }
  onFiltersChange: (filters: { status: string; dateRange: string; sortBy: string }) => void
}

const PoolFilters: React.FC<PoolFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date:</label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="members">Members</option>
          <option value="created">Created</option>
        </select>
      </div>
    </div>
  )
}

export default PoolFilters
