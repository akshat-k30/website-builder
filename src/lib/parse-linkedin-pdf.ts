// Import the core library directly to avoid pdf-parse's index.js
// which tries to read a test PDF file on import (known bug in v1)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse")
import type {
  ParsedLinkedInData,
  ExperienceEntry,
  EducationEntry,
} from "@/types/linkedin"

/**
 * Extract raw text from a LinkedIn PDF export.
 * Uses pdf-parse v1 which works server-side without web workers.
 */
async function extractTextFromPDF(pdfBuffer: Uint8Array): Promise<string> {
  const buffer = Buffer.from(pdfBuffer)
  const data = await pdfParse(buffer)
  return data.text
}

/**
 * Clean up page markers and extra whitespace from extracted PDF text.
 */
function cleanText(raw: string): string {
  return raw
    .replace(/Page \d+ of \d+/g, "")
    .replace(/-- \d+ of \d+ --/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
}

/**
 * Parse the Contact section for LinkedIn URL.
 * Handles URLs split across lines (e.g., "www.linkedin.com/in/shradha-\nkhapra")
 */
function parseLinkedInUrl(text: string): string {
  // First try to find "LinkedIn" marker and reconstruct the URL
  const contactSection = text.match(/Contact\n([\s\S]*?)(?=Top Skills\n)/i)
  if (!contactSection) return ""

  const contactText = contactSection[1]
  // Find the LinkedIn URL — may be split across lines
  const linkedinIdx = contactText.indexOf("(LinkedIn)")
  if (linkedinIdx === -1) return ""

  // Get all text before "(LinkedIn)" and extract the URL
  const beforeLinkedin = contactText.substring(0, linkedinIdx)
  const lines = beforeLinkedin.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
  // Join lines that form the URL (handles line-break in middle of URL)
  const urlText = lines.join("").replace(/\s+/g, "")
  const urlMatch = urlText.match(/www\.linkedin\.com\/in\/[\w-]+/)
  return urlMatch ? `https://${urlMatch[0]}` : ""
}

/**
 * Parse the Top Skills section.
 * Skills appear between "Top Skills" and the person's name line.
 */
function parseSkills(text: string): string[] {
  // Find the "Top Skills" section. It ends when we hit the person's name
  // (which is typically a proper name — capitalized words).
  // The section between "Top Skills\n" and "Summary\n" contains skills + name + headline + location.
  const topSkillsIdx = text.indexOf("Top Skills\n")
  if (topSkillsIdx === -1) return []

  const afterSkills = text.substring(topSkillsIdx + "Top Skills\n".length)
  const summaryIdx = afterSkills.indexOf("\nSummary\n")
  const experienceIdx = afterSkills.indexOf("\nExperience\n")

  // We need to find where skills end and name begins.
  // Skills are typically short single words or two-word items (SQL, Java, C++, etc.)
  // The name line is usually longer or has different characteristics.
  const endIdx =
    summaryIdx !== -1
      ? summaryIdx
      : experienceIdx !== -1
        ? experienceIdx
        : afterSkills.length

  const block = afterSkills.substring(0, endIdx).split("\n").map((l) => l.trim()).filter((l) => l.length > 0)

  // Skills are the short lines at the beginning. Stop when we hit what looks like
  // a person's name (longer line, or contains comma/pipe which headlines have)
  const skills: string[] = []
  for (const line of block) {
    // Skill lines are typically short (1-3 words, under ~25 chars)
    // and don't contain commas, pipes, or locations
    if (
      line.length <= 30 &&
      !line.includes(",") &&
      !line.includes("|") &&
      !line.includes("(") &&
      // Stop if this looks like a name (two+ capitalized words, longer than typical skill)
      !/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line)
    ) {
      skills.push(line)
    } else {
      break
    }
  }

  return skills
}

/**
 * Parse the name, headline, and location from the header area.
 * These appear after skills and before "Summary" or "Experience".
 */
function parseHeader(text: string): {
  name: string
  headline: string
  location: string
} {
  const skills = parseSkills(text)
  const topSkillsIdx = text.indexOf("Top Skills\n")
  if (topSkillsIdx === -1) {
    return { name: "", headline: "", location: "" }
  }

  const afterSkills = text.substring(topSkillsIdx + "Top Skills\n".length)
  const summaryIdx = afterSkills.indexOf("\nSummary\n")
  const experienceIdx = afterSkills.indexOf("\nExperience\n")

  const endIdx =
    summaryIdx !== -1
      ? summaryIdx
      : experienceIdx !== -1
        ? experienceIdx
        : afterSkills.length

  const block = afterSkills.substring(0, endIdx).split("\n").map((l) => l.trim()).filter((l) => l.length > 0)

  // Skip the skill lines to get to name/headline/location
  const headerLines = block.slice(skills.length)

  if (headerLines.length === 0) {
    return { name: "", headline: "", location: "" }
  }

  // First line is the name
  const name = headerLines[0]
  // Last line is the location (typically "City, Country")
  const location = headerLines.length > 1 ? headerLines[headerLines.length - 1] : ""
  // Everything in between is the headline
  const headline =
    headerLines.length > 2
      ? headerLines.slice(1, -1).join(" ")
      : ""

  return { name, headline, location }
}

/**
 * Parse the Summary section.
 */
function parseSummary(text: string): string {
  const summaryMatch = text.match(
    /\nSummary\n([\s\S]*?)(?=\nExperience\n|\nEducation\n|$)/
  )
  if (!summaryMatch) return ""

  return summaryMatch[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n")
}

/**
 * Parse the Experience section into individual entries.
 *
 * LinkedIn PDF experience entries follow this pattern:
 *   Company Name
 *   Job Title
 *   Date Range (e.g., "August 2020 - Present (5 years 11 months)")
 *   Location (optional, short line)
 *   Description lines...
 */
function parseExperience(text: string): ExperienceEntry[] {
  const expMatch = text.match(
    /\nExperience\n([\s\S]*?)(?=\nEducation\n|$)/
  )
  if (!expMatch) return []

  const expText = expMatch[1].trim()
  const lines = expText.split("\n").map((l) => l.trim())

  const entries: ExperienceEntry[] = []

  // Date range pattern
  const datePattern =
    /^(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+)?\d{4}\s*-\s*(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+)?(?:\d{4}|Present)/i

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }

    // Look ahead: if lines[i+2] matches a date pattern, then lines[i] is company, lines[i+1] is title
    if (i + 2 < lines.length && datePattern.test(lines[i + 2])) {
      const company = lines[i]
      const title = lines[i + 1]
      const dateRange = lines[i + 2]
      i += 3

      // Check if next line is a location (short, not a date, not the start of a new entry)
      let location = ""
      if (i < lines.length && lines[i]) {
        const nextLine = lines[i]
        const isNextEntryStart =
          i + 2 < lines.length && datePattern.test(lines[i + 2])

        if (
          !isNextEntryStart &&
          !datePattern.test(nextLine) &&
          nextLine.length < 50
        ) {
          location = nextLine
          i++
        }
      }

      // Collect description lines until we hit the next entry or end
      const descLines: string[] = []
      while (i < lines.length) {
        if (!lines[i]) {
          i++
          continue
        }
        // Check if this starts a new entry
        if (i + 2 < lines.length && datePattern.test(lines[i + 2])) {
          break
        }
        descLines.push(lines[i])
        i++
      }

      entries.push({
        company,
        title,
        dateRange,
        location,
        description: descLines.join("\n"),
      })
    } else {
      i++
    }
  }

  return entries
}

/**
 * Parse the Education section into individual entries.
 * Entries come in pairs: School Name, then Degree/Field.
 */
function parseEducation(text: string): EducationEntry[] {
  const eduMatch = text.match(/\nEducation\n([\s\S]*?)$/m)
  if (!eduMatch) return []

  const lines = eduMatch[1]
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const entries: EducationEntry[] = []

  for (let i = 0; i < lines.length; i += 2) {
    const school = lines[i] || ""
    const degree = lines[i + 1] || ""
    if (school) {
      entries.push({ school, degree })
    }
  }

  return entries
}

/**
 * Parse a LinkedIn PDF export into structured profile data.
 *
 * @param pdfBuffer - The raw PDF file as a Uint8Array
 * @returns Parsed LinkedIn profile data
 */
export async function parseLinkedInPDF(
  pdfBuffer: Uint8Array
): Promise<ParsedLinkedInData> {
  const rawText = await extractTextFromPDF(pdfBuffer)
  const text = cleanText(rawText)

  const { name, headline, location } = parseHeader(text)

  return {
    linkedinUrl: parseLinkedInUrl(text),
    name,
    headline,
    location,
    summary: parseSummary(text),
    experience: parseExperience(text),
    education: parseEducation(text),
    skills: parseSkills(text),
  }
}

/**
 * Export for testing: extract text only without parsing.
 */
export { extractTextFromPDF, cleanText }
