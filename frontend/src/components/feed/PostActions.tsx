"use client"

import type React from "react"
import { useState } from "react"
import type { Post, User } from "../../types"
import { apiRequest } from "../../utils/api"
import EditPostModal from "./EditPostModal"

interface PostActionsProps {
  post: Post
  currentUser: User
  onUpdate: (post: Post) => void
  onDelete: (postId: string) => void
}

const PostActions: React.FC<PostActionsProps> = ({ post, currentUser, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const isOwnPost = post.user._id === currentUser._id

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      setLoading(true)
      await apiRequest("DELETE", `/posts/${post._id}`)
      onDelete(post._id)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to delete post:", error)
      alert("Failed to delete post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    if (!confirm("Are you sure you want to report this post?")) return

    try {
      setLoading(true)
      await apiRequest("POST", `/posts/${post._id}/report`)
      alert("Post reported successfully. We'll review it shortly.")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to report post:", error)
      alert("Failed to report post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOwnPost) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={handleReport}
                  disabled={loading}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Report Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowEditModal(true)
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Post
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <EditPostModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} post={post} onUpdate={onUpdate} />
    </>
  )
}

export default PostActions
