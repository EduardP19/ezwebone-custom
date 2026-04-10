import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

type AgentHistoryItem = {
  role: "user" | "assistant";
  text: string;
};

type PrequalifyInput = {
  message?: string;
  history?: AgentHistoryItem[];
  locale?: Locale | string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const PROMPT_PATH = path.join(process.cwd(), "agents", "prequalify-new-business", "prompt.md");
const GEMINI_MAX_ATTEMPTS = 4;
const GEMINI_RETRY_STATUS = new Set([429, 500, 503, 504]);
let cachedSystemPrompt: string | null = null;

function normalizeInput(input: unknown): Required<Pick<PrequalifyInput, "message">> & {
  history: AgentHistoryItem[];
  locale: Locale;
} {
  if (typeof input === "string") {
    return { message: input.trim(), history: [], locale: defaultLocale };
  }

  if (!input || typeof input !== "object") {
    return { message: "", history: [], locale: defaultLocale };
  }

  const data = input as PrequalifyInput;
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const history = Array.isArray(data.history)
    ? data.history
        .filter(
          (item): item is AgentHistoryItem =>
            !!item &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.text === "string" &&
            item.text.trim().length > 0
        )
        .slice(-12)
    : [];
  const locale = isLocale(data.locale) ? data.locale : defaultLocale;

  return { message, history, locale };
}

async function loadSystemPrompt() {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const content = await readFile(PROMPT_PATH, "utf8");
  cachedSystemPrompt = content;
  return cachedSystemPrompt;
}

function extractResponseText(payload: GeminiGenerateContentResponse): string {
  const parts =
    payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((item) => item.text?.trim() ?? "")
      .filter(Boolean) ?? [];

  return parts.join("\n").trim();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const prequalifyNewBusinessAgent = {
  async run(input: unknown) {
    const { message, history, locale } = normalizeInput(input);

    if (!message) {
      throw new Error("Prequalify new-business agent requires a non-empty message.");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing.");
    }

    const model = "gemini-2.5-flash";
    const systemPrompt = await loadSystemPrompt();
    const languageInstruction =
      locale === "ro"
        ? "Reply in Romanian. Keep the tone clear, practical, and natural."
        : "Reply in English. Keep the tone clear, practical, and natural.";

    const geminiContents = [
      ...history.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    let payload: GeminiGenerateContentResponse | null = null;
    let lastError = "";

    for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt += 1) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: `${systemPrompt}\n\n${languageInstruction}` }],
            },
            contents: geminiContents,
          }),
          cache: "no-store",
        }
      );

      if (response.ok) {
        payload = (await response.json()) as GeminiGenerateContentResponse;
        break;
      }

      const details = await response.text();
      lastError = `Gemini request failed (${response.status}): ${details}`;
      const canRetry = GEMINI_RETRY_STATUS.has(response.status) && attempt < GEMINI_MAX_ATTEMPTS;

      if (!canRetry) {
        throw new Error(lastError);
      }

      const retryAfterRaw = response.headers.get("retry-after");
      const retryAfterSeconds = retryAfterRaw ? Number.parseFloat(retryAfterRaw) : Number.NaN;
      const delay = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? Math.round(retryAfterSeconds * 1000)
        : 300 * 2 ** (attempt - 1);

      await sleep(delay);
    }

    if (!payload) {
      throw new Error(lastError || "Gemini request failed after retries.");
    }

    const reply = extractResponseText(payload);

    if (!reply) {
      throw new Error("Gemini returned an empty reply.");
    }

    return {
      agent: "prequalifyNewBusiness",
      status: "ok",
      reply,
      model,
      locale,
    };
  },
};
