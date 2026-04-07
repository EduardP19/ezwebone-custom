import {
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { runAgent } from "@/lib/runAgent";

export type AgentHistoryItem = {
  role: "user" | "assistant";
  text: string;
};

type AgentChatPayload = {
  message?: string;
  history?: AgentHistoryItem[];
  locale?: Locale | string;
  bypassReview?: boolean;
};

export type ParsedAgentChatPayload = {
  message: string;
  history: AgentHistoryItem[];
  locale: Locale;
  bypassReview: boolean;
};

function isHistoryItem(value: unknown): value is AgentHistoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<AgentHistoryItem>;

  return (
    (item.role === "user" || item.role === "assistant") &&
    typeof item.text === "string" &&
    item.text.trim().length > 0
  );
}

export function parseAgentChatPayload(payload: unknown): ParsedAgentChatPayload {
  if (!payload || typeof payload !== "object") {
    return {
      message: "",
      history: [],
      locale: defaultLocale,
      bypassReview: false,
    };
  }

  const data = payload as AgentChatPayload;

  return {
    message: typeof data.message === "string" ? data.message.trim() : "",
    history: Array.isArray(data.history) ? data.history.filter(isHistoryItem).slice(-12) : [],
    locale: isLocale(data.locale) ? data.locale : defaultLocale,
    bypassReview: data.bypassReview === true,
  };
}

export async function runPrequalifyChat({
  message,
  history,
  locale,
}: Pick<ParsedAgentChatPayload, "message" | "history" | "locale">) {
  const result = await runAgent("prequalify", {
    message,
    history,
    locale,
  });

  const reply =
    result &&
    typeof result === "object" &&
    "reply" in result &&
    typeof (result as { reply?: unknown }).reply === "string"
      ? (result as { reply: string }).reply
      : "";

  if (!reply) {
    throw new Error("Agent response was empty.");
  }

  return {
    reply,
    source: "prequalify" as const,
    result,
    locale,
  };
}
