"use client"

import type React from "react"
import { useState } from "react"
import type { Post } from "../../types"
import { apiRequest } from "../../utils/api"
import Modal from "../ui/Modal"
import Button from "../ui/Button"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post
  onUpdate: (post: Post) => void
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, post, onUpdate }) => {
  const [content, setContent] = useState(post.content)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || content === post.content) return

    try {
      setLoading(true)
      setError("")

      const response = await apiRequest<Post>("PATCH", `/posts/${post._id}`, {
        content: content.trim(),
      })

      onUpdate(response.data)
      onClose()
    } catch (error: any) {
      console.error("Failed to update post:", error)
      setError(error.message || "Failed to update post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            maxLength={2000}
            required
          />
          <p className="mt-1 text-sm text-gray-500">{content.length}/2000 characters</p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!content.trim() || content === post.content}
            className="flex-1"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditPostModal
