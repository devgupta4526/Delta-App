"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import ImageUpload from "../components/ui/ImageUpload"
import LocationPicker from "../components/pool/LocationPicker"
import TagInput from "../components/pool/TagInput"
import ActivitySelector from "../components/pool/ActivitySelector"

interface PoolFormData {
  name: string
  overview: string
  activities: string[]
  requirements: string
  additionalInfo: string
  location: string
  coordinates: number[]
  date: string
  time: string
  maxMembers: number
  tags: string[]
  coverImage: string
}

const CreatePoolScreen: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<PoolFormData>({
    name: "",
    overview: "",
    activities: [],
    requirements: "",
    additionalInfo: "",
    location: "",
    coordinates: [],
    date: "",
    time: "",
    maxMembers: 10,
    tags: [],
    coverImage: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = 4

  const handleInputChange = (field: keyof PoolFormData, value: any) => {
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Pool name is required"
        if (!formData.overview.trim()) newErrors.overview = "Overview is required"
        if (formData.maxMembers < 2) newErrors.maxMembers = "Minimum 2 members required"
        if (formData.maxMembers > 100) newErrors.maxMembers = "Maximum 100 members allowed"
        break

      case 2:
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.date) newErrors.date = "Date is required"
        if (!formData.time) newErrors.time = "Time is required"

        // Validate date is in the future
        const selectedDateTime = new Date(`${formData.date}T${formData.time}`)
        if (selectedDateTime <= new Date()) {
          newErrors.date = "Date and time must be in the future"
        }
        break

      case 3:
        if (formData.activities.length === 0) {
          newErrors.activities = "At least one activity is required"
        }
        break

      case 4:
        // Optional step, no validation required
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    try {
      setLoading(true)

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)

      const poolData = {
        name: formData.name.trim(),
        description: {
          overview: formData.overview.trim(),
          activities: formData.activities,
          requirements: formData.requirements.trim(),
          additionalInfo: formData.additionalInfo.trim(),
        },
        location: formData.location.trim(),
        coordinates: formData.coordinates,
        date: dateTime.toISOString(),
        maxMembers: formData.maxMembers,
        tags: formData.tags,
        coverImage: formData.coverImage,
      }

      const response = await apiRequest<{ pool: any }>("POST", API_ENDPOINTS.CREATE_POOL, poolData)

      // Navigate to the created pool
      navigate(`/pool/${response.data.pool._id}`)
    } catch (error: any) {
      console.error("Failed to create pool:", error)
      setErrors({ submit: error.message || "Failed to create pool. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Information"
      case 2:
        return "Location & Time"
      case 3:
        return "Activities & Details"
      case 4:
        return "Cover Image & Tags"
      default:
        return ""
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Pool Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Give your pool a catchy name"
              required
            />

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleInputChange("overview", e.target.value)}
                placeholder="Describe what your pool is about, what makes it special..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 resize-none"
                rows={4}
                required
              />
              {errors.overview && <p className="mt-2 text-sm text-red-600 font-medium">{errors.overview}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Maximum Members <span className="text-red-500">*</span>
              </label>
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange("maxMembers", Number.parseInt(e.target.value))}
                    className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-20 text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold">
                    {formData.maxMembers}
                  </div>
                </div>
              </div>
              {errors.maxMembers && <p className="mt-2 text-sm text-red-600 font-medium">{errors.maxMembers}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <LocationPicker
              value={formData.location}
              coordinates={formData.coordinates}
              onChange={(location, coordinates) => {
                handleInputChange("location", location)
                handleInputChange("coordinates", coordinates)
              }}
              error={errors.location}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                error={errors.date}
                min={new Date().toISOString().split("T")[0]}
                required
              />

              <Input
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                error={errors.time}
                required
              />
            </div>

            {formData.date && formData.time && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Pool Date & Time</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {new Date(`${formData.date}T${formData.time}`).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <ActivitySelector
              selectedActivities={formData.activities}
              onChange={(activities) => handleInputChange("activities", activities)}
              error={errors.activities}
            />

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Requirements (Optional)</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Any specific requirements for joining (e.g., skill level, equipment needed, age restrictions...)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Additional Information (Optional)</label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any other details participants should know..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 resize-none"
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <ImageUpload
              value={formData.coverImage}
              onChange={(imageUrl) => handleInputChange("coverImage", imageUrl)}
              label="Cover Image"
              description="Upload a cover image for your pool. This will be the first thing people see!"
            />

            <TagInput
              tags={formData.tags}
              onChange={(tags) => handleInputChange("tags", tags)}
              label="Tags"
              description="Add tags to help people discover your pool"
              placeholder="Add a tag..."
            />

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
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 relative">
      {/* Fixed background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          {/* <div className="text-center mb-8">
            <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
               <h1 className="text-4xl font-black text-gray-800 mb-2">Create a New Pool</h1> 
              <p className="text-lg text-gray-600">Bring people together for an amazing experience</p>
            </div>
          </div> */}

          {/* Progress Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-800">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">{getStepTitle(currentStep)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{getStepTitle(currentStep)}</h2>
                  <p className="text-gray-600">
                    {currentStep === 1 && "Let's start with the basics about your pool"}
                    {currentStep === 2 && "When and where will your pool take place?"}
                    {currentStep === 3 && "What activities will you be doing?"}
                    {currentStep === 4 && "Add some visual appeal and help people find your pool"}
                  </p>
                </div>

                {renderStepContent()}

                {/* Navigation - Fixed at bottom with clear background */}
                <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-xl -mx-8 px-8 py-6">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className={currentStep === 1 ? "invisible" : ""}
                      size="lg"
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-3">
                      {currentStep < totalSteps ? (
                        <Button onClick={handleNext} variant="gradient" size="lg">
                          Next Step
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} loading={loading} variant="gradient" size="lg">
                          Create Pool
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Live Preview
                </h3>

                <div className="space-y-4">
                  {formData.coverImage && (
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={formData.coverImage || "/placeholder.svg"}
                        alt="Pool cover"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{formData.name || "Pool Name"}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3 mt-1">{formData.overview || "Pool overview..."}</p>
                  </div>

                  {formData.location && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center text-sm text-blue-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {formData.location}
                      </div>
                    </div>
                  )}

                  {formData.date && formData.time && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-center text-sm text-purple-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(`${formData.date}T${formData.time}`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )}

                  {formData.maxMembers > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center text-sm text-green-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Max {formData.maxMembers} members
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePoolScreen
