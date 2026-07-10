"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"
import type { ComponentType } from "react"

// Dynamically import templates to avoid huge bundles
const templateMap: Record<string, ComponentType<{ content: WebsiteContent; theme: TemplateTheme }>> = {
  "modern-minimal": dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false }),
  "bold-developer": dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false }),
  "creative-portfolio": dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false }),
  "executive-pro": dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false }),
}

interface LivePreviewProps {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
}

export default function LivePreview({ content, theme, templateId }: LivePreviewProps) {
  const TemplateComponent = templateMap[templateId] || templateMap["modern-minimal"]

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* 
        We use an iframe or just scale a div to show the preview. 
        For simplicity and reactivity in Next.js, we render it directly in the DOM. 
        To isolate styles, the template components should use inline styles 
        driven by the `theme` prop.
      */}
      <TemplateComponent content={content} theme={theme} />
    </div>
  )
}
