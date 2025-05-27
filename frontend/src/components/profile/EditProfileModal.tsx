"use client"

import type React from "react"
import { useState } from "react"
import type { User } from "../../types"
import { apiRequest } from "../../utils/api"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Input from "../ui/Input"
import ImageUpload from "../ui/ImageUpload"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUpdate: (updatedUser: User) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    bio: user.bio || "",
    phone: user.phone || "",
    profilePicture: user.profilePicture,
    coverImage: user.coverImage,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      const response = await apiRequest<User>("PATCH", "/users/profile", {
        fullName: formData.fullName.trim(),
        bio: formData.bio.trim(),
        phone: formData.phone.trim(),
        profilePicture: formData.profilePicture,
        coverImage: formData.coverImage,
      })

      onUpdate(response.data)
    } catch (error: any) {
      console.error("Failed to update profile:", error)
      setErrors({ submit: error.message || "Failed to update profile. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <div className="bg-white rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.submit}
              </div>
            </div>
          )}

          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={errors.fullName}
            required
          />

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Bio</label>
            <div className="bg-gray-50 rounded-xl p-1 border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell people about yourself..."
                className="w-full px-4 py-3 border-0 rounded-xl bg-transparent placeholder-gray-500 focus:outline-none text-gray-800 resize-none"
                rows={4}
                maxLength={500}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 font-medium">{formData.bio.length}/500 characters</p>
          </div>

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="+1 (555) 123-4567"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Profile Picture"
              value={formData.profilePicture}
              onChange={(imageUrl) => handleInputChange("profilePicture", imageUrl)}
            />

            <ImageUpload
              label="Cover Image"
              value={formData.coverImage}
              onChange={(imageUrl) => handleInputChange("coverImage", imageUrl)}
            />
          </div>

          {/* Fixed button area */}
          <div className="bg-white border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" size="lg">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1" variant="gradient" size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditProfileModal
