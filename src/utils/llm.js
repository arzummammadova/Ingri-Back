/**
 * Minimal streaming LLM client. Provider order: Gemini -> Groq -> OpenAI (first key that is set).
 * Each provider yields plain text deltas via an async generator.
 */
export function activeProvider() {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

async function* readSse(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index;
    while ((index = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (line.startsWith("data:")) yield line.slice(5).trim();
    }
  }
  if (buffer.trim().startsWith("data:")) yield buffer.trim().slice(5).trim();
}

async function ensureOk(response, name) {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  const error = new Error(`${name} ${response.status}: ${body.slice(0, 300)}`);
  error.status = response.status;
  throw error;
}

const GEMINI_FALLBACKS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
const RETIRED_GEMINI = /^gemini-(1\.|2\.0|2\.5)/;

/** Configured model first (unless retired), then current fallbacks; retries briefly on 404/429/503. */
async function geminiResponse(system, history, signal) {
  const configured = (process.env.GEMINI_MODEL || "").trim();
  const models = [...new Set([configured && !RETIRED_GEMINI.test(configured) ? configured : null, ...GEMINI_FALLBACKS].filter(Boolean))];
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
  });
  let last;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
      const response = await fetch(url, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body,
      });
      if (response.ok) return response;
      last = response;
      if (response.status === 503 || response.status === 429) {
        await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
        continue;
      }
      if (response.status === 404) break;
      return response;
    }
  }
  return last;
}

async function* gemini(system, history, signal) {
  const response = await geminiResponse(system, history, signal);
  await ensureOk(response, "Gemini");
  for await (const data of readSse(response)) {
    try {
      const json = JSON.parse(data);
      const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
      if (text) yield text;
    } catch {
      /* ignore keep-alive lines */
    }
  }
}

async function* openaiCompatible(name, url, key, model, system, history, signal) {
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.6,
      max_tokens: 1024,
      messages: [{ role: "system", content: system }, ...history.map((m) => ({ role: m.role, content: m.content }))],
    }),
  });
  await ensureOk(response, name);
  for await (const data of readSse(response)) {
    if (data === "[DONE]") break;
    try {
      const text = JSON.parse(data).choices?.[0]?.delta?.content || "";
      if (text) yield text;
    } catch {
      /* ignore */
    }
  }
}

export function streamChat(system, history, signal) {
  switch (activeProvider()) {
    case "gemini":
      return gemini(system, history, signal);
    case "groq":
      return openaiCompatible("Groq", "https://api.groq.com/openai/v1/chat/completions", process.env.GROQ_API_KEY, process.env.GROQ_MODEL || "llama-3.3-70b-versatile", system, history, signal);
    case "openai":
      return openaiCompatible("OpenAI", "https://api.openai.com/v1/chat/completions", process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL || "gpt-4o-mini", system, history, signal);
    default:
      return null;
  }
}
