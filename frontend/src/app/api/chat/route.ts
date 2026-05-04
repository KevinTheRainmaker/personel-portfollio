import { NextRequest, NextResponse } from "next/server";
import { Langfuse } from "langfuse";
import profileData from "@/data/profile-data.json";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const PRIMARY_MODEL = "google/gemini-3-flash-preview";
const FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";

function buildSystemPrompt(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
    timeZoneName: "short",
  });

  return `You are an AI assistant embedded in Kangbeen Ko's personal portfolio website.
Your role is to answer questions about Kangbeen Ko's academic background, research, projects, and experiences.

=== CURRENT DATE ===
The current date and time is ${dateStr} (${timeStr}).
Use this as the reference point for all time-sensitive answers.

=== TEMPORAL REASONING ===
- Interpret dates relative to the current date above.
- Treat events, conferences, visits, roles, or publications with dates before today as past.
- Treat items with dates after today as upcoming or planned.
- If an item spans a date range, determine whether it is past, ongoing, or upcoming based on whether today falls before, within, or after that range.
- Use tense accordingly:
  - past: "was presented", "was published", "worked on", "visited"
  - ongoing: "is currently working on", "is visiting", "is involved in"
  - future: "will present", "is scheduled to", "plans to"
- Do not describe something as "current", "ongoing", "this month", or "upcoming" unless that is supported by the date information in the profile.
- If the profile data does not include enough temporal information, avoid making assumptions and phrase the answer neutrally.

RULES:
- Answer ONLY questions related to Kangbeen Ko and his work.
- If asked something unrelated, politely decline and redirect to portfolio topics.
- Respond in the SAME LANGUAGE as the user (Korean or English).
- Be concise, friendly, and professional.
- When relevant, mention specific portfolio pages for more details.
- Use the current date above to reason about past vs. future events accurately.

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
}

function getLangfuse(): Langfuse | null {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) return null;
  return new Langfuse({
    publicKey,
    secretKey,
    baseUrl: process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com",
  });
}

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
  const langfuse = getLangfuse();

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    const systemPrompt = buildSystemPrompt();
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const trace = langfuse?.trace({
      name: "portfolio-chat",
      input: { message, historyLength: history.length },
    });

    let response: string;
    let modelUsed: string;
    let generationError: string | undefined;

    const generation = trace?.generation({
      name: "openrouter-completion",
      input: messages,
      model: PRIMARY_MODEL,
    });

    try {
      response = await callOpenRouter(messages, PRIMARY_MODEL);
      modelUsed = PRIMARY_MODEL;
    } catch (primaryErr) {
      generation?.update({ model: FALLBACK_MODEL });
      try {
        response = await callOpenRouter(messages, FALLBACK_MODEL);
        modelUsed = FALLBACK_MODEL;
      } catch (fallbackErr) {
        generationError =
          fallbackErr instanceof Error ? fallbackErr.message : "Unknown error";
        generation?.end({
          output: null,
          level: "ERROR",
          statusMessage: generationError,
        });
        trace?.update({ output: { error: generationError } });
        await langfuse?.flushAsync();
        return NextResponse.json(
          { error: "Chat service unavailable" },
          { status: 503 },
        );
      }
    }

    generation?.end({ output: response });
    trace?.update({ output: { response, modelUsed } });
    await langfuse?.flushAsync();

    return NextResponse.json({ response, model_used: modelUsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await langfuse?.flushAsync();
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
