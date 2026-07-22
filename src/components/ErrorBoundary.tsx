"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  /** When this value changes, a previously-caught error is cleared (auto-retry). */
  resetKey?: unknown
  fallback?: React.ReactNode
}
interface State {
  hasError: boolean
}

/**
 * Catches render errors from its subtree (e.g. a template crashing on a
 * malformed content object) and shows a recoverable fallback instead of
 * taking down the whole page. Auto-resets when `resetKey` changes.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary] render error:", error)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9 16H3l9-16z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-foreground">Preview couldn&apos;t render</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Something in the current content broke the preview. Undo your last change or edit the affected section, then retry.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
