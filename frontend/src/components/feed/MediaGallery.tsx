"use client"

import type React from "react"
import { useState } from "react"
import Modal from "../ui/Modal"

interface MediaGalleryProps {
  media: string[]
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (media.length === 0) return null

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i)
  }

  const renderMedia = (url: string, index: number) => {
    if (isVideo(url)) {
      return (
        <video
          key={index}
          src={url || "/placeholder.svg"}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
        />
      )
    }

    return (
      <img
        key={index}
        src={url || "/placeholder.svg"}
        alt={`Media ${index + 1}`}
        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setSelectedImage(url)}
      />
    )
  }

  const getGridClass = () => {
    switch (media.length) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2"
      default:
        return "grid-cols-2"
    }
  }

  return (
    <>
      <div className={`grid ${getGridClass()} gap-1 max-h-96 overflow-hidden`}>
        {media.slice(0, 4).map((url, index) => {
          if (index === 3 && media.length > 4) {
            return (
              <div key={index} className="relative">
                {renderMedia(url, index)}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">+{media.length - 3}</span>
                </div>
              </div>
            )
          }

          if (index === 2 && media.length === 3) {
            return (
              <div key={index} className="col-span-2">
                {renderMedia(url, index)}
              </div>
            )
          }

          return <div key={index}>{renderMedia(url, index)}</div>
        })}
      </div>

      {/* Image Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} size="xl">
        {selectedImage && (
          <div className="flex items-center justify-center">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Full size"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export default MediaGallery
