import { AxiomJSTransport, ConsoleTransport, Logger, type Transport } from "@axiomhq/logging";
import { createAxiomRouteHandler, nextJsFormatters } from "@axiomhq/nextjs";
import { axiomClient, getAxiomDataset } from "@/lib/axiom/axiom";

const transports: [Transport, ...Transport[]] =
  axiomClient === null
    ? [new ConsoleTransport({ prettyPrint: process.env.NODE_ENV !== "production" })]
    : [
        new AxiomJSTransport({
          axiom: axiomClient,
          dataset: getAxiomDataset(),
        }),
      ];

export const logger = new Logger({
  transports,
  formatters: nextJsFormatters,
});

export const withAxiom = createAxiomRouteHandler(logger);
