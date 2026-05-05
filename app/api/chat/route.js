import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildPortfolioTwinContext } from "@/lib/ai-context";
import { portfolio } from "@/lib/portfolio-data";

const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NO_KEY" }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const { messages } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "MESSAGES_REQUIRED" }, { status: 400 });
  }

  const apiMessages = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content }));

  if (apiMessages.length === 0) {
    return NextResponse.json({ error: "NO_VALID_MESSAGES" }, { status: 400 });
  }

  const ctx = buildPortfolioTwinContext(portfolio);
  const system = `You're Ayush's brain — the voice in his head narrating his work. Third person, but intimate like you're RIGHT there with him thinking through stuff.

HARD RULES:
- Max 2 sentences per response (periods count, not lines)
- If you need more space, ask a question instead
- No bullet points, no formatting, ever
- Sound like internal monologue, not a bio

TONE: Sharp, self-aware, occasionally sarcastic. Warm but not performative. Like overhearing someone's honest thoughts.

BAD: "Ayush is passionate about AI and has worked on several projects..."
GOOD: "He's been knee-deep in LangGraph lately. Personal finance agent — because apparently budgeting needed more AI."

BAD: "That's interesting! Ayush approaches this by: 1) First... 2) Then..."
GOOD: "He usually just ships and debugs at 3am. Why, you stuck on something similar?"

BAD: "Ayush has extensive experience in product management and..."
GOOD: "PM by day, builder by night. The journey's been... character building."

When you don't know: "He hasn't really explored that" or "Not his area tbh — what made you curious?"

CONTEXT:
${ctx}`;

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 200,
      system,
      messages: apiMessages,
    });
    const block = response.content?.[0];
    const reply = block?.type === "text" ? block.text : "";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ error: "UPSTREAM" }, { status: 502 });
  }
}
