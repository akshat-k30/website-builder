"use client"

import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import type { ComponentType } from "react"

const templateMap: Record<string, ComponentType<{ content: WebsiteContent; theme: TemplateTheme }>> = {
  "modern-minimal": dynamic(() => import("@/components/templates/ModernMinimal"), { ssr: false }),
  "bold-developer": dynamic(() => import("@/components/templates/BoldDeveloper"), { ssr: false }),
  "creative-portfolio": dynamic(() => import("@/components/templates/CreativePortfolio"), { ssr: false }),
  "executive-pro": dynamic(() => import("@/components/templates/ExecutivePro"), { ssr: false }),
  "aurora-gradient": dynamic(() => import("@/components/templates/AuroraGradient"), { ssr: false }),
  "noir-luxe": dynamic(() => import("@/components/templates/NoirLuxe"), { ssr: false }),
}

interface Props {
  content: WebsiteContent
  theme: TemplateTheme
  templateId: string
}

export default function PublishedSiteRenderer({ content, theme, templateId }: Props) {
  const TemplateComponent = templateMap[templateId] || templateMap["modern-minimal"]

  // Templates use the `.css-reveal` scroll-reveal pattern. The published static
  // HTML gets this observer from the export shell; here (client render) we add it.
  useEffect(() => {
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
    const init = () =>
      document.querySelectorAll(".css-reveal:not(.is-visible)").forEach((el) => observer.observe(el))

    init()
    const mo = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length > 0)) init()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [content, theme, templateId])

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
