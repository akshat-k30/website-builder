import { WebsiteContent } from "@/types/website"

/**
 * Returns a URL safe to use in an href. Only http(s) and mailto schemes are
 * allowed; anything else (javascript:, data:, vbscript:, …) is neutralised to
 * "#" so a user- or AI-supplied value can't inject a clickable script.
 */
export function safeUrl(url?: string | null): string {
  if (!url) return "#"
  const trimmed = url.trim()
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed
  // Bare domains → assume https
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) return `https://${trimmed}`
  return "#"
}

/**
 * Strips empty entries so blank skills/experience never render on a site:
 * removes empty skill items, empty categories, empty experience rows, and
 * blank highlight lines.
 */
export function sanitizeContent(content: WebsiteContent): WebsiteContent {
  return {
    ...content,
    experience: (content.experience ?? [])
      .filter((e) => e.role?.trim() || e.company?.trim())
      .map((e) => ({ ...e, highlights: (e.highlights ?? []).filter((h) => h?.trim()) })),
    skills: {
      ...content.skills,
      categories: (content.skills?.categories ?? [])
        .map((c) => ({ ...c, items: (c.items ?? []).filter((i) => i?.trim()) }))
        .filter((c) => c.name?.trim() || c.items.length > 0),
    },
  }
}
