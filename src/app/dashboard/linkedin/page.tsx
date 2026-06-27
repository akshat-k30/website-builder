"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export default function LinkedInUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const validateFile = (f: File): string | null => {
    if (f.type !== "application/pdf") {
      return "Please upload a PDF file. LinkedIn exports are in PDF format."
    }
    if (f.size > 5 * 1024 * 1024) {
      return "File is too large. Maximum size is 5MB."
    }
    return null
  }

  const handleFileSelect = (f: File) => {
    const error = validateFile(f)
    if (error) {
      setErrorMessage(error)
      setFile(null)
      return
    }
    setErrorMessage("")
    setFile(f)
    setStatus("idle")
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setStatus("uploading")
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const res = await fetch("/api/linkedin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setStatus("success")
      // Redirect to review page after short delay
      setTimeout(() => {
        router.push("/dashboard/linkedin/review")
      }, 1000)
    } catch (err) {
      setStatus("error")
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2">Import LinkedIn Profile</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Upload your LinkedIn PDF export and we&apos;ll extract your profile data automatically.
      </p>

      {/* Instructions */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 p-5 mb-8">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          How to download your LinkedIn PDF
        </h3>
        <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1.5 list-decimal list-inside">
          <li>Go to your LinkedIn profile page</li>
          <li>Click the <strong>&quot;More&quot;</strong> button (next to &quot;Open to&quot;)</li>
          <li>Select <strong>&quot;Save to PDF&quot;</strong></li>
          <li>Upload the downloaded PDF file below</li>
        </ol>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
            : file
              ? "border-green-400 bg-green-50 dark:bg-green-950/20"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          }
          ${status === "error" ? "border-red-400 bg-red-50 dark:bg-red-950/20" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
          id="pdf-upload-input"
        />

        {/* Icon */}
        <div className="mb-4">
          {file && status !== "error" ? (
            <div className="w-14 h-14 mx-auto rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="w-14 h-14 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-7 h-7 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          )}
        </div>

        {/* Text */}
        {file ? (
          <div>
            <p className="font-medium text-green-700 dark:text-green-400">
              {file.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {(file.size / 1024).toFixed(1)} KB · Click to change file
            </p>
          </div>
        ) : (
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              Drop your LinkedIn PDF here, or click to browse
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              PDF files only, up to 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "success"}
          className={`
            px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
            ${!file || status === "uploading" || status === "success"
              ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
              : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            }
          `}
          id="upload-button"
        >
          {status === "uploading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Parsing PDF...
            </span>
          ) : status === "success" ? (
            <span className="flex items-center gap-2">
              ✓ Done — Redirecting...
            </span>
          ) : (
            "Upload & Parse"
          )}
        </button>

        {file && status === "idle" && (
          <button
            onClick={() => {
              setFile(null)
              setErrorMessage("")
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Success Message */}
      {status === "success" && (
        <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ Profile data extracted successfully! Redirecting to review page...
          </p>
        </div>
      )}
    </div>
  )
}
