"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import type { Post, User } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Button from "../ui/Button"

interface CommentSectionProps {
  post: Post
  currentUser: User
  onUpdate: (post: Post) => void
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, currentUser, onUpdate }) => {
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    try {
      setSubmitting(true)
      const response = await apiRequest<Post>("POST", API_ENDPOINTS.COMMENT_POST.replace(":postId", post._id), {
        content: newComment.trim(),
      })
      onUpdate(response.data)
      setNewComment("")
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await apiRequest<Post>("POST", `/posts/${post._id}/comments/${commentId}/like`)
      onUpdate(response.data)
    } catch (error) {
      console.error("Failed to like comment:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <div className="border-t border-gray-100">
      {/* Comments List */}
      {post.comments.length > 0 && (
        <div className="px-4 py-3 space-y-4 max-h-96 overflow-y-auto">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <Link to={`/profile/${comment.user.username}`}>
                <img
                  src={comment.user.profilePicture || "/placeholder.svg?height=32&width=32"}
                  alt={comment.user.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link
                      to={`/profile/${comment.user.username}`}
                      className="font-medium text-sm text-gray-900 hover:text-blue-600"
                    >
                      {comment.user.fullName}
                    </Link>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-900">{comment.content}</p>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`text-xs font-medium transition-colors ${
                      comment.likes.includes(currentUser._id) ? "text-red-600" : "text-gray-500 hover:text-red-600"
                    }`}
                  >
                    {comment.likes.includes(currentUser._id) ? "Liked" : "Like"}
                    {comment.likes.length > 0 && ` (${comment.likes.length})`}
                  </button>

                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="mt-3">
                    <div className="flex space-x-2">
                      <img
                        src={currentUser.profilePicture || "/placeholder.svg?height=24&width=24"}
                        alt={currentUser.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${comment.user.fullName}...`}
                          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && replyContent.trim()) {
                              // Handle reply submission
                              setReplyContent("")
                              setReplyingTo(null)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start space-x-2">
                        <Link to={`/profile/${reply.user.username}`}>
                          <img
                            src={reply.user.profilePicture || "/placeholder.svg?height=24&width=24"}
                            alt={reply.user.fullName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <Link
                                to={`/profile/${reply.user.username}`}
                                className="font-medium text-xs text-gray-900 hover:text-blue-600"
                              >
                                {reply.user.fullName}
                              </Link>
                              <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gray-900">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <div className="px-4 py-3 border-t border-gray-100">
        <form onSubmit={handleSubmitComment} className="flex space-x-3">
          <img
            src={currentUser.profilePicture || "/placeholder.svg?height=32&width=32"}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
          </div>
          <Button type="submit" size="sm" disabled={!newComment.trim() || submitting} loading={submitting}>
            Post
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CommentSection
