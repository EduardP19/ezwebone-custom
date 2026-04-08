"use client";

import { FormEvent, useState } from "react";

type PreviewResult = {
  ok?: boolean;
  error?: string;
  source?: "ro" | "non_ro";
  sourceTable?: string;
  sourceRowId?: string;
  companyNumber?: string;
  templateId?: number;
  response?: {
    data?: {
      id?: string;
      pdf?: string;
      status?: string;
      cost?: number;
    };
  };
  payload?: {
    recipient?: Record<string, unknown>;
    tags?: string;
    template?: number;
    test?: boolean;
  };
};

export default function StannpPreviewPage() {
  const [companyNumber, setCompanyNumber] = useState("");
  const [source, setSource] = useState<"non_ro" | "ro">("non_ro");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PreviewResult | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/stannp/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyNumber,
          source,
          templateId: templateId.trim() ? Number(templateId) : undefined,
        }),
      });

      const data = (await response.json()) as PreviewResult;
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate preview.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate preview.");
    } finally {
      setLoading(false);
    }
  }

  const pdfLink = result?.response?.data?.pdf ?? "";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          Stannp Test Preview
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Send one company row to Stannp in test mode and inspect the generated PDF.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Company Number
            </span>
            <input
              type="text"
              value={companyNumber}
              onChange={(event) => setCompanyNumber(event.target.value)}
              placeholder="e.g. 12345678"
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Nationality Bucket
            </span>
            <select
              value={source}
              onChange={(event) => setSource(event.target.value === "ro" ? "ro" : "non_ro")}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
            >
              <option value="non_ro">Non-RO</option>
              <option value="ro">RO</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Template ID (optional)
            </span>
            <input
              type="number"
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              placeholder="Uses STANNP_TEMPLATE_ID when empty"
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Test PDF"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-4">
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Source: <span className="font-semibold text-[color:var(--color-text-primary)]">{result.sourceTable}</span>
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              Row ID: <span className="font-semibold text-[color:var(--color-text-primary)]">{result.sourceRowId}</span>
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              Stannp Letter ID:{" "}
              <span className="font-semibold text-[color:var(--color-text-primary)]">
                {result.response?.data?.id ?? "N/A"}
              </span>
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              Status:{" "}
              <span className="font-semibold text-[color:var(--color-text-primary)]">
                {result.response?.data?.status ?? "N/A"}
              </span>
            </p>
            {pdfLink ? (
              <a
                href={pdfLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-elevated)]"
              >
                Open Generated PDF
              </a>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
