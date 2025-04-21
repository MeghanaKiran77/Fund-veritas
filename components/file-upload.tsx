"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, FileText, ImageIcon, Video, File } from "lucide-react"
import { useState, useRef } from "react"
import Image from "next/image"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
  accept?: string
  maxSize?: number // in MB
  label?: string
  previewUrl?: string
  className?: string
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = "image/*",
  maxSize = 5, // 5MB default
  label = "Upload File",
  previewUrl,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return false
    }

    // Check file type if accept is specified
    if (accept !== "*") {
      const fileType = file.type
      const acceptTypes = accept.split(",").map((type) => type.trim())

      // Handle wildcards like "image/*"
      const isAccepted = acceptTypes.some((type) => {
        if (type.endsWith("/*")) {
          const category = type.split("/")[0]
          return fileType.startsWith(`${category}/`)
        }
        return type === fileType || (type.includes(".") && file.name.endsWith(type))
      })

      if (!isAccepted) {
        setError(`File type not accepted. Please upload ${accept}`)
        return false
      }
    }

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-5 w-5" />

    const fileType = selectedFile.type

    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />
    } else if (fileType.startsWith("video/")) {
      return <Video className="h-5 w-5" />
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5" />
    } else {
      return <File className="h-5 w-5" />
    }
  }

  return (
    <div className={className}>
      <Input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      {!selectedFile && !previewUrl ? (
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">{label}</p>
          <p className="mb-4 text-xs text-muted-foreground">Drag and drop or click to upload (Max {maxSize}MB)</p>
          <Button variant="outline" size="sm" onClick={handleButtonClick}>
            Select File
          </Button>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      ) : (
        <div className="relative rounded-lg border p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-6 w-6 rounded-full bg-background/80"
            onClick={onFileRemove}
          >
            <X className="h-4 w-4" />
          </Button>

          {(selectedFile && selectedFile.type.startsWith("image/")) ||
          (previewUrl &&
            (previewUrl.includes(".jpg") ||
              previewUrl.includes(".png") ||
              previewUrl.includes(".jpeg") ||
              previewUrl.includes(".gif"))) ? (
            <div className="relative h-48 w-full overflow-hidden rounded-md">
              <Image
                src={previewUrl || (selectedFile ? URL.createObjectURL(selectedFile) : "")}
                alt="File preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">{getFileIcon()}</div>
              <div>
                <p className="font-medium">{selectedFile?.name || "File selected"}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "File ready for upload"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
