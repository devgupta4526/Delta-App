"use client"

import type React from "react"
import { useState } from "react"
import type { Pool, JoinRequest } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Modal from "../ui/Modal"
import Button from "../ui/Button"

interface MemberManagementProps {
  isOpen: boolean
  onClose: () => void
  pool: Pool
  isCreator: boolean
  onUpdate: () => void
}

const MemberManagement: React.FC<MemberManagementProps> = ({ isOpen, onClose, pool, isCreator, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<"members" | "requests">("members")
  const [loading, setLoading] = useState<string | null>(null)

  const handleAcceptRequest = async (request: JoinRequest) => {
    try {
      setLoading(`accept-${request.user._id}`)
      await apiRequest("POST", API_ENDPOINTS.ACCEPT_REQUEST.replace(":id", pool._id), {
        userId: request.user._id,
      })
      onUpdate()
    } catch (error: any) {
      console.error("Failed to accept request:", error)
      alert(error.message || "Failed to accept request")
    } finally {
      setLoading(null)
    }
  }

  const handleRejectRequest = async (request: JoinRequest) => {
    try {
      setLoading(`reject-${request.user._id}`)
      await apiRequest("POST", API_ENDPOINTS.REJECT_REQUEST.replace(":id", pool._id), {
        userId: request.user._id,
      })
      onUpdate()
    } catch (error: any) {
      console.error("Failed to reject request:", error)
      alert(error.message || "Failed to reject request")
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      setLoading(`remove-${memberId}`)
      await apiRequest("DELETE", `${API_ENDPOINTS.POOLS}/${pool._id}/members/${memberId}`)
      onUpdate()
    } catch (error: any) {
      console.error("Failed to remove member:", error)
      alert(error.message || "Failed to remove member")
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pool Members" size="lg">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "members" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Members ({pool.members.length})
          </button>
          {isCreator && (
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === "requests" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Requests ({pool.joinRequests.length})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === "members" ? (
            <div className="space-y-3">
              {pool.members.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.profilePicture || "/placeholder.svg?height=40&width=40"}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{member.fullName}</p>
                      <p className="text-sm text-gray-600">@{member.username}</p>
                    </div>
                    {member._id === pool.creator._id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Host</span>
                    )}
                  </div>
                  {isCreator && member._id !== pool.creator._id && (
                    <Button
                      onClick={() => handleRemoveMember(member._id)}
                      loading={loading === `remove-${member._id}`}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {pool.members.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No members yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {pool.joinRequests.map((request) => (
                <div key={request.user._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.user.profilePicture || "/placeholder.svg?height=40&width=40"}
                        alt={request.user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{request.user.fullName}</p>
                        <p className="text-sm text-gray-600">@{request.user.username}</p>
                        <p className="text-xs text-gray-500">Requested {formatDate(request.requestedAt)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAcceptRequest(request)}
                        loading={loading === `accept-${request.user._id}`}
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest(request)}
                        loading={loading === `reject-${request.user._id}`}
                        variant="outline"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  {request.message && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}
                </div>
              ))}
              {pool.joinRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default MemberManagement
