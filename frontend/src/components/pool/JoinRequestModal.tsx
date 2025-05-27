"use client"

import type React from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"

interface JoinRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  loading: boolean
  message: string
  setMessage: (message: string) => void
}

const JoinRequestModal: React.FC<JoinRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  message,
  setMessage,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request to Join Pool">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message to Host (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the host why you'd like to join this pool..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
          <p className="mt-1 text-sm text-gray-500">
            A personal message can help the host understand why you're interested in joining.
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default JoinRequestModal
