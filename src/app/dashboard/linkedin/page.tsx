"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Info, Upload, FileText, CircleCheck, Loader2, AlertCircle } from "lucide-react"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export default function LinkedInUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const validateFile = (f: File): string | null => {
    if (f.type !== "application/pdf") return "Please upload a PDF file. LinkedIn exports are in PDF format."
    if (f.size > 5 * 1024 * 1024) return "File is too large. Maximum size is 5MB."
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
    if (droppedFile) handleFileSelect(droppedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (selectedFile) handleFileSelect(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return
    setStatus("uploading")
    setErrorMessage("")
    try {
      const formData = new FormData()
      formData.append("pdf", file)
      const res = await fetch("/api/linkedin/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setStatus("success")
      setTimeout(() => router.push("/dashboard/linkedin/review"), 1000)
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground">Import LinkedIn profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload your LinkedIn PDF export and we&apos;ll extract your profile data automatically.
        </p>

        {/* Instructions */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="flex items-center gap-2 font-bold text-foreground">
            <Info className="h-4 w-4 text-primary" /> How to download your LinkedIn PDF
          </h3>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm font-medium text-muted-foreground">
            <li>Go to your LinkedIn profile page</li>
            <li>Click the <strong className="text-foreground">&quot;More&quot;</strong> button (next to &quot;Open to&quot;)</li>
            <li>Select <strong className="text-foreground">&quot;Save to PDF&quot;</strong></li>
            <li>Upload the downloaded PDF below</li>
          </ol>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
            status === "error"
              ? "border-red-500 bg-red-500/5"
              : isDragOver
                ? "scale-[1.01] border-primary bg-primary/5"
                : file
                  ? "border-success bg-success/5"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleInputChange} className="hidden" id="pdf-upload-input" />

          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${file && status !== "error" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
            {file && status !== "error" ? <FileText className="h-7 w-7" /> : <Upload className="h-7 w-7" />}
          </div>

          {file ? (
            <div>
              <p className="font-bold text-success">{file.name}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Click to change file</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-foreground">Drop your LinkedIn PDF here, or click to browse</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">PDF files only, up to 5MB</p>
            </div>
          )}
        </div>

        {errorMessage && (
          <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
            <AlertCircle className="h-4 w-4 flex-none" /> {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading" || status === "success"}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            id="upload-button"
          >
            {status === "uploading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Parsing PDF…</>
            ) : status === "success" ? (
              <><CircleCheck className="h-4 w-4" /> Done — redirecting…</>
            ) : (
              "Upload & parse"
            )}
          </button>

          {file && status === "idle" && (
            <button
              onClick={() => {
                setFile(null)
                setErrorMessage("")
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {status === "success" && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 p-4">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-success/15 text-success">
              <CircleCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-success">Profile data extracted successfully! Redirecting to review…</p>
          </div>
        )}
      </div>
    </div>
  )
}
