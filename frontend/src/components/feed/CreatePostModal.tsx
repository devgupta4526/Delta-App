"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import type { Post, Pool } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import ImageUpload from "../ui/ImageUpload"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: Post) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [selectedPool, setSelectedPool] = useState("")
  const [media, setMedia] = useState<string[]>([])
  const [userPools, setUserPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetchUserPools()
    }
  }, [isOpen])

  const fetchUserPools = async () => {
    try {
      const response = await apiRequest<{ joined: Pool[] }>("GET", "/users/my-pools")
      setUserPools(response.data.joined)
      if (response.data.joined.length > 0) {
        setSelectedPool(response.data.joined[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch user pools:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !selectedPool) return

    try {
      setLoading(true)
      setError("")

      const response = await apiRequest<Post>("POST", API_ENDPOINTS.CREATE_POST, {
        content: content.trim(),
        poolId: selectedPool,
        media,
      })

      onSubmit(response.data)
      handleClose()
    } catch (error: any) {
      console.error("Failed to create post:", error)
      setError(error.message || "Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setContent("")
    setSelectedPool("")
    setMedia([])
    setError("")
    onClose()
  }

  const addMedia = (url: string) => {
    if (media.length < 4) {
      setMedia([...media, url])
    }
  }

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index))
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Post" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        {/* Pool Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post to Pool <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a pool</option>
            {userPools.map((pool) => (
              <option key={pool._id} value={pool._id}>
                {pool.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with your pool community..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            maxLength={2000}
            required
          />
          <p className="mt-1 text-sm text-gray-500">{content.length}/2000 characters</p>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos/Videos (Optional)</label>

          {media.length < 4 && (
            <ImageUpload value="" onChange={addMedia} description="You can add up to 4 images or videos" />
          )}

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {media.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Media ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Preview */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={user?.profilePicture || "/placeholder.svg?height=40&width=40"}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-sm text-gray-600">
              {selectedPool && userPools.find((p) => p._id === selectedPool)?.name}
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!content.trim() || !selectedPool} className="flex-1">
            Post
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreatePostModal
