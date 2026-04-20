import Link from "next/link";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizePath } from "@/lib/i18n/config";

export default async function NotFoundPage() {
  const locale = await getRequestLocale();
  const isRo = locale === "ro";

  return (
    <main className="section-shell relative overflow-hidden bg-[#ede7fb]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(28,42,68,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(6,182,212,0.10),transparent_42%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-140px)] max-w-6xl items-center justify-center px-4 py-14 md:px-6">
        <div className="w-full max-w-5xl text-center">
          <div className="relative mx-auto mb-10 flex items-center justify-center">
            <span className="text-[8.5rem] font-semibold leading-none tracking-[-0.04em] text-[#1C2A44] sm:text-[10.5rem] md:text-[14rem]">
              4
            </span>
            <div className="relative mx-[-0.2rem] sm:mx-[-0.4rem]">
              <div className="h-[10.5rem] w-[10.5rem] rounded-full bg-[#1C2A44] sm:h-[13rem] sm:w-[13rem] md:h-[16rem] md:w-[16rem]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[7.4rem] w-[7.4rem] rounded-full border-4 border-white/80 bg-[#F5F2ED]/10 sm:h-[9rem] sm:w-[9rem] md:h-[11rem] md:w-[11rem]">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] text-[3rem] sm:text-[3.7rem] md:text-[4.4rem]">
                    👨‍🚀
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[8.5rem] font-semibold leading-none tracking-[-0.04em] text-[#1C2A44] sm:text-[10.5rem] md:text-[14rem]">
              4
            </span>
          </div>

          <p className="mx-auto max-w-xl text-lg font-medium leading-8 text-[#1C2A44]/90 sm:text-xl">
            {isRo
              ? "Pagina cautata nu este disponibila acum. Ne pare rau pentru inconvenient."
              : "This page isn't available. Sorry about that. Try going back to the homepage."}
          </p>

          <div className="mt-8">
            <Link
              href={localizePath(locale, "/")}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#f97316] px-8 text-base font-semibold text-white shadow-[0_14px_34px_rgba(249,115,22,0.32)] transition hover:bg-[#fb923c]"
            >
              {isRo ? "Inapoi Acasa" : "Return Home"}
            </Link>
          </div>

          <p className="mt-5 text-sm text-[#1C2A44]/65">
            EZWebOne · 404
          </p>
        </div>
      </div>
    </main>
  );
}
