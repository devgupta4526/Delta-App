"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../../utils/api"
import { API_ENDPOINTS } from "../../config/api"
import type { Pool } from "../../types"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Card from "../ui/Card"

interface QRCodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onPoolFound?: (pool: Pool) => void
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ isOpen, onClose, onPoolFound }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scannedPool, setScannedPool] = useState<Pool | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  // Check for camera permission and get available devices
  useEffect(() => {
    if (isOpen) {
      checkCameraPermission()
      getAvailableDevices()
    }
    return () => {
      stopScanning()
    }
  }, [isOpen])

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName })
      setHasPermission(result.state === "granted")

      result.onchange = () => {
        setHasPermission(result.state === "granted")
      }
    } catch (error) {
      console.error("Error checking camera permission:", error)
      setHasPermission(null)
    }
  }

  const getAvailableDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = deviceList.filter((device) => device.kind === "videoinput")
      setDevices(videoDevices)

      // Prefer back camera on mobile devices
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment"),
      )

      if (backCamera) {
        setSelectedDeviceId(backCamera.deviceId)
      } else if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId)
      }
    } catch (error) {
      console.error("Error getting devices:", error)
    }
  }

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          facingMode: selectedDeviceId ? undefined : { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        videoRef.current.onloadedmetadata = () => {
          startQRDetection()
        }
      }
    } catch (error) {
      console.error("Error starting camera:", error)
      setError("Failed to access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const qrCode = detectQRCode(imageData)

        if (qrCode) {
          handleQRCodeDetected(qrCode)
        }
      }
    }, 500) // Scan every 500ms
  }

  // Simple QR code detection (in a real app, you'd use a library like jsQR)
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a simplified implementation
    // In a real application, you would use a library like jsQR
    try {
      // For demo purposes, we'll simulate QR detection
      // In reality, you'd use: const code = jsQR(imageData.data, imageData.width, imageData.height)

      // Simulate finding a QR code with pool ID
      const simulatedQRData = localStorage.getItem("simulatedQR")
      if (simulatedQRData) {
        localStorage.removeItem("simulatedQR")
        return simulatedQRData
      }

      return null
    } catch (error) {
      console.error("Error detecting QR code:", error)
      return null
    }
  }

  const handleQRCodeDetected = async (qrData: string) => {
    try {
      stopScanning()

      // Extract pool ID from QR data
      let poolId: string

      if (qrData.includes("/pool/")) {
        // Handle full URL
        const urlParts = qrData.split("/pool/")
        poolId = urlParts[1].split("?")[0]
      } else if (qrData.includes("poolId=")) {
        // Handle query parameter
        const urlParams = new URLSearchParams(qrData.split("?")[1])
        poolId = urlParams.get("poolId") || ""
      } else {
        // Assume it's just the pool ID
        poolId = qrData
      }

      if (!poolId) {
        setError("Invalid QR code format")
        return
      }

      // Fetch pool details
      const response = await apiRequest<Pool>("GET", `${API_ENDPOINTS.POOLS}/${poolId}`)
      setScannedPool(response.data)

      if (onPoolFound) {
        onPoolFound(response.data)
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      setError("Failed to find pool. Please try again.")
    }
  }

  const joinPool = async () => {
    if (!scannedPool) return

    try {
      setIsJoining(true)
      await apiRequest("POST", `${API_ENDPOINTS.POOLS}/${scannedPool._id}/join`, {
        message: "Joined via QR code scan",
      })

      navigate(`/pool/${scannedPool._id}`)
      onClose()
    } catch (error) {
      console.error("Error joining pool:", error)
      setError("Failed to join pool. Please try again.")
    } finally {
      setIsJoining(false)
    }
  }

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
    } catch (error) {
      console.error("Camera permission denied:", error)
      setError("Camera permission is required to scan QR codes")
    }
  }

  const resetScanner = () => {
    setScannedPool(null)
    setError(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scan QR Code" size="lg">
      <div className="space-y-4">
        {hasPermission === false && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <div className="text-yellow-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Camera Permission Required</h3>
              <p className="text-yellow-700 mb-4">
                We need access to your camera to scan QR codes. Please grant permission to continue.
              </p>
              <Button onClick={requestCameraPermission}>Grant Camera Permission</Button>
            </div>
          </Card>
        )}

        {hasPermission && !scannedPool && (
          <>
            {devices.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Camera</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                {isScanning ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanning overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                        {/* Scanning line animation */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                        Position QR code within the frame
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="opacity-75">Camera not active</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                  </svg>
                  Start Scanning
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="outline" className="flex-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  Stop Scanning
                </Button>
              )}
            </div>
          </>
        )}

        {scannedPool && (
          <Card className="p-4">
            <div className="text-center">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Pool Found!</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={scannedPool.coverImage || "/placeholder.svg?height=60&width=60"}
                    alt={scannedPool.name}
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{scannedPool.name}</h4>
                    <p className="text-sm text-gray-600">{scannedPool.location}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{scannedPool.description.overview}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {scannedPool.members.length}/{scannedPool.maxMembers} members
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scannedPool.status === "open" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {scannedPool.status}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={resetScanner} variant="outline" className="flex-1">
                  Scan Another
                </Button>
                <Button onClick={joinPool} disabled={isJoining || scannedPool.status !== "open"} className="flex-1">
                  {isJoining ? "Joining..." : "Join Pool"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-800 font-medium">{error}</p>
              <Button onClick={resetScanner} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Demo QR Code Generator for testing */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
            <p className="text-sm text-blue-700 mb-3">Click below to simulate scanning a QR code for testing</p>
            <Button
              onClick={() => {
                localStorage.setItem("simulatedQR", "pool/demo-pool-id-123")
                if (!isScanning) startScanning()
              }}
              variant="outline"
              size="sm"
            >
              Simulate QR Scan
            </Button>
          </div>
        </Card>
      </div>
    </Modal>
  )
}

export default QRCodeScanner
