"use client";

import { Logger, ProxyTransport } from "@axiomhq/logging";
import { createWebVitalsComponent, createUseLogger } from "@axiomhq/react";

export const logger = new Logger({
  transports: [
    new ProxyTransport({
      url: "/api/axiom",
      autoFlush: true,
    }),
  ],
});

export const useLogger = createUseLogger(logger);
export const WebVitals = createWebVitalsComponent(logger);
