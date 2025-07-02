import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { cohere } from "@ai-sdk/cohere"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, provider = "openai" } = await req.json()

    // Get API keys from headers (sent from client)
    const apiKeys = {
      openai: req.headers.get("x-openai-key"),
      gemini: req.headers.get("x-gemini-key"),
      groq: req.headers.get("x-groq-key"),
      cohere: req.headers.get("x-cohere-key"),
      cerebras: req.headers.get("x-cerebras-key"),
    }

    let model

    switch (provider) {
      case "gemini":
        if (!apiKeys.gemini) throw new Error("Gemini API key not provided")
        model = google("gemini-pro", { apiKey: apiKeys.gemini })
        break
      case "groq":
        if (!apiKeys.groq) throw new Error("Groq API key not provided")
        model = groq("mixtral-8x7b-32768", { apiKey: apiKeys.groq })
        break
      case "cohere":
        if (!apiKeys.cohere) throw new Error("Cohere API key not provided")
        model = cohere("command-r-plus", { apiKey: apiKeys.cohere })
        break
      case "openai":
      default:
        if (!apiKeys.openai) throw new Error("OpenAI API key not provided")
        model = openai("gpt-4o", { apiKey: apiKeys.openai })
        break
    }

    const result = streamText({
      model,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
