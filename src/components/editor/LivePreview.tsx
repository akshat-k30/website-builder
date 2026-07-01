"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"

// Dynamically import templates to avoid huge bundles
const ModernMinimal = dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false })
const BoldDeveloper = dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false })
const CreativePortfolio = dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false })
const ExecutivePro = dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false })

interface LivePreviewProps {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
}

export default function LivePreview({ content, theme, templateId }: LivePreviewProps) {
  // Select the right component based on templateId
  let TemplateComponent = ModernMinimal // Default
  if (templateId === "bold-developer") {
    TemplateComponent = BoldDeveloper
  } else if (templateId === "creative-portfolio") {
    TemplateComponent = CreativePortfolio
  } else if (templateId === "executive-pro") {
    TemplateComponent = ExecutivePro
  }

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
