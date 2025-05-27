"use client"

import type React from "react"
import { useState } from "react"
import Button from "../ui/Button"
import QRCodeScanner from "./QRCodeScanner"
import type { Pool } from "../../types"

interface QRScannerButtonProps {
  onPoolFound?: (pool: Pool) => void
  className?: string
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

const QRScannerButton: React.FC<QRScannerButtonProps> = ({
  onPoolFound,
  className,
  variant = "outline",
  size = "md",
  showText = true,
}) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const handlePoolFound = (pool: Pool) => {
    if (onPoolFound) {
      onPoolFound(pool)
    }
    setIsScannerOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsScannerOpen(true)} variant={variant} size={size} className={className}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4m-4 0v4m-4-4h2m2-6h2m0 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v1m4 0V8a2 2 0 012-2h2a2 2 0 012 2v2m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        {showText && "Scan QR"}
      </Button>

      <QRCodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onPoolFound={handlePoolFound} />
    </>
  )
}

export default QRScannerButton
