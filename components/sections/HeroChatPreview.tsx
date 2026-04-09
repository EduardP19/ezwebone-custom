"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";
import { cn } from "@/lib/utils";

type ChatState = "idle" | "active" | "locked";
type ChatRole = "user" | "assistant";
type ChatKind = "chat" | "email";

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
const COMMAND_TAGS = ["Websites", "Automations", "AI Agents", "Marketing", "SEO", "Lead Gen"];

const TRAINING_REPLY_EN =
  "Thank you for your message. Our AI agent is being trained at the moment and will be available soon.";
const TRAINING_REPLY_RO =
  "Iti multumim pentru mesaj. Agentul nostru AI este in training momentan si va fi disponibil in curand.";

type HeroChatPreviewProps = {
  apiPath?: string;
  agentKey?: string;
};

function useTypewriter(prompts: readonly string[], enabled: boolean) {
  const [promptIndex, setPromptIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || prompts.length === 0) {
      setDisplayText("");
      setPromptIndex(0);
      setIsDeleting(false);
      return;
    }

    const currentPrompt = prompts[promptIndex] ?? "";
    let timeoutId: number;

    if (!isDeleting && displayText.length < currentPrompt.length) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentPrompt.slice(0, displayText.length + 1));
      }, 45);
    } else if (!isDeleting && displayText.length === currentPrompt.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && displayText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentPrompt.slice(0, displayText.length - 1));
      }, 24);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPromptIndex((current) => (current + 1) % prompts.length);
      }, 250);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [displayText, enabled, isDeleting, promptIndex, prompts]);

  return displayText;
}

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

export function HeroChatPreview({ apiPath: _apiPath, agentKey: _agentKey }: HeroChatPreviewProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const historyRef = React.useRef<HTMLDivElement>(null);
  const timersRef = React.useRef<number[]>([]);
  const { dictionary, locale } = useI18n();
  const heroCopy = dictionary.home.hero;
  const trainingReply = locale === "ro" ? TRAINING_REPLY_RO : TRAINING_REPLY_EN;
  const trainingLockedTitle = locale === "ro" ? "Agentul AI este in training" : "AI agent is in training";
  const trainingLockedBody =
    locale === "ro"
      ? "Momentan raspunde o singura data in modul de training. Revino curand pentru versiunea completa."
      : "For now it replies once in training mode. Please check back soon for the full version.";

  const [chatState, setChatState] = React.useState<ChatState>("idle");
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  const userMessageCount = messages.filter(
    (message) => message.role === "user" && message.kind === "chat"
  ).length;
  const typewriterText = useTypewriter(
    heroCopy.typewriterPrompts,
    hasMounted && chatState !== "locked" && userMessageCount === 0 && inputValue.length === 0
  );
  const showInputOverlay =
    hasMounted && chatState !== "locked" && userMessageCount === 0 && inputValue.length === 0;

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
    setHasMounted(true);
  }, []);

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

  const handleSendMessage = React.useCallback(() => {
    const nextValue = inputValue.trim();
    if (
      !nextValue ||
      isStreaming ||
      chatState === "locked"
    ) {
      return;
    }

    activateChat();

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
    streamAssistantMessage(trainingReply, () => {
      setChatState("locked");
    });
  }, [
    activateChat,
    chatState,
    inputValue,
    isStreaming,
    streamAssistantMessage,
    trainingReply,
  ]);

  return (
    <section
      ref={sectionRef}
      className="section-shell relative min-h-[calc(100svh-450px)] pt-16 pb-8 sm:min-h-[calc(100svh-450px)] sm:pb-10 md:min-h-[calc(100svh-500px)] md:pb-12"
      style={{ backgroundColor: "var(--background)" }}
    >
      <ParticleNetwork className="opacity-45" count={94} interactive={false} maxDistance={190} />
      <div className="pointer-events-none absolute inset-0 bg-[rgba(91,33,182,0.10)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mx-auto flex min-h-[calc(100svh-29rem)] max-w-4xl items-start md:min-h-[calc(100svh-31rem)]">
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
                <span className="tracking-[0.08em] text-[#f59e0b] drop-shadow-[0_1px_8px_rgba(245,158,11,0.35)]">
                  ★★★★★
                </span>{" "}
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
              <div className="hero-chat-preview__pill-viewport hero-chat-preview__scrollbar mb-4 flex justify-start overflow-x-auto pr-8 pl-1 sm:mb-5 sm:justify-center sm:pr-1">
                <div className="flex min-w-max gap-2.5 pb-2 sm:gap-3">
                  {COMMAND_TAGS.map((tag) => (
                    <span key={tag} className="ai-command-chip shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold tracking-[0.02em] sm:px-4 sm:text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <RunningBorder
                radius="2.15rem"
                duration="6.75s"
                className="ai-command-center shadow-[0_42px_130px_rgba(124,58,237,0.16)]"
                innerClassName="bg-[rgba(28,42,68,0.30)] p-4 backdrop-blur-[20px] sm:p-5 md:p-6"
              >
                <div
                  className={cn(
                    "text-left",
                    chatState === "locked" &&
                      "flex items-center justify-center text-center"
                  )}
                >
                  {chatState === "locked" ? null : (
                    <AnimatePresence mode="wait">
                      {chatState === "idle" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-5 flex min-h-[64px] items-center px-1 text-base italic leading-7 tracking-[0.01em] text-white/92 sm:min-h-[72px] sm:text-lg">
                          <span suppressHydrationWarning className="max-w-[28ch] sm:max-w-none">
                            {heroCopy.placeholderChat}
                          </span>
                        </div>
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
                          <div className="mb-5 flex min-h-[64px] items-center px-1 text-base italic leading-7 tracking-[0.01em] text-white/92 sm:min-h-[72px] sm:text-lg">
                            <span suppressHydrationWarning className="max-w-[28ch] sm:max-w-none">
                              {heroCopy.placeholderChat}
                            </span>
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

                  {chatState === "locked" ? (
                    <div className="w-full max-w-xl space-y-4 rounded-2xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-bg-elevated)] px-4.5 py-4.5 text-center sm:px-6 sm:py-6">
                      <p className="text-center text-sm font-semibold text-[color:var(--color-text-primary)] sm:text-base">
                        {trainingLockedTitle}
                      </p>
                      <p className="text-center text-[13px] leading-6 text-[color:var(--color-text-secondary)] sm:text-sm">
                        {trainingLockedBody}
                      </p>
                    </div>
                  ) : (
                    <>
                      <form
                        className="ai-command-bar grid items-center gap-2.5 rounded-[1.4rem] border border-[color:var(--color-border)]/70 bg-[#e5e7eb] p-2.5 sm:grid-cols-[minmax(0,1fr)_auto]"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleSendMessage();
                        }}
                      >
                        <div className="relative">
                          {showInputOverlay ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center overflow-hidden text-base tracking-[0.01em] text-[color:#4b5563]/75"
                            >
                              {typewriterText}
                            </span>
                          ) : null}
                          <input
                            ref={inputRef}
                            value={inputValue}
                            onFocus={activateChat}
                            onChange={(event) => {
                              activateChat();
                              setInputValue(event.target.value);
                            }}
                            aria-label={heroCopy.placeholderChat}
                            disabled={isStreaming}
                            className="min-h-14 w-full rounded-[1.05rem] border border-[color:var(--color-border)]/70 bg-white px-4 text-base tracking-[0.01em] text-[color:#111827] outline-none transition focus:border-[color:var(--color-primary-light)]/70"
                          />
                        </div>

                        <button
                          type="submit"
                          className="ai-command-send-button inline-flex min-h-14 w-full min-w-[132px] items-center justify-center gap-2 rounded-[1.05rem] px-6 text-sm font-semibold tracking-[0.02em] text-white sm:w-auto"
                          disabled={isStreaming || inputValue.trim().length === 0}
                        >
                          Send
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </form>
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
