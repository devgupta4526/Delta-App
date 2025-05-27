"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import type { Post } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import CreatePostModal from "../components/feed/CreatePostModal"
import PostCard from "../components/feed/PostCard"
import FeedFilters from "../components/feed/FeedFilters"
import FeedStats from "../components/feed/FeedStats"

interface FeedData {
  posts: Post[]
  stats: {
    totalPosts: number
    totalLikes: number
    totalComments: number
    activePools: number
  }
  hasMore: boolean
  page: number
}

const FeedScreen: React.FC = () => {
  const { user } = useAuth()
  const [feedData, setFeedData] = useState<FeedData>({
    posts: [],
    stats: { totalPosts: 0, totalLikes: 0, totalComments: 0, activePools: 0 },
    hasMore: true,
    page: 1,
  })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [filters, setFilters] = useState({
    poolId: "all",
    sortBy: "recent",
    mediaOnly: false,
  })

  useEffect(() => {
    fetchFeed(true)
  }, [filters])

  const fetchFeed = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const queryParams = new URLSearchParams({
        page: reset ? "1" : feedData.page.toString(),
        limit: "10",
        sortBy: filters.sortBy,
        ...(filters.poolId !== "all" && { poolId: filters.poolId }),
        ...(filters.mediaOnly && { mediaOnly: "true" }),
      })

      const response = await apiRequest<{
        posts: Post[]
        stats: FeedData["stats"]
        hasMore: boolean
        page: number
        total: number
      }>("GET", `${API_ENDPOINTS.FEED_POSTS}?${queryParams.toString()}`)

      setFeedData((prev) => ({
        posts: reset
          ? response.data.posts || []
          : [...prev.posts, ...(response.data.posts || [])],
        stats: response.data.stats || prev.stats,
        hasMore: response.data.hasMore ?? prev.hasMore,
        page: response.data.page ?? prev.page,
      }))
      
    } catch (error) {
      console.error("Failed to fetch feed:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && feedData.hasMore) {
      setFeedData((prev) => ({ ...prev, page: prev.page + 1 }))
      fetchFeed(false)
    }
  }

  const handlePostCreate = (newPost: Post) => {
    setFeedData((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      stats: {
        ...prev.stats,
        totalPosts: prev.stats.totalPosts + 1,
      },
    }))
    setShowCreatePost(false)
  }

  const handlePostUpdate = useCallback((updatedPost: Post) => {
    setFeedData((prev) => ({
      ...prev,
      posts: prev.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    }))
  }, [])

  const handlePostDelete = useCallback((postId: string) => {
    setFeedData((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post._id !== postId),
      stats: {
        ...prev.stats,
        totalPosts: Math.max(0, prev.stats.totalPosts - 1),
      },
    }))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pool Feed</h1>
              <p className="text-gray-600 mt-1">Stay updated with posts from your joined pools</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setShowCreatePost(true)} size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <FeedStats stats={feedData.stats} />

        {/* Filters */}
        <FeedFilters filters={filters} onFiltersChange={setFilters} />

        {/* Posts */}
        <div className="space-y-6">
          {feedData.posts.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                {filters.poolId !== "all" || filters.mediaOnly
                  ? "No posts match your current filters. Try adjusting them to see more content."
                  : "Be the first to share something with your pool communities!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setShowCreatePost(true)}>Create Post</Button>
                {(filters.poolId !== "all" || filters.mediaOnly) && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ poolId: "all", sortBy: "recent", mediaOnly: false })}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <>
              {feedData.posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user!}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              ))}

              {/* Load More */}
              {feedData.hasMore && (
                <div className="text-center py-8">
                  <Button onClick={handleLoadMore} loading={loadingMore} variant="outline">
                    Load More Posts
                  </Button>
                </div>
              )}

              {!feedData.hasMore && feedData.posts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">You've reached the end of your feed!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handlePostCreate} />
    </div>
  )
}

export default FeedScreen
