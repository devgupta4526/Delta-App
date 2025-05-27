"use client"

import type React from "react"
import { useState } from "react"
import type { Pool } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"

interface PoolActionsMenuProps {
  pool: Pool
  isCreator: boolean
  onUpdate: (pool: Pool) => void
  onDelete: (poolId: string) => void
}

const PoolActionsMenu: React.FC<PoolActionsMenuProps> = ({ pool, isCreator, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: "open" | "closed" | "cancelled") => {
    if (!confirm(`Are you sure you want to change the pool status to "${newStatus}"?`)) return

    try {
      setLoading(`status-${newStatus}`)
      await apiRequest("PATCH", API_ENDPOINTS.UPDATE_STATUS.replace(":id", pool._id), {
        status: newStatus,
      })
      onUpdate({ ...pool, status: newStatus })
      setIsOpen(false)
    } catch (error: any) {
      console.error("Failed to update status:", error)
      alert(error.message || "Failed to update status")
    } finally {
      setLoading(null)
    }
  }

  const handleDeletePool = async () => {
    if (!confirm("Are you sure you want to delete this pool? This action cannot be undone.")) return

    try {
      setLoading("delete")
      await apiRequest("DELETE", `${API_ENDPOINTS.POOLS}/${pool._id}`)
      onDelete(pool._id)
      setIsOpen(false)
    } catch (error: any) {
      console.error("Failed to delete pool:", error)
      alert(error.message || "Failed to delete pool")
    } finally {
      setLoading(null)
    }
  }

  const copyPoolLink = () => {
    const url = `${window.location.origin}/pool/${pool._id}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Pool link copied to clipboard!")
      setIsOpen(false)
    })
  }

  if (!isCreator) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  onClick={copyPoolLink}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                onClick={copyPoolLink}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Link
              </button>

              <div className="border-t border-gray-100 my-1" />

              {pool.status === "open" && (
                <button
                  onClick={() => handleStatusChange("closed")}
                  disabled={loading === "status-closed"}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m0 0v2m0-2h2m-2 0H10"
                    />
                  </svg>
                  Close Pool
                </button>
              )}

              {pool.status === "closed" && (
                <button
                  onClick={() => handleStatusChange("open")}
                  disabled={loading === "status-open"}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Reopen Pool
                </button>
              )}

              {pool.status !== "cancelled" && (
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={loading === "status-cancelled"}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Pool
                </button>
              )}

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={handleDeletePool}
                disabled={loading === "delete"}
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
                Delete Pool
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PoolActionsMenu
