"use client";

import { FormEvent, useMemo, useState } from "react";

type ImportResponse = {
  runId: string;
  totalHits: number;
  companiesFetched: number;
  activeProcessed: number;
  pscOk: number;
  pscFailed: number;
  roUpserted: number;
  nonRoUpserted: number;
  roSample: Array<{
    company_number: string;
    company_name: string;
    director_full_name: string;
    nationality_raw: string;
  }>;
  nonRoSample: Array<{
    company_number: string;
    company_name: string;
    director_full_name: string;
    nationality_raw: string;
    nationality_normalized: string;
  }>;
  error?: string;
};

function defaultFromDate() {
  const now = new Date();
  now.setDate(now.getDate() - 2);
  return now.toISOString().slice(0, 10);
}

function defaultToDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function CompaniesHouseDevPage() {
  const [incorporatedFrom, setIncorporatedFrom] = useState(defaultFromDate());
  const [incorporatedTo, setIncorporatedTo] = useState(defaultToDate());
  const [sicCode, setSicCode] = useState("");
  const [size, setSize] = useState("micro-entity");
  const [maxCompanies, setMaxCompanies] = useState("250");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);

  const summary = useMemo(() => {
    if (!result) return null;
    return [
      { label: "Run ID", value: result.runId },
      { label: "Total Hits", value: String(result.totalHits) },
      { label: "Companies Fetched", value: String(result.companiesFetched) },
      { label: "Active Processed", value: String(result.activeProcessed) },
      { label: "PSC OK", value: String(result.pscOk) },
      { label: "PSC Failed", value: String(result.pscFailed) },
      { label: "Non-RO Upserted", value: String(result.nonRoUpserted) },
      { label: "RO Upserted", value: String(result.roUpserted) },
    ];
  }, [result]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/dev/companies-house/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incorporatedFrom,
          incorporatedTo,
          sicCode,
          size,
          maxCompanies: Number(maxCompanies),
        }),
      });

      const data = (await response.json()) as ImportResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to run import.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run import.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          Companies House Import (Dev)
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Pull new companies, enrich via PSC nationality, then split into non-RO and RO tables.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Incorporated From
            </span>
            <input
              type="date"
              value={incorporatedFrom}
              onChange={(event) => setIncorporatedFrom(event.target.value)}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Incorporated To
            </span>
            <input
              type="date"
              value={incorporatedTo}
              onChange={(event) => setIncorporatedTo(event.target.value)}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              SIC Code
            </span>
            <input
              type="text"
              value={sicCode}
              onChange={(event) => setSicCode(event.target.value)}
              placeholder="e.g. 96020"
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Size
            </span>
            <input
              type="text"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              placeholder="micro-entity"
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)]">
              Max Companies
            </span>
            <input
              type="number"
              min={1}
              max={10000}
              value={maxCompanies}
              onChange={(event) => setMaxCompanies(event.target.value)}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]"
            />
          </label>

          <div className="md:col-span-2 xl:col-span-5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Running import..." : "Fetch + split + save"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      {summary ? (
        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-4"
            >
              <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-secondary)]">
                {item.label}
              </p>
              <p className="mt-2 text-base font-semibold text-[color:var(--color-text-primary)] break-words">
                {item.value}
              </p>
            </article>
          ))}
        </section>
      ) : null}

      {result ? (
        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]">
            <header className="border-b border-[color:var(--color-border)] px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-text-primary)]">
                Non-RO Sample
              </h2>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[color:var(--color-text-secondary)]">
                    <th className="px-4 py-2">Company #</th>
                    <th className="px-4 py-2">Director</th>
                    <th className="px-4 py-2">Raw</th>
                    <th className="px-4 py-2">Normalized</th>
                  </tr>
                </thead>
                <tbody>
                  {result.nonRoSample.map((row, index) => (
                    <tr key={`${row.company_number}-${index}`} className="border-t border-[color:var(--color-border)]">
                      <td className="px-4 py-2">{row.company_number}</td>
                      <td className="px-4 py-2">{row.director_full_name}</td>
                      <td className="px-4 py-2">{row.nationality_raw}</td>
                      <td className="px-4 py-2">{row.nationality_normalized}</td>
                    </tr>
                  ))}
                  {result.nonRoSample.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-[color:var(--color-text-secondary)]">
                        No rows returned for non-RO sample.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]">
            <header className="border-b border-[color:var(--color-border)] px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-text-primary)]">
                RO Sample
              </h2>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[color:var(--color-text-secondary)]">
                    <th className="px-4 py-2">Company #</th>
                    <th className="px-4 py-2">Director</th>
                    <th className="px-4 py-2">Raw</th>
                  </tr>
                </thead>
                <tbody>
                  {result.roSample.map((row, index) => (
                    <tr key={`${row.company_number}-${index}`} className="border-t border-[color:var(--color-border)]">
                      <td className="px-4 py-2">{row.company_number}</td>
                      <td className="px-4 py-2">{row.director_full_name}</td>
                      <td className="px-4 py-2">{row.nationality_raw}</td>
                    </tr>
                  ))}
                  {result.roSample.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-[color:var(--color-text-secondary)]">
                        No rows returned for RO sample.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}
