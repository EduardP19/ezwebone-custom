export type ConsoleLevel = "log" | "warn" | "error";

function serializeValue(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  const valueType = typeof value;

  if (valueType === "string" || valueType === "number" || valueType === "boolean") {
    return value;
  }

  if (valueType === "bigint" || valueType === "symbol") {
    return String(value);
  }

  if (valueType === "function") {
    const maybeNamedFunction = value as { name?: string };
    const name = maybeNamedFunction.name;
    return name ? `[Function ${name}]` : "[Function]";
  }

  if (!(value instanceof Object)) {
    return String(value);
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof URL) {
    return value.toString();
  }

  if (depth <= 0) {
    return "[Max depth reached]";
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((entry) => serializeValue(entry, seen, depth - 1));
  }

  const record: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    record[key] = serializeValue(entry, seen, depth - 1);
  }

  return record;
}

export function serializeConsoleArgs(args: unknown[]): unknown[] {
  const seen = new WeakSet<object>();
  return args.map((value) => serializeValue(value, seen, 4));
}

export function buildConsoleMessage(args: unknown[]): string {
  const serializedArgs = serializeConsoleArgs(args);
  const message = serializedArgs
    .map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry)))
    .join(" ")
    .trim();

  return message.slice(0, 4_000);
}
