"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Pool } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import JoinRequestModal from "../components/pool/JoinRequestModal"
import MemberManagement from "../components/pool/MemberManagement"
import PoolStatusManager from "../components/pool/PoolStatusManager"
import QRCodeGenerator from "../components/pool/QRCodeGenerator"

const PoolDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pool, setPool] = useState<Pool | null>(null)
  const [loading, setLoading] = useState(true)
  const [joinLoading, setJoinLoading] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")

  useEffect(() => {
    if (id) {
      fetchPoolDetails()
    }
  }, [id])

  const fetchPoolDetails = async () => {
    try {
      setLoading(true)
      const response = await apiRequest<Pool>("GET", `${API_ENDPOINTS.POOLS}/${id}`)
      setPool(response.data)
    } catch (error) {
      console.error("Failed to fetch pool details:", error)
      navigate("/discover")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRequest = async () => {
    if (!pool || !user) return

    try {
      setJoinLoading(true)
      await apiRequest("POST", API_ENDPOINTS.JOIN_POOL.replace(":id", pool._id), {
        message: joinMessage,
      })

      // Refresh pool data
      await fetchPoolDetails()
      setShowJoinModal(false)
      setJoinMessage("")
    } catch (error: any) {
      console.error("Failed to send join request:", error)
      alert(error.message || "Failed to send join request")
    } finally {
      setJoinLoading(false)
    }
  }

  const handleWithdrawRequest = async () => {
    if (!pool || !user) return

    try {
      setJoinLoading(true)
      await apiRequest("DELETE", API_ENDPOINTS.WITHDRAW_REQUEST.replace(":id", pool._id))

      // Refresh pool data
      await fetchPoolDetails()
    } catch (error: any) {
      console.error("Failed to withdraw request:", error)
      alert(error.message || "Failed to withdraw request")
    } finally {
      setJoinLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isCreator = pool && user && pool.creator._id === user._id
  const isMember = pool && user && pool.members.some((member) => member._id === user._id)
  const hasJoinRequest = pool && user && pool.joinRequests.some((request) => request.user._id === user._id)
  const canJoin = pool && pool.status === "open" && pool.members.length < pool.maxMembers

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pool not found</h2>
          <p className="text-gray-600 mb-4">The pool you're looking for doesn't exist or has been removed.</p>
          <Link to="/discover">
            <Button>Back to Discover</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Image */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <img
            src={pool.coverImage || "/placeholder.svg?height=400&width=800"}
            alt={pool.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{pool.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {pool.location}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(pool.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Information */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">About this Pool</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        pool.status === "open"
                          ? "bg-green-100 text-green-800"
                          : pool.status === "closed"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                    </span>
                    <span>
                      {pool.members.length}/{pool.maxMembers} members
                    </span>
                  </div>
                </div>
                {isCreator && <PoolStatusManager pool={pool} onUpdate={fetchPoolDetails} />}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Overview</h3>
                  <p className="text-gray-600">{pool.description.overview}</p>
                </div>

                {pool.description.activities.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Activities</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {pool.description.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pool.description.requirements && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                    <p className="text-gray-600">{pool.description.requirements}</p>
                  </div>
                )}

                {pool.description.additionalInfo && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Additional Information</h3>
                    <p className="text-gray-600">{pool.description.additionalInfo}</p>
                  </div>
                )}

                {pool.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {pool.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Host Information */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hosted by</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={pool.creator.profilePicture || "/placeholder.svg?height=60&width=60"}
                  alt={pool.creator.fullName}
                  className="w-15 h-15 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{pool.creator.fullName}</h3>
                  <p className="text-sm text-gray-600">@{pool.creator.username}</p>
                  {pool.creator.bio && <p className="text-sm text-gray-600 mt-1">{pool.creator.bio}</p>}
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(pool.creator.score) ? "fill-current" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({pool.creator.score.toFixed(1)})</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Action Card */}
            <Card>
              <div className="space-y-4">
                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Sign in to join this pool</p>
                    <Link to="/login">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                  </div>
                ) : isCreator ? (
                  <div className="space-y-3">
                    <Button onClick={() => setShowMembersModal(true)} variant="outline" className="w-full">
                      Manage Members ({pool.members.length})
                    </Button>
                    {pool.joinRequests.length > 0 && (
                      <Button onClick={() => setShowMembersModal(true)} variant="secondary" className="w-full">
                        Join Requests ({pool.joinRequests.length})
                      </Button>
                    )}
                    <Button onClick={() => setShowQRModal(true)} variant="outline" className="w-full">
                      Generate QR Code
                    </Button>
                    <Link to={`/pool/${pool._id}/chat`}>
                      <Button className="w-full">Open Chat</Button>
                    </Link>
                  </div>
                ) : isMember ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-600 font-medium">You're a member!</p>
                    </div>
                    <Link to={`/pool/${pool._id}/chat`}>
                      <Button className="w-full">Open Chat</Button>
                    </Link>
                    <Button onClick={() => setShowMembersModal(true)} variant="outline" className="w-full">
                      View Members
                    </Button>
                  </div>
                ) : hasJoinRequest ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-yellow-600 font-medium">Request Pending</p>
                      <p className="text-sm text-gray-600">Your join request is being reviewed</p>
                    </div>
                    <Button onClick={handleWithdrawRequest} loading={joinLoading} variant="outline" className="w-full">
                      Withdraw Request
                    </Button>
                  </div>
                ) : canJoin ? (
                  <Button onClick={() => setShowJoinModal(true)} className="w-full" size="lg">
                    Request to Join
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600">
                      {pool.status !== "open" ? "This pool is not accepting new members" : "This pool is full"}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Members Preview */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Members ({pool.members.length})</h3>
                {pool.members.length > 3 && (
                  <button
                    onClick={() => setShowMembersModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {pool.members.slice(0, 3).map((member) => (
                  <div key={member._id} className="flex items-center space-x-3">
                    <img
                      src={member.profilePicture || "/placeholder.svg?height=32&width=32"}
                      alt={member.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">@{member.username}</p>
                    </div>
                    {member._id === pool.creator._id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Host</span>
                    )}
                  </div>
                ))}
                {pool.members.length > 3 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowMembersModal(true)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      +{pool.members.length - 3} more members
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinRequest}
        loading={joinLoading}
        message={joinMessage}
        setMessage={setJoinMessage}
      />

      {/* Members Management Modal */}
      <MemberManagement
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        pool={pool}
        isCreator={isCreator}
        onUpdate={fetchPoolDetails}
      />

      {/* QR Code Modal */}
      <QRCodeGenerator isOpen={showQRModal} onClose={() => setShowQRModal(false)} poolId={pool._id} />
    </div>
  )
}

export default PoolDetailScreen
