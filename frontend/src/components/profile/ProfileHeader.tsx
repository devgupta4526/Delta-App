"use client"

import type React from "react"
import type { User } from "../../types"
import Button from "../ui/Button"

interface ProfileHeaderProps {
  user: User
  averageRating: number
  totalReviews: number
  totalPools: number
  isOwnProfile: boolean
  onEditProfile: () => void
  onCreateReview?: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  averageRating,
  totalReviews,
  totalPools,
  isOwnProfile,
  onEditProfile,
  onCreateReview,
}) => {
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        {user.coverImage ? (
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg opacity-75">No cover image</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 md:-mt-20">
            <img
              src={user.profilePicture || "/placeholder.svg?height=120&width=120"}
              alt={user.fullName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover bg-white"
            />
            {user.roles.includes("verified") && (
              <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-500 mt-1">Joined {formatJoinDate(user.createdAt)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 md:mt-0">
                {isOwnProfile ? (
                  <Button onClick={onEditProfile} variant="outline">
                    Edit Profile
                  </Button>
                ) : (
                  onCreateReview && (
                    <Button onClick={onCreateReview} variant="outline">
                      Write Review
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-4">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">{renderStars(averageRating)}</div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{totalPools} pools</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Score: {user.score}</span>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
