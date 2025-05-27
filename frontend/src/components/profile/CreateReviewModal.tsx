"use client"

import type React from "react"
import { useState } from "react"
import type { User, Review } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Modal from "../ui/Modal"
import Button from "../ui/Button"

interface CreateReviewModalProps {
  isOpen: boolean
  onClose: () => void
  targetUser: User
  onSubmit: (review: Review) => void
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ isOpen, onClose, targetUser, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await apiRequest<Review>(
        "POST",
        API_ENDPOINTS.CREATE_REVIEW.replace(":userId", targetUser._id),
        {
          rating,
          comment: comment.trim(),
        },
      )

      onSubmit(response.data)
      setRating(0)
      setComment("")
    } catch (error: any) {
      console.error("Failed to create review:", error)
      setError(error.message || "Failed to create review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        className={`w-8 h-8 transition-colors ${
          i < rating ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400"
        }`}
      >
        <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review ${targetUser.fullName}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="text-center">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={targetUser.profilePicture || "/placeholder.svg?height=40&width=40"}
              alt={targetUser.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{targetUser.fullName}</p>
              <p className="text-sm text-gray-600">@{targetUser.username}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Rating *</label>
          <div className="flex justify-center space-x-1">{renderStars()}</div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this user..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">{comment.length}/500 characters</p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={rating === 0} className="flex-1">
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateReviewModal
