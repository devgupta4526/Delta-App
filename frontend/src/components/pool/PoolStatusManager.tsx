"use client"

import type React from "react"
import { useState } from "react"
import type { Pool } from "../../types"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import Button from "../ui/Button"

interface PoolStatusManagerProps {
  pool: Pool
  onUpdate: () => void
}

const PoolStatusManager: React.FC<PoolStatusManagerProps> = ({ pool, onUpdate }) => {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: "open" | "closed" | "cancelled") => {
    if (!confirm(`Are you sure you want to change the pool status to "${newStatus}"?`)) return

    try {
      setLoading(true)
      await apiRequest("PATCH", API_ENDPOINTS.UPDATE_STATUS.replace(":id", pool._id), {
        status: newStatus,
      })
      onUpdate()
    } catch (error: any) {
      console.error("Failed to update status:", error)
      alert(error.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const getStatusActions = () => {
    switch (pool.status) {
      case "open":
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleStatusChange("closed")} loading={loading} variant="outline" size="sm">
              Close Pool
            </Button>
            <Button onClick={() => handleStatusChange("cancelled")} loading={loading} variant="danger" size="sm">
              Cancel Pool
            </Button>
          </div>
        )
      case "closed":
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleStatusChange("open")} loading={loading} variant="outline" size="sm">
              Reopen Pool
            </Button>
            <Button onClick={() => handleStatusChange("cancelled")} loading={loading} variant="danger" size="sm">
              Cancel Pool
            </Button>
          </div>
        )
      case "cancelled":
        return (
          <Button onClick={() => handleStatusChange("open")} loading={loading} variant="outline" size="sm">
            Reactivate Pool
          </Button>
        )
      default:
        return null
    }
  }

  return <div>{getStatusActions()}</div>
}

export default PoolStatusManager
