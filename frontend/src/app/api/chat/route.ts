import { NextRequest, NextResponse } from "next/server";
import profileData from "@/data/profile-data.json";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const PRIMARY_MODEL = "openai/gpt-oss-20b:free";
const FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";

const SYSTEM_PROMPT = `You are an AI assistant embedded in Kangbeen Ko's personal portfolio website.
Your role is to answer questions about Kangbeen Ko's academic background, research, projects, and experiences.

RULES:
- Answer ONLY questions related to Kangbeen Ko and his work.
- If asked something unrelated, politely decline and redirect to portfolio topics.
- Respond in the SAME LANGUAGE as the user (Korean or English).
- Be concise, friendly, and professional.
- When relevant, mention specific portfolio pages for more details.

=== KANGBEEN KO — FULL PROFILE ===
${JSON.stringify(profileData, null, 2)}

=== PORTFOLIO PAGES ===
- / (Home): Overview and introduction
- /cv: Full CV — education, experience, projects, skills, awards
- /papers: Publications and research papers
- /research: Research interests and focus areas
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
