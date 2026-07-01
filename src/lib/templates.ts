export interface TemplateTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
}

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  imageUrl: string
  defaultTheme: TemplateTheme
}

export const availableTemplates: TemplateDefinition[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "A clean, whitespace-heavy design that puts your content front and center with elegant typography.",
    imageUrl: "/templates/modern-minimal.png", // We'll assume these exist or add placeholders
    defaultTheme: {
      primaryColor: "#0f172a",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#334155",
      fontFamily: "Inter, sans-serif",
    },
  },
  {
    id: "bold-developer",
    name: "Bold Developer",
    description: "A dark, vibrant terminal-inspired theme perfect for software engineers and creatives.",
    imageUrl: "/templates/bold-developer.png",
    defaultTheme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#0f172a",
      textColor: "#f8fafc",
      fontFamily: "Fira Code, monospace",
    },
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "An elegant, serif-driven design with large typography. Ideal for designers and creatives.",
    imageUrl: "/templates/creative-portfolio.png",
    defaultTheme: {
      primaryColor: "#d97757",
      secondaryColor: "#a3a3a3",
      backgroundColor: "#faf9f6",
      textColor: "#2b2b2b",
      fontFamily: "Georgia, serif",
    },
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    description: "A sharp, corporate sidebar layout built for leaders, founders, and executives.",
    imageUrl: "/templates/executive-pro.png",
    defaultTheme: {
      primaryColor: "#0369a1",
      secondaryColor: "#0284c7",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
      fontFamily: "Helvetica, Arial, sans-serif",
    },
  },
]
