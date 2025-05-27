"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"
import type { User } from "../types"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinPool: (poolId: string) => void
  leavePool: (poolId: string) => void
  sendMessage: (poolId: string, content: string, replyTo?: string) => void
  editMessage: (messageId: string, content: string) => void
  deleteMessage: (messageId: string) => void
  markMessagesSeen: (poolId: string, messageIds: string[]) => void
  typingUsers: Record<string, User[]>
  startTyping: (poolId: string) => void
  stopTyping: (poolId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<string, User[]>>({})
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000", {
        auth: {
          token: localStorage.getItem("accessToken"),
        },
        transports: ["websocket"],
      })

      newSocket.on("connect", () => {
        console.log("Connected to server")
        setIsConnected(true)
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server")
        setIsConnected(false)
      })

      newSocket.on("user_typing", ({ poolId, user: typingUser }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [poolId]: [...(prev[poolId] || []).filter((u) => u._id !== typingUser._id), typingUser],
        }))
      })

      newSocket.on("user_stopped_typing", ({ poolId, userId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [poolId]: (prev[poolId] || []).filter((u) => u._id !== userId),
        }))
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [isAuthenticated, user])

  const joinPool = (poolId: string) => {
    if (socket) {
      socket.emit("join_pool", poolId)
    }
  }

  const leavePool = (poolId: string) => {
    if (socket) {
      socket.emit("leave_pool", poolId)
    }
  }

  const sendMessage = (poolId: string, content: string, replyTo?: string) => {
    if (socket) {
      socket.emit("send_message", {
        poolId,
        content,
        replyTo,
      })
    }
  }

  const editMessage = (messageId: string, content: string) => {
    if (socket) {
      socket.emit("edit_message", {
        messageId,
        content,
      })
    }
  }

  const deleteMessage = (messageId: string) => {
    if (socket) {
      socket.emit("delete_message", messageId)
    }
  }

  const markMessagesSeen = (poolId: string, messageIds: string[]) => {
    if (socket) {
      socket.emit("mark_messages_seen", {
        poolId,
        messageIds,
      })
    }
  }

  const startTyping = (poolId: string) => {
    if (socket) {
      socket.emit("typing", poolId)
    }
  }

  const stopTyping = (poolId: string) => {
    if (socket) {
      socket.emit("stop_typing", poolId)
    }
  }

  const value = {
    socket,
    isConnected,
    joinPool,
    leavePool,
    sendMessage,
    editMessage,
    deleteMessage,
    markMessagesSeen,
    typingUsers,
    startTyping,
    stopTyping,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
