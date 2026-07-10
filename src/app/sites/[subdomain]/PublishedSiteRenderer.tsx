"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const templateMap: Record<string, ComponentType<{ content: WebsiteContent; theme: TemplateTheme }>> = {
  "modern-minimal": dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false }),
  "bold-developer": dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false }),
  "creative-portfolio": dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false }),
  "executive-pro": dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false }),
}

interface Props {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
}

export default function PublishedSiteRenderer({ content, theme, templateId }: Props) {
  const TemplateComponent = templateMap[templateId] || templateMap["modern-minimal"]

  return (
    <div className="min-h-screen">
      <TemplateComponent content={content} theme={theme} />
      {/* Powered by footer */}
      <div
        className="py-3 text-center text-[11px] font-semibold tracking-wide opacity-40"
        style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      >
        Powered by{" "}
        <span className="underline">WebsiteBuilder</span>
      </div>
    </div>
  )
}
