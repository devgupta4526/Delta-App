"use client"

import type React from "react"
import QRCodeShare from "../qr/QRCodeShare"

interface QRCodeGeneratorProps {
  isOpen: boolean
  onClose: () => void
  poolId: string
  poolName?: string
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ isOpen, onClose, poolId, poolName = "Pool" }) => {
  return <QRCodeShare isOpen={isOpen} onClose={onClose} poolId={poolId} poolName={poolName} />
}

export default QRCodeGenerator
