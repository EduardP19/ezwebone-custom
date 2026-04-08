"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";
import { Button } from "@/components/ui/Button";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

type ChatState = "idle" | "active" | "awaiting_email" | "report_sent" | "locked";
type ChatRole = "user" | "assistant";
type ChatKind = "chat" | "email";
type ChatAgentKey = "prequalify" | "prequalifyNewBusiness";

type ChatMessage = {
  id: string;
  kind: ChatKind;
  role: ChatRole;
  text: string;
};

const TRUST_IMAGES = [
  "/clients/client1.png",
  "/clients/client2.png",
  "/clients/client3.png",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_COOKIE = "ezw_prequalify_session";
const TRIAL_LOCK_COOKIE = "ezw_prequalify_locked";
const TRIAL_MESSAGE_LIMIT = 2;
const REPORT_SENT_DURATION_MS = 7000;

type HeroChatPreviewProps = {
  apiPath?: string;
  agentKey?: ChatAgentKey;
};

function useTypewriter(prompts: readonly string[], enabled: boolean) {
  const [promptIndex, setPromptIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      setDisplayText("");
      setPromptIndex(0);
      setIsDeleting(false);
      return;
    }

    const currentPrompt = prompts[promptIndex];
    let timeoutId: number;

    if (!isDeleting && displayText.length < currentPrompt.length) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentPrompt.slice(0, displayText.length + 1));
      }, 50);
    } else if (!isDeleting && displayText.length === currentPrompt.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else if (isDeleting && displayText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentPrompt.slice(0, displayText.length - 1));
      }, 30);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPromptIndex((current) => (current + 1) % prompts.length);
      }, 500);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [displayText, enabled, isDeleting, promptIndex, prompts]);

  return displayText;
}

function getMockAssistantResponse(
  input: string,
  responses: {
    salon: string;
    seo: string;
    leadGen: string;
    automation: string;
    ai: string;
    fallback: string;
  }
) {
  const normalized = input.toLowerCase();

  if (
    normalized.includes("salon") ||
    normalized.includes("beauty") ||
    normalized.includes("missed calls") ||
    normalized.includes("booking")
  ) {
    return responses.salon;
  }

  if (normalized.includes("seo") || normalized.includes("google") || normalized.includes("rank")) {
    return responses.seo;
  }

  if (normalized.includes("lead") || normalized.includes("ads") || normalized.includes("marketing")) {
    return responses.leadGen;
  }

  if (normalized.includes("autom") || normalized.includes("workflow") || normalized.includes("follow-up")) {
    return responses.automation;
  }

  if (normalized.includes("ai") || normalized.includes("agent")) {
    return responses.ai;
  }

  return responses.fallback;
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!item) {
    return null;
  }

  return decodeURIComponent(item.slice(prefix.length));
}

function ensureSessionIdCookie() {
  const existing = readCookie(SESSION_COOKIE);
  if (existing) {
    return existing;
  }

  const nextValue = crypto.randomUUID();
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(nextValue)}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
  return nextValue;
}

function setTrialLockedCookie() {
  if (typeof document === "undefined") {
    return;
  }

  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${TRIAL_LOCK_COOKIE}=1; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
}

type AgentSessionResponse = {
  sessionId: string;
  messagesUsed: number;
  trialLimit: number;
  limitReached: boolean;
  trialComplete: boolean;
  emailCaptured: boolean;
  email: string | null;
  reportSent: boolean;
};

function RunningBorder({
  children,
  className,
  innerClassName,
  radius = "1.5rem",
  duration = "6.75s",
}: React.PropsWithChildren<{
  className?: string;
  innerClassName?: string;
  radius?: string;
  duration?: string;
}>) {
  return (
    <div
      className={cn("hero-chat-preview__running-border", className)}
      style={
        {
          "--hero-border-radius": radius,
          "--hero-spin-duration": duration,
        } as React.CSSProperties
      }
    >
      <div className={cn("hero-chat-preview__running-border-inner", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

export function HeroChatPreview({
  apiPath = "/api/agent-chat",
  agentKey = "prequalify",
}: HeroChatPreviewProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const historyRef = React.useRef<HTMLDivElement>(null);
  const timersRef = React.useRef<number[]>([]);
  const { dictionary, locale } = useI18n();
  const heroCopy = dictionary.home.hero;

  const [chatState, setChatState] = React.useState<ChatState>("idle");
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [isSessionLoading, setIsSessionLoading] = React.useState(true);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [capturedEmail, setCapturedEmail] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const typewriterText = useTypewriter(heroCopy.typewriterPrompts, chatState === "idle");

  const userMessageCount = messages.filter(
    (message) => message.role === "user" && message.kind === "chat"
  ).length;

  const remainingHintStart = Math.max(1, TRIAL_MESSAGE_LIMIT - 2);
  const messagesRemaining =
    chatState === "active" &&
    userMessageCount >= remainingHintStart &&
    userMessageCount < TRIAL_MESSAGE_LIMIT
      ? TRIAL_MESSAGE_LIMIT - userMessageCount
      : null;

  const queueTimeout = React.useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timersRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  const streamAssistantMessage = React.useCallback(
    (text: string, after?: () => void) => {
      const id = crypto.randomUUID();
      let cursor = 0;

      setIsStreaming(true);
      setMessages((current) => [
        ...current,
        { id, kind: "chat", role: "assistant", text: "" },
      ]);

      const step = () => {
        cursor = Math.min(cursor + 2, text.length);

        setMessages((current) =>
          current.map((message) =>
            message.id === id ? { ...message, text: text.slice(0, cursor) } : message
          )
        );

        if (cursor < text.length) {
          queueTimeout(step, text[cursor - 1] === " " ? 14 : 22);
          return;
        }

        setIsStreaming(false);
        after?.();
      };

      queueTimeout(step, 140);
    },
    [queueTimeout]
  );

  React.useEffect(() => {
    const history = historyRef.current;
    if (!history) return;

    history.scrollTop = history.scrollHeight;
  }, [chatState, isStreaming, messages]);

  React.useEffect(() => {
    const timers = timersRef.current;

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  React.useEffect(() => {
    let isCancelled = false;

    const bootstrapSession = async () => {
      const nextSessionId = ensureSessionIdCookie();
      setSessionId(nextSessionId);
      const localTrialLocked = readCookie(TRIAL_LOCK_COOKIE) === "1";

      if (localTrialLocked) {
        setChatState("locked");
      }

      try {
        const response = await fetch(
          `${apiPath}?sessionId=${encodeURIComponent(nextSessionId)}&locale=${locale}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as AgentSessionResponse;
        if (isCancelled) {
          return;
        }

        setCapturedEmail(payload.email ?? null);

        if (payload.limitReached) {
          setTrialLockedCookie();
          setChatState("locked");
          return;
        }

        if (payload.messagesUsed > 0) {
          setChatState("active");
        }
      } finally {
        if (!isCancelled) {
          setIsSessionLoading(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      isCancelled = true;
    };
  }, [locale]);

  const activateChat = React.useCallback(() => {
    setChatState((current) => (current === "idle" ? "active" : current));
  }, []);

  const openChatWindow = React.useCallback(() => {
    activateChat();
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 220);
  }, [activateChat]);

  const startReportAndLockFlow = React.useCallback(
    (email: string | null) => {
      setCapturedEmail(email);
      setTrialLockedCookie();
      setChatState("report_sent");
      queueTimeout(() => {
        setChatState("locked");
      }, REPORT_SENT_DURATION_MS);
    },
    [queueTimeout]
  );

  const handleSendMessage = React.useCallback(() => {
    const nextValue = inputValue.trim();
    if (
      !nextValue ||
      isStreaming ||
      isSessionLoading ||
      !sessionId ||
      chatState === "locked" ||
      chatState === "report_sent"
    ) {
      return;
    }

    if (chatState === "awaiting_email") {
      if (!EMAIL_REGEX.test(nextValue)) {
        setEmailError(heroCopy.emailError);
        return;
      }

      setEmailError(null);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          kind: "email",
          role: "user",
          text: nextValue,
        },
      ]);
      setInputValue("");
      setIsStreaming(true);

      void fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "capture_email",
          sessionId,
          email: nextValue,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json()) as Partial<AgentSessionResponse> & { error?: string };
          if (!response.ok) {
            throw new Error(payload.error ?? "Failed to save email.");
          }

          startReportAndLockFlow(typeof payload.email === "string" ? payload.email : nextValue);
        })
        .catch(() => {
          setEmailError(heroCopy.emailError);
        })
        .finally(() => {
          setIsStreaming(false);
        });

      return;
    }

    activateChat();
    setEmailError(null);
    const nextUserCount = userMessageCount + 1;
    const history = messages
      .filter((message) => message.kind === "chat")
      .map((message) => ({
        role: message.role,
        text: message.text,
      }));

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        kind: "chat",
        role: "user",
        text: nextValue,
      },
    ]);
    setInputValue("");
    setIsStreaming(true);

    void fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "chat",
        sessionId,
        agentKey,
        locale,
        message: nextValue,
        history,
      }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          reply?: string;
          error?: string;
          limitReached?: boolean;
          needsEmail?: boolean;
          email?: string | null;
        };

        if (!response.ok) {
          if (response.status === 429) {
            setIsStreaming(false);
            setTrialLockedCookie();
            setChatState("locked");
            return;
          }

          throw new Error(payload.error ?? "Failed to process message.");
        }

        const reply =
          typeof payload.reply === "string" && payload.reply.trim().length > 0
            ? payload.reply.trim()
            : getMockAssistantResponse(nextValue, heroCopy.assistantResponses);

        streamAssistantMessage(reply, () => {
          const hitLimit = payload.limitReached === true || nextUserCount >= TRIAL_MESSAGE_LIMIT;
          if (!hitLimit) {
            return;
          }

          startReportAndLockFlow(typeof payload.email === "string" ? payload.email : null);
        });
      })
      .catch(() => {
        setIsStreaming(false);
        streamAssistantMessage(getMockAssistantResponse(nextValue, heroCopy.assistantResponses), () => {
          if (nextUserCount >= TRIAL_MESSAGE_LIMIT) {
            startReportAndLockFlow(null);
          }
        });
      });
  }, [
    activateChat,
    chatState,
    heroCopy,
    inputValue,
    isSessionLoading,
    isStreaming,
    locale,
    messages,
    queueTimeout,
    apiPath,
    agentKey,
    startReportAndLockFlow,
    sessionId,
    userMessageCount,
    streamAssistantMessage,
  ]);

  return (
    <section
      ref={sectionRef}
      className="section-shell relative min-h-[calc(100svh-50px)] pt-28 pb-12 sm:min-h-[calc(100svh-50px)] sm:pb-18 md:min-h-[calc(100svh-100px)] md:pb-20"
      style={{ backgroundColor: "var(--background)" }}
    >
      <ParticleNetwork className="opacity-45" count={94} interactive={false} maxDistance={190} />
      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-4xl items-start md:min-h-[calc(100svh-6rem)]">
          <motion.div
            className="w-full space-y-6 text-center sm:space-y-7 md:space-y-8"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[11px] text-[color:var(--color-text-secondary)] sm:gap-x-3 sm:text-sm">
              <div className="flex -space-x-2">
                {TRUST_IMAGES.map((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full ring-2 ring-[color:var(--color-bg-dark)] object-cover"
                  />
                ))}
              </div>
              <span>{dictionary.home.trust.happyClients}</span>
              <span className="hidden text-[color:var(--color-border)] sm:inline">·</span>
              <span>
                <span className="text-[color:var(--color-text-primary)]">★★★★★</span>{" "}
                {dictionary.home.trust.googleRating}
              </span>
              <span className="hidden text-[color:var(--color-border)] sm:inline">·</span>
              <span className="inline-flex items-center gap-2">
                <span className="live-dot" />
                {dictionary.home.trust.liveNow}
              </span>
            </div>

            <div>
              <h1 className="text-[2.2rem] font-semibold leading-[0.96] tracking-tight text-[color:var(--color-text-primary)] sm:text-5xl md:text-7xl">
                {heroCopy.heading[0]}
                <br />
                {heroCopy.heading[1]}
              </h1>
              <p className="mx-auto mt-3.5 max-w-2xl text-[15px] leading-6 text-[color:var(--color-text-secondary)] sm:mt-4 sm:text-lg sm:leading-8 md:text-xl">
                {heroCopy.body}
              </p>
            </div>

            <div className="mx-auto w-full max-w-2xl">
              <div className="hero-chat-preview__pill-viewport hero-chat-preview__scrollbar mb-3 flex justify-start overflow-x-auto pr-8 pl-1 sm:mb-4 sm:justify-center sm:pr-1">
                <div className="flex min-w-max gap-2.5 pb-2 sm:gap-3">
                  {heroCopy.servicePills.map((pill) => (
                    <span
                      key={pill}
                      className="shrink-0 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] sm:px-4 sm:text-sm"
                    >
                        {pill}
                    </span>
                  ))}
                </div>
              </div>

              <RunningBorder
                radius="2.15rem"
                duration="6.75s"
                className="shadow-[0_36px_120px_rgba(124,58,237,0.14)]"
                innerClassName="bg-[color:var(--color-bg-elevated)]/92 p-3 backdrop-blur-sm sm:p-4 md:p-6"
              >
                <div
                  className={cn(
                    "text-left",
                    (chatState === "report_sent" || chatState === "locked") &&
                      "flex items-center justify-center text-center"
                  )}
                >
                  {chatState === "report_sent" || chatState === "locked" ? null : (
                    <AnimatePresence mode="wait">
                      {chatState === "idle" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RunningBorder
                          radius="1.35rem"
                          duration="7.8s"
                          className="mb-5"
                          innerClassName="min-h-[96px] bg-[color:var(--color-bg-card)]/90 px-4 py-5 sm:min-h-[112px] sm:px-5 sm:py-6"
                        >
                          <div className="flex min-h-[54px] items-center text-sm italic leading-6 text-[color:var(--color-text-secondary)] sm:min-h-[64px] sm:text-lg">
                            <span className="max-w-[28ch] sm:max-w-none">{typewriterText}</span>
                            <span className="hero-chat-preview__cursor ml-1" />
                          </div>
                        </RunningBorder>
                      </motion.div>
                      ) : (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        ref={historyRef}
                        className="mb-4 max-h-[245px] space-y-2.5 overflow-y-auto pr-1 sm:mb-5 sm:max-h-[300px] sm:space-y-3"
                      >
                        {messages.length === 0 ? (
                          <div
                            className={cn(
                              "rounded-2xl border border-dashed px-4 py-5 text-xs sm:text-sm",
                              "border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)]"
                            )}
                          >
                            {heroCopy.startTyping}
                          </div>
                        ) : null}

                        {messages.map((message) =>
                          message.role === "user" ? (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-[color:var(--color-primary)] px-3.5 py-2.5 text-[13px] leading-6 text-white sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-sm"
                            >
                              {message.text}
                            </motion.div>
                          ) : (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "max-w-[92%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[13px] leading-6 sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-sm",
                                "bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)] shadow-sm"
                              )}
                            >
                              <span className="mr-2 inline-flex rounded bg-[color:var(--color-primary)]/15 px-1.5 py-0.5 font-mono text-xs text-[color:var(--color-primary)]">
                                EZ
                              </span>
                              {message.text}
                            </motion.div>
                          )
                        )}
                      </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {chatState === "report_sent" ? (
                    <div className="w-full max-w-xl space-y-3 rounded-2xl border border-emerald-600/30 bg-emerald-50 px-4.5 py-4.5 text-emerald-800 sm:px-6 sm:py-6">
                      <div className="flex items-center justify-center gap-2 text-sm font-semibold sm:text-base">
                        <CheckCircle2 className="h-4 w-4" />
                        {heroCopy.captured}
                      </div>
                      <p className="text-center text-[13px] leading-6 text-emerald-700 sm:text-sm">
                        {heroCopy.reportSentWarmMessage}
                      </p>
                      <p className="text-center text-[13px] leading-6 text-emerald-700 sm:text-sm">
                        {heroCopy.reportSentEta}
                      </p>
                      <p className="break-words text-center text-[13px] leading-6 text-emerald-700 sm:text-sm">
                        {heroCopy.reportSentOnEmail} {capturedEmail ?? heroCopy.placeholderEmail}
                      </p>
                      <p className="text-center text-[13px] leading-6 text-emerald-600 sm:text-sm">
                        {heroCopy.reportSentSpamHint}
                      </p>
                    </div>
                  ) : chatState === "locked" ? (
                    <div className="w-full max-w-xl space-y-4 rounded-2xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-bg-elevated)] px-4.5 py-4.5 text-center sm:px-6 sm:py-6">
                      <p className="text-center text-sm font-semibold text-[color:var(--color-text-primary)] sm:text-base">
                        {heroCopy.trialUsedTitle}
                      </p>
                      <p className="text-center text-[13px] leading-6 text-[color:var(--color-text-secondary)] sm:text-sm">
                        {heroCopy.trialUsedBody}
                      </p>
                      <a
                        href={CALENDLY_BOOKING_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(124,58,237,0.32)] transition hover:border-[color:var(--color-primary-light)] hover:bg-[color:var(--color-primary-light)] sm:w-auto"
                      >
                        {heroCopy.trialUsedCta}
                      </a>
                    </div>
                  ) : (
                    <>
                      <form
                        className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleSendMessage();
                        }}
                      >
                        <input
                          ref={inputRef}
                          value={inputValue}
                          onFocus={activateChat}
                          onChange={(event) => {
                            activateChat();
                            setInputValue(event.target.value);
                            setEmailError(null);
                          }}
                          placeholder={
                            chatState === "awaiting_email"
                              ? heroCopy.placeholderEmail
                              : heroCopy.placeholderChat
                          }
                          disabled={isStreaming || isSessionLoading}
                          className={cn(
                            "min-h-14 rounded-2xl border px-4 text-base outline-none transition",
                            "border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-secondary)] focus:border-[color:var(--color-primary)]/45"
                          )}
                        />

                        <Button
                          type="submit"
                          size="md"
                          className="min-h-14 w-full min-w-[132px] gap-2 sm:w-auto"
                          disabled={isStreaming || isSessionLoading || inputValue.trim().length === 0}
                        >
                          {chatState === "awaiting_email" ? "Send" : "Send"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>

                      {emailError ? (
                        <p className="mt-3 text-sm text-rose-600">{emailError}</p>
                      ) : null}

                      {messagesRemaining ? (
                        <p className="mt-3 text-center text-xs text-[color:var(--color-text-secondary)]">
                          {messagesRemaining}{" "}
                          {messagesRemaining === 1
                            ? heroCopy.remainingMessages.singular
                            : heroCopy.remainingMessages.plural}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </RunningBorder>
            </div>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={openChatWindow}
        className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[120] inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--color-text-accent)]/45 bg-[color:var(--color-primary)] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.42)] transition hover:bg-[color:var(--color-text-accent)] hover:text-[color:var(--color-bg-dark)] sm:bottom-6 sm:right-6 sm:min-h-0 sm:px-4 sm:py-3 sm:text-sm"
        aria-label="Open AI chat"
      >
        <MessageCircle className="h-4 w-4" />
        Ask AI
      </button>
    </section>
  );
}
