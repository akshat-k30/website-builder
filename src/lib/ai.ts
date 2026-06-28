import { GoogleGenerativeAI } from "@google/generative-ai"
import type { WebsiteContent } from "@/types/website"
import type { ExperienceEntry, EducationEntry } from "@/types/linkedin"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface ProfileInput {
  name: string
  headline: string
  location: string
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  linkedinUrl?: string
}

function buildPrompt(profile: ProfileInput): string {
  const experienceText = profile.experience
    .map(
      (e) =>
        `- ${e.title} at ${e.company} (${e.dateRange})${e.location ? `, ${e.location}` : ""}\n  ${e.description}`
    )
    .join("\n")

  const educationText = profile.education
    .map((e) => `- ${e.degree} from ${e.school}`)
    .join("\n")

  const skillsText = profile.skills.join(", ")

  return `You are an expert professional copywriter specializing in personal branding websites.

Given the following person's LinkedIn profile data, generate polished, professional website content.

=== PROFILE DATA ===
Name: ${profile.name}
Headline: ${profile.headline}
Location: ${profile.location}
Summary: ${profile.summary}

Experience:
${experienceText}

Education:
${educationText}

Skills: ${skillsText}
LinkedIn: ${profile.linkedinUrl || "N/A"}
=== END PROFILE DATA ===

Generate website content as a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):

{
  "hero": {
    "name": "Their full name",
    "tagline": "A compelling 1-line tagline that captures their professional identity (NOT just their headline — make it punchy and memorable)",
    "ctaText": "A call-to-action button text like 'View My Work' or 'Get In Touch'"
  },
  "about": {
    "title": "About Me",
    "content": "A 3-4 sentence professional bio written in first person. Should feel warm, confident, and authentic. Highlight key achievements, passions, and what drives them. Do NOT just repeat the LinkedIn summary — rewrite it for a personal website audience."
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "period": "Start – End",
      "highlights": ["Achievement/responsibility as a bullet point (2-3 bullets per role, make them impactful and results-oriented)"]
    }
  ],
  "skills": {
    "categories": [
      {
        "name": "Category Name (e.g., 'Programming Languages', 'Frameworks', 'Tools', 'Soft Skills')",
        "items": ["skill1", "skill2"]
      }
    ]
  },
  "contact": {
    "heading": "Let's Connect",
    "message": "A friendly 1-2 sentence invitation to get in touch, tailored to their profession",
    "email": "",
    "linkedin": "${profile.linkedinUrl || ""}"
  }
}

Important rules:
- Return ONLY the JSON object, no other text, no markdown code fences
- Include ALL experience entries from the profile
- Categorize skills into 2-4 logical groups
- Make the tagline different from the headline — it should be more creative
- Write experience highlights as impactful, results-oriented bullet points
- Keep the tone professional but approachable`
}

/**
 * Generate website content from LinkedIn profile data using Google Gemini.
 * Uses gemini-1.5-flash for better free-tier quota limits.
 * Includes retry logic with exponential backoff for rate limits.
 */
export async function generateWebsiteContent(
  profile: ProfileInput
): Promise<WebsiteContent> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  const prompt = buildPrompt(profile)

  const maxRetries = 3
  let lastError: Error | null = null
  // Gemini free tier suggests ~50s retry delay; use 15s, 30s, 60s
  const retryDelays = [15000, 30000, 60000]

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      // Clean up response — remove markdown code fences if present
      let jsonText = text.trim()
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      }

      // Parse and validate
      const parsed = JSON.parse(jsonText) as WebsiteContent

      if (!parsed.hero || !parsed.about || !parsed.experience || !parsed.skills || !parsed.contact) {
        throw new Error("AI response missing required sections")
      }

      return parsed
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Retry on rate limit (429) errors
      if (lastError.message.includes("429") || lastError.message.includes("Too Many Requests")) {
        if (attempt < maxRetries - 1) {
          const delay = retryDelays[attempt]
          console.warn(`Rate limited, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        throw new Error(
          "Gemini API rate limit exceeded. The free tier has limited requests per minute. Please wait 1-2 minutes and try again."
        )
      }

      // Don't retry other errors
      throw lastError
    }
  }

  throw lastError || new Error("Failed to generate content after retries")
}
