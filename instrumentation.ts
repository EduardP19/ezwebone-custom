import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";
import { createOnRequestError } from "@axiomhq/nextjs";
import { logger } from "@/lib/axiom/server";
import { buildConsoleMessage, serializeConsoleArgs } from "@/lib/observability/console";

declare global {
  var __axiomServerConsolePatched: boolean | undefined;
}

function runtimeName(): "nodejs" | "edge" {
  return process.env.NEXT_RUNTIME === "edge" ? "edge" : "nodejs";
}

function patchServerConsole() {
  if (globalThis.__axiomServerConsolePatched) {
    return;
  }
  globalThis.__axiomServerConsolePatched = true;

  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  console.log = (...args: unknown[]) => {
    originalLog(...args);
    logger.info(buildConsoleMessage(args), {
      args: serializeConsoleArgs(args),
      source: "server_console",
      runtime: runtimeName(),
    });
  };

  console.warn = (...args: unknown[]) => {
    originalWarn(...args);
    logger.warn(buildConsoleMessage(args), {
      args: serializeConsoleArgs(args),
      source: "server_console",
      runtime: runtimeName(),
    });
  };

  console.error = (...args: unknown[]) => {
    originalError(...args);
    logger.error(buildConsoleMessage(args), {
      args: serializeConsoleArgs(args),
      source: "server_console",
      runtime: runtimeName(),
    });
  };
}

export async function register() {
  patchServerConsole();

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

const axiomOnRequestError = createOnRequestError(logger);

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  await Promise.resolve(Sentry.captureRequestError(...args));
  await axiomOnRequestError(...args);
};
