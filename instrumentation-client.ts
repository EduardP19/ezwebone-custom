// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/axiom/client";
import { buildConsoleMessage, serializeConsoleArgs, type ConsoleLevel } from "@/lib/observability/console";

declare global {
  interface Window {
    __axiomConsolePatched?: boolean;
  }
}

function forwardClientConsole(level: ConsoleLevel, args: unknown[]) {
  const fields = {
    args: serializeConsoleArgs(args),
    source: "client_console",
    runtime: "browser",
    pathname: window.location.pathname,
    url: window.location.href,
  };
  const message = buildConsoleMessage(args);

  if (level === "error") {
    logger.error(message, fields);
    return;
  }
  if (level === "warn") {
    logger.warn(message, fields);
    return;
  }
  logger.info(message, fields);
}

function patchClientConsole() {
  if (window.__axiomConsolePatched) {
    return;
  }
  window.__axiomConsolePatched = true;

  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  console.log = (...args: unknown[]) => {
    originalLog(...args);
    forwardClientConsole("log", args);
  };

  console.warn = (...args: unknown[]) => {
    originalWarn(...args);
    forwardClientConsole("warn", args);
  };

  console.error = (...args: unknown[]) => {
    originalError(...args);
    forwardClientConsole("error", args);
  };
}

Sentry.init({
  dsn: "https://e5f26b7b15c859f2768399a028a1ab33@o4511249334534144.ingest.de.sentry.io/4511249336827984",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

try {
  patchClientConsole();
} catch {}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
