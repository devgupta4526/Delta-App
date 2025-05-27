"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Pool } from "../types"
import { apiRequest } from "../utils/api"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import MyPoolsStats from "../components/mypools/MyPoolsStats"
import PoolCard from "../components/mypools/PoolCard"
import PoolFilters from "../components/mypools/PoolFilters"
import QuickActions from "../components/mypools/QuickActions"

interface MyPoolsData {
  created: Pool[]
  joined: Pool[]
  stats: {
    totalCreated: number
    totalJoined: number
    totalMembers: number
    upcomingEvents: number
    completedEvents: number
    averageRating: number
  }
}

const MyPoolsScreen: React.FC = () => {
  const { user } = useAuth()
  const [poolsData, setPoolsData] = useState<MyPoolsData>({
    created: [],
    joined: [],
    stats: {
      totalCreated: 0,
      totalJoined: 0,
      totalMembers: 0,
      upcomingEvents: 0,
      completedEvents: 0,
      averageRating: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    sortBy: "date",
  })

  useEffect(() => {
    fetchMyPools()
  }, [])

  const fetchMyPools = async () => {
    try {
      setLoading(true)
      const response = await apiRequest<MyPoolsData>("GET", "/users/my-pools")
      setPoolsData(response.data)
    } catch (error) {
      console.error("Failed to fetch my pools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePoolUpdate = (updatedPool: Pool) => {
    setPoolsData((prev) => ({
      ...prev,
      created: prev.created.map((pool) => (pool._id === updatedPool._id ? updatedPool : pool)),
      joined: prev.joined.map((pool) => (pool._id === updatedPool._id ? updatedPool : pool)),
    }))
  }

  const handlePoolDelete = (poolId: string) => {
    setPoolsData((prev) => ({
      ...prev,
      created: prev.created.filter((pool) => pool._id !== poolId),
      joined: prev.joined.filter((pool) => pool._id !== poolId),
    }))
  }

  const filterPools = (pools: Pool[]) => {
    let filtered = pools

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (pool) =>
          pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((pool) => pool.status === filters.status)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const poolDate = new Date(pools[0]?.date || now)

      switch (filters.dateRange) {
        case "upcoming":
          filtered = filtered.filter((pool) => new Date(pool.date) > now)
          break
        case "past":
          filtered = filtered.filter((pool) => new Date(pool.date) < now)
          break
        case "thisWeek":
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((pool) => {
            const date = new Date(pool.date)
            return date > now && date < weekFromNow
          })
          break
        case "thisMonth":
          const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
          filtered = filtered.filter((pool) => {
            const date = new Date(pool.date)
            return date > now && date < monthFromNow
          })
          break
      }
    }

    // Sort
    switch (filters.sortBy) {
      case "date":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "members":
        filtered.sort((a, b) => b.members.length - a.members.length)
        break
      case "created":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }

  const currentPools = activeTab === "created" ? poolsData.created : poolsData.joined
  const filteredPools = filterPools(currentPools)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Pools</h1>
              <p className="text-gray-600 mt-1">Manage your created and joined pools</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/create-pool">
                <Button size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Pool
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <MyPoolsStats stats={poolsData.stats} />

        {/* Quick Actions */}
        <QuickActions onRefresh={fetchMyPools} />

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pools by name, location, or tags..."
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                />
              </div>
              <PoolFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("created")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "created" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Created by Me ({poolsData.created.length})
              </button>
              <button
                onClick={() => setActiveTab("joined")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "joined" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Joined by Me ({poolsData.joined.length})
              </button>
            </div>
          </div>
        </Card>

        {/* Results Info */}
        {searchQuery || filters.status !== "all" || filters.dateRange !== "all" ? (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPools.length} of {currentPools.length} pools
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilters({ status: "all", dateRange: "all", sortBy: "date" })
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {/* Pools Grid */}
        {filteredPools.length === 0 ? (
          <Card className="text-center py-12">
            {currentPools.length === 0 ? (
              <>
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
                  {activeTab === "created" ? "No pools created yet" : "No pools joined yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === "created"
                    ? "Start by creating your first pool and bring people together!"
                    : "Discover and join pools in your area to start connecting with others."}
                </p>
                <Link to={activeTab === "created" ? "/create-pool" : "/discover"}>
                  <Button>{activeTab === "created" ? "Create Pool" : "Discover Pools"}</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pools match your filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setFilters({ status: "all", dateRange: "all", sortBy: "date" })
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clear all filters
                </button>
              </>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => (
              <PoolCard
                key={pool._id}
                pool={pool}
                isCreator={activeTab === "created"}
                onUpdate={handlePoolUpdate}
                onDelete={handlePoolDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPoolsScreen
