"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { Post, User } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Card from "../ui/Card"
import PostActions from "./PostActions"
import CommentSection from "./CommentSection"
import MediaGallery from "./MediaGallery"

interface PostCardProps {
  post: Post
  currentUser: User
  onUpdate: (post: Post) => void
  onDelete: (postId: string) => void
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const handleLike = async () => {
    if (isLiking) return

    try {
      setIsLiking(true)
      const response = await apiRequest<Post>("POST", API_ENDPOINTS.LIKE_POST.replace(":postId", post._id))
      onUpdate(response.data)
    } catch (error) {
      console.error("Failed to like post:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const isLiked = post.likes.includes(currentUser._id)
  const isOwnPost = post.user._id === currentUser._id

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-start space-x-3">
          <Link to={`/profile/${post.user.username}`}>
            <img
              src={post.user.profilePicture || "/placeholder.svg?height=40&width=40"}
              alt={post.user.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${post.user.username}`} className="font-medium text-gray-900 hover:text-blue-600">
                {post.user.fullName}
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</span>
              {post.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
            </div>
            <Link to={`/pool/${post.pool._id}`} className="text-sm text-blue-600 hover:text-blue-500">
              in {post.pool.name}
            </Link>
          </div>
        </div>

        <PostActions post={post} currentUser={currentUser} onUpdate={onUpdate} onDelete={onDelete} />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.media.length > 0 && <MediaGallery media={post.media} />}

      {/* Post Stats */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {post.likes.length > 0 && (
              <span>
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </span>
            )}
            {post.comments.length > 0 && (
              <span>
                {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
            } disabled:opacity-50`}
          >
            <svg
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">{isLiked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={() => {
              const url = `${window.location.origin}/post/${post._id}`
              navigator.clipboard.writeText(url).then(() => {
                alert("Post link copied to clipboard!")
              })
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection post={post} currentUser={currentUser} onUpdate={onUpdate} />}
    </Card>
  )
}

export default PostCard
