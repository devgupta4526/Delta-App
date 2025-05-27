"use client"

import type React from "react"
import type { Review } from "../../types"
import Card from "../ui/Card"

interface ReviewsListProps {
  reviews: Review[]
  isOwnProfile: boolean
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, isOwnProfile }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (reviews.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{isOwnProfile ? "No reviews yet" : "No reviews yet"}</h3>
        <p className="text-gray-600">
          {isOwnProfile
            ? "Reviews from other users will appear here when you participate in pools."
            : "This user hasn't received any reviews yet."}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id}>
          <div className="flex items-start space-x-4">
            <img
              src={review.reviewer.profilePicture || "/placeholder.svg?height=48&width=48"}
              alt={review.reviewer.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{review.reviewer.fullName}</h4>
                  <p className="text-sm text-gray-600">@{review.reviewer.username}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {review.comment && (
                <div className="mt-3">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )}

              {review.pool && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">From pool: {review.pool.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ReviewsList
