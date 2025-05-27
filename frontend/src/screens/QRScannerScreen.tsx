"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import QRCodeScanner from "../components/qr/QRCodeScanner"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import type { Pool } from "../types"

const QRScannerScreen: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [recentScans, setRecentScans] = useState<Pool[]>([])
  const navigate = useNavigate()

  const handlePoolFound = (pool: Pool) => {
    setRecentScans((prev) => {
      const filtered = prev.filter((p) => p._id !== pool._id)
      return [pool, ...filtered].slice(0, 5) // Keep last 5 scans
    })
    setIsScannerOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code Scanner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scan QR codes to quickly join pool parties. Point your camera at any pool QR code to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card className="p-6">
            <div className="text-center">
              <div className="text-blue-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4m-4 0v4m-4-4h2m2-6h2m0 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v1m4 0V8a2 2 0 012-2h2a2 2 0 012 2v2m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 mb-6">Open your camera to scan pool QR codes and join instantly</p>

              <Button onClick={() => setIsScannerOpen(true)} size="lg" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Start Scanning
              </Button>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get a QR Code</h4>
                  <p className="text-gray-600 text-sm">Ask the pool creator to share their pool's QR code</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Scan the Code</h4>
                  <p className="text-gray-600 text-sm">Point your camera at the QR code and wait for detection</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Join Instantly</h4>
                  <p className="text-gray-600 text-sm">Review the pool details and join with one tap</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Scans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentScans.map((pool) => (
                <Card key={pool._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={pool.coverImage || "/placeholder.svg?height=150&width=250"}
                      alt={pool.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{pool.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{pool.description.overview}</p>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
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
                    </div>

                    <Button onClick={() => navigate(`/pool/${pool._id}`)} size="sm" className="w-full">
                      View Pool
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0"
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
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Scanning</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Ensure good lighting when scanning</li>
                <li>• Hold your device steady and at arm's length</li>
                <li>• Make sure the entire QR code is visible in the frame</li>
                <li>• Clean your camera lens for better clarity</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <QRCodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onPoolFound={handlePoolFound} />
    </div>
  )
}

export default QRScannerScreen
