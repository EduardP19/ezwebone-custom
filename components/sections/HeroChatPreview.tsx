"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCheck } from "lucide-react";
import { ParticleNetwork } from "@/components/sections/ParticleNetwork";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ChatState = "idle" | "active" | "awaiting_email" | "captured";
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

const TYPEWRITER_PROMPTS = [
  "I run a salon and keep missing calls from clients...",
  "I need a website that actually brings in customers...",
  "Can you automate my booking confirmations and follow-ups?",
  "I want to rank on Google but don't know where to start...",
  "How can AI help my small business grow?",
];

const SERVICE_PILLS = [
  {
    label: "Websites",
    prompt: "Hi, I need a custom website for my business. Where should I start?",
  },
  {
    label: "Automations",
    prompt: "Hi, I'd like help automating my business. Where should I start?",
  },
  {
    label: "AI Agents",
    prompt: "Hi, I'm interested in an AI agent for my business. How does that work?",
  },
  {
    label: "Marketing",
    prompt: "Hi, I need help with online marketing and ads. What do you offer?",
  },
  {
    label: "SEO",
    prompt: "Hi, I want my business to rank higher on Google. Can you help with SEO?",
  },
  {
    label: "Lead Gen",
    prompt: "Hi, I need help generating more leads for my business. What's the best approach?",
  },
];

const EMAIL_CAPTURE_PROMPT =
  "I've got a clear picture of what your business needs. I can put together a personalised recommendation with the right service mix and realistic next steps. What's the best email to send it to?";

const EMAIL_CONFIRMATION_PROMPT =
  "You're all set. Check your inbox within 24 hours and we'll send over a personalised recommendation. Is there anything else you'd like this preview to reflect later?";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useTypewriter(prompts: string[], enabled: boolean) {
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

function getMockAssistantResponse(input: string) {
  const normalized = input.toLowerCase();

  if (
    normalized.includes("salon") ||
    normalized.includes("beauty") ||
    normalized.includes("missed calls") ||
    normalized.includes("booking")
  ) {
    return "For salons and service businesses, we'd usually start with Resevia so missed calls turn into booked conversations instead of lost revenue. We can pair that with a stronger website or automations once the enquiry flow is under control. Is missed-call recovery or booking admin the bigger issue for you right now?";
  }

  if (normalized.includes("seo") || normalized.includes("google") || normalized.includes("rank")) {
    return "SEO usually works best when the website structure, service pages, and local intent all line up around what people actually search for. We'd tighten the technical foundation first, then build content that supports rankings and leads. Are you trying to rank for your town, a specific service, or both?";
  }

  if (normalized.includes("lead") || normalized.includes("ads") || normalized.includes("marketing")) {
    return "Lead generation gets stronger when the offer, landing page, and follow-up system are built as one flow instead of separate pieces. We can help with the ads side, the page itself, and the automation that keeps warm leads moving. Are you mainly trying to lower your cost per lead or increase lead quality?";
  }

  if (normalized.includes("autom") || normalized.includes("workflow") || normalized.includes("follow-up")) {
    return "Automation is usually the fastest win when leads, bookings, or admin tasks are still being handled manually. We'd map the repetitive steps first, then connect the tools so follow-ups happen consistently without adding more work to your team. Which process feels the most repetitive at the moment?";
  }

  if (normalized.includes("ai") || normalized.includes("agent")) {
    return "AI agents are most useful when they solve one high-value bottleneck like missed calls, first-response speed, or repetitive customer questions. We'd normally shape the workflow around your business first, then decide where an AI layer makes the biggest difference. What job would you want the AI handling every day?";
  }

  return "We'd usually start by understanding how people find you today and where the biggest drop-off happens between interest and enquiry. From there, we can recommend the right mix of website, automation, AI, SEO, or lead gen support. What kind of business are you running at the moment?";
}

function RunningBorder({
  children,
  className,
  innerClassName,
  radius = "1.5rem",
  duration = "4s",
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

export function HeroChatPreview() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const historyRef = React.useRef<HTMLDivElement>(null);
  const timersRef = React.useRef<number[]>([]);

  const [chatState, setChatState] = React.useState<ChatState>("idle");
  const [activePill, setActivePill] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const typewriterText = useTypewriter(TYPEWRITER_PROMPTS, chatState === "idle");

  const userMessageCount = messages.filter(
    (message) => message.role === "user" && message.kind === "chat"
  ).length;

  const messagesRemaining =
    chatState === "active" && userMessageCount >= 3 && userMessageCount < 5
      ? 5 - userMessageCount
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

  const activateChat = React.useCallback(() => {
    setChatState((current) => (current === "idle" ? "active" : current));
  }, []);

  const handlePillClick = React.useCallback(
    (label: string, prompt: string) => {
      setActivePill(label);
      setInputValue(prompt);
      setEmailError(null);
      activateChat();
      queueTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    },
    [activateChat, queueTimeout]
  );

  const handleSendMessage = React.useCallback(() => {
    const nextValue = inputValue.trim();
    if (!nextValue || isStreaming || chatState === "captured") {
      return;
    }

    if (chatState === "awaiting_email") {
      if (!EMAIL_REGEX.test(nextValue)) {
        setEmailError("That doesn't look like an email — try again?");
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

      streamAssistantMessage(EMAIL_CONFIRMATION_PROMPT, () => {
        setChatState("captured");
      });

      return;
    }

    activateChat();
    setEmailError(null);
    setActivePill(null);

    const nextUserCount = userMessageCount + 1;

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

    streamAssistantMessage(getMockAssistantResponse(nextValue), () => {
      if (nextUserCount < 5) {
        return;
      }

      setChatState("awaiting_email");
      streamAssistantMessage(EMAIL_CAPTURE_PROMPT);
    });
  }, [activateChat, chatState, inputValue, isStreaming, streamAssistantMessage, userMessageCount]);

  return (
    <section className="section-shell relative min-h-[100svh] bg-[color:var(--color-bg-dark)] pt-20 pb-14 sm:pt-22 sm:pb-18 md:pt-24 md:pb-20">
      <ParticleNetwork className="opacity-55" count={58} interactive={false} maxDistance={140} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.22),rgba(10,10,15,0.9))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto flex min-h-[calc(100svh-5.5rem)] max-w-4xl items-start md:min-h-[calc(100svh-6rem)]">
          <motion.div
            className="w-full space-y-6 text-center sm:space-y-7 md:space-y-8"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[color:var(--color-text-secondary)] sm:text-sm">
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
              <span>110+ Happy Clients</span>
              <span className="hidden text-[color:var(--color-border)] sm:inline">·</span>
              <span>
                <span className="text-[color:var(--color-text-primary)]">★★★★★</span> 5.0 on Google
              </span>
              <span className="hidden text-[color:var(--color-border)] sm:inline">·</span>
              <span className="inline-flex items-center gap-2">
                <span className="live-dot" />
                Live Now
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-semibold leading-[0.96] tracking-tight text-[color:var(--color-text-primary)] sm:text-5xl md:text-7xl">
                Build Smarter.
                <br />
                Grow Faster.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[color:var(--color-text-secondary)] sm:text-lg sm:leading-8 md:text-xl">
                Tell us what your business needs and we&apos;ll guide you toward the right website, automation, AI, or growth solution.
              </p>
            </div>

            <div className="mx-auto w-full max-w-2xl">
              <div className="hero-chat-preview__scrollbar mb-3 flex justify-start overflow-x-auto px-1 sm:mb-4 sm:justify-center">
                <div className="flex min-w-max gap-3 pb-2">
                  {SERVICE_PILLS.map((pill) => {
                    const isActive = activePill === pill.label;

                    return (
                      <button
                        key={pill.label}
                        type="button"
                      onClick={() => handlePillClick(pill.label, pill.prompt)}
                      className={cn(
                          "rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm",
                        isActive
                          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-[color:var(--color-text-accent)]"
                          : "border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-primary)]/50 hover:text-[color:var(--color-text-primary)]"
                        )}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <RunningBorder
                radius="1.5rem"
                className="shadow-[0_30px_90px_rgba(124,58,237,0.08)]"
                innerClassName="bg-[rgba(17,17,24,0.82)] p-3.5 backdrop-blur-2xl sm:p-4 md:p-6"
              >
                <div className="min-h-[280px] text-left sm:min-h-[320px]">
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
                          radius="1rem"
                          className="mb-5"
                          innerClassName="min-h-[96px] bg-[rgba(10,10,15,0.72)] px-4 py-5 sm:min-h-[112px] sm:px-5 sm:py-6"
                        >
                          <div className="flex min-h-[54px] items-center text-base italic text-[color:var(--color-text-secondary)] sm:min-h-[64px] sm:text-lg">
                            <span>{typewriterText}</span>
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
                        className="mb-5 max-h-[260px] space-y-3 overflow-y-auto pr-1 sm:max-h-[300px]"
                      >
                        {messages.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 px-4 py-5 text-xs text-[color:var(--color-text-secondary)] sm:text-sm">
                            Start typing below or use one of the service pills to prefill the first message.
                          </div>
                        ) : null}

                        {messages.map((message) =>
                          message.role === "user" ? (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[color:var(--color-primary)]/15 px-4 py-3 text-sm text-[color:var(--color-text-primary)] sm:max-w-[80%]"
                            >
                              {message.text}
                            </motion.div>
                          ) : (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="max-w-[88%] rounded-2xl rounded-bl-md bg-[color:var(--color-bg-elevated)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] sm:max-w-[80%]"
                            >
                              <span className="mr-2 inline-flex rounded bg-[color:var(--color-primary)]/20 px-1.5 py-0.5 font-mono text-xs text-[color:var(--color-text-accent)]">
                                EZ
                              </span>
                              {message.text}
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {chatState === "captured" ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-xs font-medium text-emerald-200 sm:text-sm">
                      <CheckCheck className="h-4 w-4" />
                      Recommendation on its way
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
                            const nextInputValue = event.target.value;
                            const selectedPrompt = SERVICE_PILLS.find(
                              (pill) => pill.label === activePill
                            )?.prompt;

                            activateChat();
                            setInputValue(nextInputValue);
                            setEmailError(null);

                            if (activePill && nextInputValue !== selectedPrompt) {
                              setActivePill(null);
                            }
                          }}
                          placeholder={
                            chatState === "awaiting_email"
                              ? "Your email address..."
                              : "Tell us about your business..."
                          }
                          disabled={isStreaming}
                          className="min-h-14 rounded-2xl border border-white/10 bg-[rgba(10,10,15,0.84)] px-4 text-base text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-secondary)]/80 outline-none transition focus:border-[color:var(--color-primary)]/60"
                        />

                        <Button
                          type="submit"
                          size="md"
                          className="min-h-14 w-full min-w-[132px] gap-2 sm:w-auto"
                          disabled={isStreaming || inputValue.trim().length === 0}
                        >
                          {chatState === "awaiting_email" ? "Send" : "Send"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>

                      {emailError ? (
                        <p className="mt-3 text-sm text-rose-300">{emailError}</p>
                      ) : null}

                      {messagesRemaining ? (
                        <p className="mt-3 text-center text-xs text-[color:var(--color-text-secondary)]">
                          {messagesRemaining} message{messagesRemaining === 1 ? "" : "s"} remaining
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

      <style jsx global>{`
        .hero-chat-preview__scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hero-chat-preview__scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hero-chat-preview__cursor {
          display: inline-block;
          height: 1.15em;
          width: 0.65ch;
          border-right: 2px solid rgba(124, 58, 237, 0.95);
          animation: hero-chat-preview-cursor 1s step-end infinite;
        }

        .hero-chat-preview__running-border {
          position: relative;
          overflow: hidden;
          border-radius: var(--hero-border-radius, 1.5rem);
          padding: 1px;
          background: rgba(124, 58, 237, 0.12);
          box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.18);
        }

        .hero-chat-preview__running-border::before {
          content: "";
          position: absolute;
          inset: -140%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(124, 58, 237, 0.96) 72deg,
            rgba(167, 139, 250, 0.98) 160deg,
            rgba(124, 58, 237, 0.96) 240deg,
            transparent 320deg,
            transparent 360deg
          );
          animation: hero-chat-preview-spin var(--hero-spin-duration, 4s) linear infinite;
        }

        .hero-chat-preview__running-border-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: calc(var(--hero-border-radius, 1.5rem) - 1px);
        }

        @keyframes hero-chat-preview-spin {
          to {
            transform: rotate(1turn);
          }
        }

        @keyframes hero-chat-preview-cursor {
          0%,
          50% {
            border-color: rgba(124, 58, 237, 0.95);
          }

          51%,
          100% {
            border-color: transparent;
          }
        }
      `}</style>
    </section>
  );
}
