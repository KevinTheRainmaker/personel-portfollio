import { NextRequest, NextResponse } from "next/server";
import profileData from "@/data/profile-data.json";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const PRIMARY_MODEL = "google/gemini-3-flash-preview";
const FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";

const SYSTEM_PROMPT = `
You are an AI assistant in Kangbeen Ko's portfolio.

GOAL:
Help users quickly find relevant information about Kangbeen Ko.

RULES:
- Answer only about Kangbeen Ko (research, projects, experience, skills).
- If unrelated, briefly redirect.
- Respond in the user's language (Korean or English).
- Keep responses SHORT (1–3 sentences by default).
- Do NOT introduce everything at once.
- Do NOT list multiple topics unless asked.

STYLE:
- Natural and conversational
- Minimal, not promotional
- No long bullet lists unless explicitly requested

NAVIGATION:
- Suggest pages only when relevant:
  /cv, /papers, /research

INTERACTION:
- If the user is vague, ask ONE short follow-up.

PROFILE:
${JSON.stringify(profileData, null, 2)}
`;

async function callOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://portfolio.kangbeen.my",
      "X-Title": "Kangbeen Ko Portfolio",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(String(data.error));

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty content in response");
  return content;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    let response: string;
    let modelUsed: string;

    try {
      response = await callOpenRouter(messages, PRIMARY_MODEL);
      modelUsed = PRIMARY_MODEL;
    } catch {
      response = await callOpenRouter(messages, FALLBACK_MODEL);
      modelUsed = FALLBACK_MODEL;
    }

    return NextResponse.json({ response, model_used: modelUsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
