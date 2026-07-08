"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const ModernMinimal = dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false })
const BoldDeveloper = dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false })
const CreativePortfolio = dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false })
const ExecutivePro = dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false })

interface Props {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
  userName: string
}

export default function PublishedSiteRenderer({ content, theme, templateId, userName }: Props) {
  let TemplateComponent: ComponentType<{ content: WebsiteContent; theme: TemplateTheme }> = ModernMinimal as any

  if (templateId === "bold-developer") {
    TemplateComponent = BoldDeveloper as any
  } else if (templateId === "creative-portfolio") {
    TemplateComponent = CreativePortfolio as any
  } else if (templateId === "executive-pro") {
    TemplateComponent = ExecutivePro as any
  }

  return (
    <div className="min-h-screen">
      <TemplateComponent content={content} theme={theme} />
      {/* Powered by footer */}
      <div
        className="py-3 text-center text-[11px] font-semibold tracking-wide opacity-40"
        style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      >
        Powered by{" "}
        <a href="/" className="underline hover:opacity-80 transition-opacity">
          WebsiteBuilder
        </a>
      </div>
    </div>
  )
}
