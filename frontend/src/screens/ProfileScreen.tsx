"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { User, Pool, Review } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import ProfileHeader from "../components/profile/ProfileHeader"
import ProfileTabs from "../components/profile/ProfileTabs"
import PoolHistory from "../components/profile/PoolHistory"
import ReviewsList from "../components/profile/ReviewsList"
import EditProfileModal from "../components/profile/EditProfileModal"
import CreateReviewModal from "../components/profile/CreateReviewModal"
import Glass from "../components/ui/Glass"

const ProfileScreen: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [userPools, setUserPools] = useState<{
    created: Pool[]
    joined: Pool[]
  }>({
    created: [],
    joined: [],
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"pools" | "reviews">("pools")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    if (username) {
      fetchUserProfile()
    }
  }, [username])

  const fetchUserProfile = async () => {
    if (!username) return

    try {
      setLoading(true)

      // Fetch user profile
      const userResponse = await apiRequest<User>("GET", `/users/profile/${username}`)
      setProfileUser(userResponse.data)

      // Fetch user's pools
      const poolsResponse = await apiRequest<{
        created: Pool[]
        joined: Pool[]
      }>("GET", `/users/${userResponse.data._id}/pools`)
      setUserPools(poolsResponse.data)

      // Fetch user's reviews
      const reviewsResponse = await apiRequest<Review[]>(
        "GET",
        API_ENDPOINTS.USER_REVIEWS.replace(":userId", userResponse.data._id),
      )
      setReviews(reviewsResponse.data)

      // Fetch average rating
      const ratingResponse = await apiRequest<{ averageRating: number }>(
        "GET",
        API_ENDPOINTS.AVERAGE_RATING.replace(":userId", userResponse.data._id),
      )
      setAverageRating(ratingResponse.data.averageRating)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      navigate("/discover")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setProfileUser(updatedUser)
    setShowEditModal(false)
  }

  const handleReviewSubmit = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev])
    setShowReviewModal(false)
    // Recalculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating
    setAverageRating(totalRating / (reviews.length + 1))
  }

  const isOwnProfile = currentUser && profileUser && currentUser._id === profileUser._id
  const canReview = currentUser && profileUser && currentUser._id !== profileUser._id

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Glass variant="colored" className="p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Loading profile...</p>
          </div>
        </Glass>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card glass variant="glass-colored" className="text-center max-w-md">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User not found</h2>
            <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/discover")} variant="gradient">
              Back to Discover
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Profile Header */}
        <ProfileHeader
          user={profileUser}
          averageRating={averageRating}
          totalReviews={reviews.length}
          totalPools={userPools.created.length + userPools.joined.length}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => setShowEditModal(true)}
          onCreateReview={canReview ? () => setShowReviewModal(true) : undefined}
        />

        {/* Profile Content */}
        <div className="mt-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === "pools" ? (
              <PoolHistory
                createdPools={userPools.created}
                joinedPools={userPools.joined}
                isOwnProfile={isOwnProfile}
              />
            ) : (
              <ReviewsList reviews={reviews} isOwnProfile={isOwnProfile} />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={profileUser}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Create Review Modal */}
      {showReviewModal && profileUser && (
        <CreateReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          targetUser={profileUser}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}

export default ProfileScreen
