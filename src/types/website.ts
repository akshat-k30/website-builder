export interface HeroSection {
  name: string
  tagline: string
  ctaText: string
}

export interface AboutSection {
  title: string
  content: string
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  highlights: string[]
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface SkillsSection {
  categories: SkillCategory[]
}

export interface ContactSection {
  heading: string
  message: string
  email: string
  linkedin: string
}

export interface WebsiteContent {
  hero: HeroSection
  about: AboutSection
  experience: ExperienceItem[]
  skills: SkillsSection
  contact: ContactSection
}
