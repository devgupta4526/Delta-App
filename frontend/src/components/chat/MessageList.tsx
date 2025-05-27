"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import type { Message, User, Pool } from "../../types"
import { useSocket } from "../../context/SocketContext"
import MessageBubble from "./MessageBubble"

interface MessageListProps {
  messages: Message[]
  currentUser: User
  pool: Pool
  onReply: (message: Message) => void
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, pool, onReply, onEdit, onDelete }) => {
  const { markMessagesSeen } = useSocket()
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mark messages as seen when they come into view
    const unseenMessages = messages
      .filter((msg) => msg.sender._id !== currentUser._id && !msg.seenBy.includes(currentUser._id))
      .map((msg) => msg._id)

    if (unseenMessages.length > 0) {
      markMessagesSeen(pool._id, unseenMessages)
    }
  }, [messages, currentUser._id, pool._id, markMessagesSeen])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ""

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString()
      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({
          date: messageDate,
          messages: [message],
        })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messageGroups.map((group) => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
              {new Date(group.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-2">
            {group.messages.map((message, index) => {
              const prevMessage = index > 0 ? group.messages[index - 1] : null
              const showAvatar =
                !prevMessage ||
                prevMessage.sender._id !== message.sender._id ||
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000 // 5 minutes

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  currentUser={currentUser}
                  pool={pool}
                  showAvatar={showAvatar}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )
            })}
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Be the first to start the conversation!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
