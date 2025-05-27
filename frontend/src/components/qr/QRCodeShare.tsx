"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Card from "../ui/Card"

interface QRCodeShareProps {
  isOpen: boolean
  onClose: () => void
  poolId: string
  poolName: string
}

const QRCodeShare: React.FC<QRCodeShareProps> = ({ isOpen, onClose, poolId, poolName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && poolId) {
      generateQRCode()
    }
  }, [isOpen, poolId])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create the pool join URL
      const poolUrl = `${window.location.origin}/pool/${poolId}`

      // Generate QR code using a QR code API service
      // In a real app, you might use your own backend or a service like qr-server.com
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(poolUrl)}&format=png&bgcolor=ffffff&color=000000&qzone=2&margin=10`

      setQrCodeUrl(qrApiUrl)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      setError("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${poolName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_qr_code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download QR code:", error)
    }
  }

  const shareQRCode = async () => {
    const poolUrl = `${window.location.origin}/pool/${poolId}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${poolName}`,
          text: `Join my pool party: ${poolName}`,
          url: poolUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(poolUrl)
        alert("Pool link copied to clipboard!")
      }
    } catch (error) {
      console.error("Failed to share:", error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(poolUrl)
        alert("Pool link copied to clipboard!")
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError)
      }
    }
  }

  const copyPoolLink = async () => {
    const poolUrl = `${window.location.origin}/pool/${poolId}`

    try {
      await navigator.clipboard.writeText(poolUrl)
      alert("Pool link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Pool QR Code" size="md">
      <div className="text-center space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-800 font-medium mb-4">{error}</p>
            <Button onClick={generateQRCode} size="sm">
              Try Again
            </Button>
          </Card>
        ) : qrCodeUrl ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code for {poolName}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Share this QR code with others so they can quickly join your pool
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Pool QR Code" className="w-64 h-64" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>How to use:</strong>
              </p>
              <ol className="text-sm text-gray-600 text-left space-y-1">
                <li>1. Save or share this QR code</li>
                <li>2. Others can scan it with their camera or QR scanner</li>
                <li>3. They'll be taken directly to your pool page</li>
                <li>4. They can join with just one tap!</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={downloadQRCode} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download
              </Button>

              <Button onClick={shareQRCode} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Share
              </Button>

              <Button onClick={copyPoolLink} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Link
              </Button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Pro Tip</p>
                  <p className="text-sm text-blue-700">
                    Print this QR code and display it at your event location for easy joining!
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

export default QRCodeShare
