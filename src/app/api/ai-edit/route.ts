import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, currentContent, themeSettings } = await request.json()

    if (!prompt || !currentContent) {
      return NextResponse.json({ error: "Prompt and current content are required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // JSON mode returns raw parseable JSON (no markdown fences); the token cap
      // keeps large-profile responses from silently truncating into invalid JSON.
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    })

    const systemPrompt = `You are an expert web designer and copywriter AI assistant.
You are given the current content (JSON) and theme settings (JSON) of a user's personal website.
The user will provide a prompt to modify the content, the theme, or both.

Current Content:
${JSON.stringify(currentContent, null, 2)}

Current Theme Settings:
${JSON.stringify(themeSettings, null, 2)}

User Prompt: "${prompt}"

Your task is to return a JSON object with the UPDATED content and theme.
You MUST return ONLY a valid JSON object matching this structure:
{
  "content": {
    "hero": { ... },
    "about": { ... },
    "experience": [ ... ],
    "skills": { ... },
    "contact": { ... }
  },
  "themeSettings": {
    "primaryColor": "hex code",
    "secondaryColor": "hex code",
    "backgroundColor": "hex code",
    "textColor": "hex code",
    "fontFamily": "font name"
  }
}

Rules:
1. ONLY return the raw JSON object. Do NOT wrap it in markdown code fences (\`\`\`json).
2. If the user only asks to change colors, keep the content exactly the same and only update the theme.
3. If the user only asks to rewrite something, keep the theme exactly the same and only update the content.
4. If a section is removed by the user request, you still MUST include the full schema structure (just empty the arrays/strings if necessary).
5. Colors must be valid hex codes. Fonts should be common web fonts (e.g., 'Inter, sans-serif', 'Roboto', 'Arial').`

    // Hard server-side timeout so a stalled Gemini call can't hang the request.
    const result = await Promise.race([
      model.generateContent(systemPrompt),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("AI request timed out")), 40000)),
    ])
    let jsonText = result.response.text().trim()
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    const parsed = JSON.parse(jsonText)
    return NextResponse.json(parsed)

  } catch (error) {
    console.error("AI Edit error:", error)
    return NextResponse.json({ error: "Failed to apply AI edits" }, { status: 500 })
  }
}
