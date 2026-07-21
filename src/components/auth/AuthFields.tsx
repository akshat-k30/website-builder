"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const baseInput =
  "peer w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/15"

export function Field({
  label,
  id,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input id={id} className={baseInput} {...props} />
    </div>
  )
}

export function PasswordField({
  label = "Password",
  id = "password",
  ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} className={baseInput + " pr-12"} {...props} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="relative block h-4 w-4">
            <Eye className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${show ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} />
            <EyeOff className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${show ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
          </span>
        </button>
      </div>
    </div>
  )
}
