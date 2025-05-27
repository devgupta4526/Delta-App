"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import type { Message, Pool } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import ChatHeader from "../components/chat/ChatHeader"
import MessageList from "../components/chat/MessageList"
import MessageInput from "../components/chat/MessageInput"
import TypingIndicator from "../components/chat/TypingIndicator"

const ChatScreen: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>()
  const { user } = useAuth()
  const { socket, joinPool, leavePool, typingUsers } = useSocket()
  const navigate = useNavigate()

  const [pool, setPool] = useState<Pool | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (poolId) {
      fetchPoolAndMessages()
      joinPool(poolId)

      return () => {
        leavePool(poolId)
      }
    }
  }, [poolId])

  useEffect(() => {
    if (socket) {
      socket.on("new_message", handleNewMessage)
      socket.on("message_edited", handleMessageEdited)
      socket.on("message_deleted", handleMessageDeleted)
      socket.on("messages_seen", handleMessagesSeen)

      return () => {
        socket.off("new_message", handleNewMessage)
        socket.off("message_edited", handleMessageEdited)
        socket.off("message_deleted", handleMessageDeleted)
        socket.off("messages_seen", handleMessagesSeen)
      }
    }
  }, [socket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchPoolAndMessages = async () => {
    if (!poolId) return

    try {
      setLoading(true)

      // Fetch pool details
      const poolResponse = await apiRequest<Pool>("GET", `${API_ENDPOINTS.POOLS}/${poolId}`)
      setPool(poolResponse.data)

      // Check if user is a member
      if (!poolResponse.data.members.some((member) => member._id === user?._id)) {
        navigate("/discover")
        return
      }

      // Fetch messages
      const messagesResponse = await apiRequest<{
        messages: Message[]
        total: number
        page: number
        limit: number
      }>("GET", API_ENDPOINTS.GET_MESSAGES.replace(":poolId", poolId))

      setMessages(messagesResponse.data.messages)
    } catch (error) {
      console.error("Failed to fetch pool or messages:", error)
      navigate("/discover")
    } finally {
      setLoading(false)
    }
  }

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const handleMessageEdited = (updatedMessage: Message) => {
    setMessages((prev) => prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg)))
  }

  const handleMessageDeleted = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDeleted: true } : msg)))
  }

  const handleMessagesSeen = ({ messageIds, userId }: { messageIds: string[]; userId: string }) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (messageIds.includes(msg._id)) {
          return {
            ...msg,
            seenBy: [...msg.seenBy.filter((id) => id !== userId), userId],
          }
        }
        return msg
      }),
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pool not found</h2>
          <p className="text-gray-600">You don't have access to this chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <ChatHeader pool={pool} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList
          messages={messages}
          currentUser={user!}
          pool={pool}
          onReply={setReplyingTo}
          onEdit={(messageId, content) => {
            // Handle edit through socket
          }}
          onDelete={(messageId) => {
            // Handle delete through socket
          }}
        />

        <TypingIndicator users={typingUsers[poolId] || []} currentUser={user!} />

        <MessageInput poolId={poolId!} replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />
      </div>

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatScreen
