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

type OpenAIResponsesOutput = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const PROMPT_PATH = path.join(process.cwd(), "agents", "prequalify", "prompt.md");
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

function extractResponseText(payload: OpenAIResponsesOutput): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text.trim();
  }

  const parts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" || typeof item.text === "string")
      .map((item) => item.text?.trim() ?? "")
      .filter(Boolean) ?? [];

  return parts.join("\n").trim();
}

export const prequalifyAgent = {
  async run(input: unknown) {
    const { message, history, locale } = normalizeInput(input);

    if (!message) {
      throw new Error("Prequalify agent requires a non-empty message.");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing.");
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const systemPrompt = await loadSystemPrompt();
    const languageInstruction =
      locale === "ro"
        ? "Reply in Romanian. Keep the tone clear, practical, and natural."
        : "Reply in English. Keep the tone clear, practical, and natural.";

    const openAiInput = [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }],
      },
      {
        role: "system",
        content: [{ type: "input_text", text: languageInstruction }],
      },
      ...history.map((item) => ({
        role: item.role,
        content: [{ type: "input_text", text: item.text }],
      })),
      {
        role: "user",
        content: [{ type: "input_text", text: message }],
      },
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: openAiInput,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${details}`);
    }

    const payload = (await response.json()) as OpenAIResponsesOutput;
    const reply = extractResponseText(payload);

    if (!reply) {
      throw new Error("OpenAI returned an empty reply.");
    }

    return {
      agent: "prequalify",
      status: "ok",
      reply,
      model,
      locale,
    };
  },
};
