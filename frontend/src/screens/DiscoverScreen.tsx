"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { Pool } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"

const DiscoverScreen: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    tag: "",
  })

  useEffect(() => {
    fetchPools()
  }, [filters])

  const fetchPools = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()

      if (filters.location) queryParams.append("location", filters.location)
      if (filters.date) queryParams.append("date", filters.date)
      if (filters.tag) queryParams.append("tag", filters.tag)

      const response = await apiRequest<{
        total: number
        page: number
        limit: number
        pools: Pool[]
      }>("GET", `${API_ENDPOINTS.POOLS}?${queryParams.toString()}`)

      setPools(response?.data?.pools ?? [])

    } catch (error) {
      console.error("Failed to fetch pools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">Discovering amazing pools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Pool Parties
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find exciting events happening near you and connect with amazing people
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-12 backdrop-blur-sm bg-white/90" hover>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search by location"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              }
            />
            <Input
              label="Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <Input
              label="Tag"
              name="tag"
              value={filters.tag}
              onChange={handleFilterChange}
              placeholder="Search by tag"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
            />
          </div>
        </Card>

        {/* Pools Grid */}
        {pools.length === 0 ? (
          <Card className="text-center py-16 backdrop-blur-sm bg-white/90">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No pools found</h3>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your filters or create a new pool to get started</p>
            <Link to="/create-pool">
              <Button variant="gradient" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Pool
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pools.map((pool, index) => (
              <Card key={pool._id} className="overflow-hidden backdrop-blur-sm bg-white/90 group" hover>
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <img
                      src={pool.coverImage || "/placeholder.svg?height=200&width=300"}
                      alt={pool.name}
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
                        pool.status === "open"
                          ? "bg-green-500/90 text-white"
                          : pool.status === "closed"
                            ? "bg-yellow-500/90 text-white"
                            : "bg-red-500/90 text-white"
                      }`}
                    >
                      {pool.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {pool.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mt-2">{pool.description.overview}</p>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {pool.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      {pool.members.length}/{pool.maxMembers} members
                    </div>
                  </div>

                  {pool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pool.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {pool.tags.length > 3 && (
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{pool.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <Link to={`/pool/${pool._id}`}>
                    <Button className="w-full" size="md" variant="gradient">
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscoverScreen
