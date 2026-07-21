"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import type { ComponentType } from "react"

// Dynamically import templates to avoid huge bundles
const templateMap: Record<string, ComponentType<{ content: WebsiteContent; theme: TemplateTheme }>> = {
  "modern-minimal": dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false }),
  "bold-developer": dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false }),
  "creative-portfolio": dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false }),
  "executive-pro": dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false }),
  "aurora-gradient": dynamic(() => import("@/components/templates/AuroraGradient"), { ssr: false }),
  "noir-luxe": dynamic(() => import("@/components/templates/NoirLuxe"), { ssr: false }),
}

interface LivePreviewProps {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
}

export default function LivePreview({ content, theme, templateId }: LivePreviewProps) {
  const TemplateComponent = templateMap[templateId] || templateMap["modern-minimal"]

  useEffect(() => {
    // Scroll reveal logic for the live preview
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const initObserver = () => {
      document.querySelectorAll(".css-reveal:not(.is-visible)").forEach((el) => {
        observer.observe(el)
      })
    }

    // Run initially
    initObserver()

    // And watch for DOM mutations (e.g. when typing in the editor changes the DOM)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldInit = false
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          shouldInit = true
          break
        }
      }
      if (shouldInit) initObserver()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [content, theme, templateId])

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
