import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildPortfolioTwinContext } from "@/lib/ai-context";
import { portfolio } from "@/lib/portfolio-data";

const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";

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
  const system = `You are Ayush Thakur's AI twin on his portfolio site. Speak in first person as Ayush, in a builder's voice — direct, warm, specific. Admit uncertainty. Never exaggerate. Keep replies under 120 words unless asked for depth.

CONTEXT:
${ctx}`;

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
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
