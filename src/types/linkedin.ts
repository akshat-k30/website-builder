export interface ExperienceEntry {
  company: string
  title: string
  dateRange: string
  location: string
  description: string
}

export interface EducationEntry {
  school: string
  degree: string
}

export interface ParsedLinkedInData {
  linkedinUrl: string
  name: string
  headline: string
  location: string
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
}
