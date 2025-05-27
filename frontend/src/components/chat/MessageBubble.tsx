"use client"

import type React from "react"
import { useState } from "react"
import type { Message, User, Pool } from "../../types"
import { useSocket } from "../../context/SocketContext"

interface MessageBubbleProps {
  message: Message
  currentUser: User
  pool: Pool
  showAvatar: boolean
  onReply: (message: Message) => void
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  pool,
  showAvatar,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const { editMessage, deleteMessage } = useSocket()

  const isOwnMessage = message.sender._id === currentUser._id
  const isCreator = pool.creator._id === currentUser._id

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      editMessage(message._id, editContent.trim())
      setIsEditing(false)
    } else {
      setIsEditing(false)
      setEditContent(message.content)
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message._id)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeenByText = () => {
    const seenCount = message.seenBy.filter((id) => id !== message.sender._id).length
    if (seenCount === 0) return "Sent"
    if (seenCount === 1) return "Seen"
    return `Seen by ${seenCount}`
  }

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-gray-100 text-gray-500 italic px-3 py-2 rounded-lg text-sm">This message was deleted</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <img
            src={message.sender.profilePicture || "/placeholder.svg?height=32&width=32"}
            alt={message.sender.fullName}
            className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
          />
        )}

        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          {/* Sender name */}
          {showAvatar && !isOwnMessage && (
            <div className="text-xs text-gray-600 mb-1 px-3">
              {message.sender.fullName}
              {message.sender._id === pool.creator._id && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Host</span>
              )}
            </div>
          )}

          {/* Reply indicator */}
          {message.replyTo && (
            <div className={`text-xs text-gray-500 mb-1 px-3 ${isOwnMessage ? "text-right" : "text-left"}`}>
              Replying to {message.replyTo.sender.fullName}
            </div>
          )}

          <div className="relative group">
            {/* Message content */}
            <div
              className={`px-3 py-2 rounded-lg ${
                isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
              } ${message.isEdited ? "border-l-2 border-yellow-400" : ""}`}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-transparent border-none resize-none focus:outline-none text-sm"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(message.content)
                      }}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {message.replyTo && (
                    <div className="bg-black bg-opacity-10 rounded p-2 mb-2 text-sm">
                      <div className="font-medium">{message.replyTo.sender.fullName}</div>
                      <div className="opacity-75">{message.replyTo.content}</div>
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                </>
              )}
            </div>

            {/* Actions */}
            {showActions && !isEditing && (
              <div
                className={`absolute top-0 ${
                  isOwnMessage ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                } flex space-x-1 bg-white shadow-lg rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <button
                  onClick={() => onReply(message)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Reply"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </button>

                {isOwnMessage && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {(isCreator || isOwnMessage) && !isOwnMessage && (
                  <button
                    onClick={handleDelete}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete (as host)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Message metadata */}
          <div className={`text-xs text-gray-500 mt-1 px-3 ${isOwnMessage ? "text-right" : "text-left"}`}>
            {formatTime(message.createdAt)}
            {message.isEdited && <span className="ml-1">(edited)</span>}
            {isOwnMessage && <div className="text-xs text-gray-400 mt-1">{getSeenByText()}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
