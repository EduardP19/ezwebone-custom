"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bot,
  LoaderCircle,
  RotateCcw,
  SendHorizontal,
  ShieldOff,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type LiveAgentResponse = {
  reply?: string;
  error?: string;
};

function toHistory(messages: ChatMessage[]) {
  return messages.map(({ role, text }) => ({ role, text }));
}

export function TestAgentPageClient() {
  const endRef = React.useRef<HTMLDivElement>(null);
  const { locale, dictionary } = useI18n();
  const copy = dictionary.pages.test;

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  const handleReset = React.useCallback(() => {
    setMessages([]);
    setInputValue("");
    setError(null);
  }, []);

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const message = inputValue.trim();
      if (!message || isSending) {
        return;
      }

      const history = toHistory(messages);
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: message,
      };

      setMessages((current) => [...current, userMessage]);
      setInputValue("");
      setError(null);
      setIsSending(true);

      try {
        const response = await fetch("/api/agent-chat/live", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            history,
            locale,
            bypassReview: true,
          }),
        });

        const payload = (await response.json()) as LiveAgentResponse;

        const reply = payload.reply;

        if (!response.ok || !reply) {
          throw new Error(payload.error ?? copy.error);
        }

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: reply,
          },
        ]);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : copy.error);
      } finally {
        setIsSending(false);
      }
    },
    [copy.error, inputValue, isSending, locale, messages]
  );

  return (
    <section className="section-shell relative overflow-hidden bg-[color:var(--color-bg-dark)] pb-16 pt-28 sm:pb-20 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.18),rgba(10,10,15,0.94))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="space-y-6">
            <Badge>{copy.badge}</Badge>

            <div className="max-w-2xl space-y-4">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {copy.title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-[color:var(--color-text-secondary)] sm:text-lg">
                {copy.body}
              </p>
            </div>

            <Card
              padding="lg"
              className="border-white/10 bg-white/[0.06] text-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-200">
                    <ShieldOff size={22} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-display text-xl font-semibold text-white">
                        {copy.directTitle}
                      </p>
                      <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                        {copy.bypassBadge}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      {copy.directBody}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90">
                      <Bot size={20} />
                    </div>
                    <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      {copy.helper}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card
            padding="lg"
            className="border-white/10 bg-white/[0.06] text-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="mono-label text-xs text-[color:var(--color-text-secondary)]">
                  {copy.badge}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                  {copy.transcriptTitle}
                </h2>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={handleReset}
                disabled={messages.length === 0 && inputValue.length === 0}
              >
                <RotateCcw size={16} />
                {copy.reset}
              </Button>
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-black/20 p-4 sm:p-5">
              <div className="h-[420px] space-y-4 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
                    <p className="max-w-sm text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      {copy.transcriptEmpty}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isAssistant = message.role === "assistant";

                    return (
                      <div
                        key={message.id}
                        className={cn("flex", isAssistant ? "justify-start" : "justify-end")}
                      >
                        <div
                          className={cn(
                            "max-w-[88%] rounded-[1.5rem] border px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
                            isAssistant
                              ? "border-white/10 bg-white/[0.08] text-white"
                              : "border-[color:var(--color-primary-light)]/30 bg-[color:var(--color-primary)]/20 text-white"
                          )}
                        >
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-secondary)]">
                            {isAssistant ? copy.liveReplyLabel : copy.userLabel}
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}

                {isSending ? (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-[color:var(--color-text-secondary)]">
                      <LoaderCircle className="animate-spin" size={16} />
                      {copy.sending}
                    </div>
                  </div>
                ) : null}

                <div ref={endRef} />
              </div>
            </div>

            {error ? (
              <div className="mt-4 flex items-start gap-3 rounded-[1.5rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            <form className="mt-5" onSubmit={handleSubmit}>
              <label
                htmlFor="live-agent-message"
                className="mb-3 block text-sm font-medium text-white"
              >
                {copy.composerLabel}
              </label>
              <textarea
                id="live-agent-message"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSubmit();
                  }
                }}
                placeholder={copy.composerPlaceholder}
                disabled={isSending}
                rows={4}
                className="min-h-[120px] w-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-white placeholder:text-[color:var(--color-text-secondary)] focus:border-[color:var(--color-primary-light)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-light)]/35"
              />

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xl text-xs leading-5 text-[color:var(--color-text-secondary)]">
                  {copy.helper}
                </p>

                <Button
                  type="submit"
                  className="gap-2 sm:min-w-[220px]"
                  disabled={!inputValue.trim() || isSending}
                >
                  {isSending ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <SendHorizontal size={18} />
                  )}
                  {isSending ? copy.sending : copy.send}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
