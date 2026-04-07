import { Badge } from "@/components/ui/Badge";

interface LegalPageShellProps {
  badge: string;
  title: string;
  intro: string;
  updatedOn: string;
  updatedLabel?: string;
  children: React.ReactNode;
}

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageShell({
  badge,
  title,
  intro,
  updatedOn,
  updatedLabel = "Last updated",
  children,
}: LegalPageShellProps) {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <Badge className="mb-5">{badge}</Badge>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray">
          <span>{updatedLabel}</span>
          <span className="h-1 w-1 rounded-full bg-brand-gray/40" />
          <span>{updatedOn}</span>
        </div>
        <h1 className="mb-6 text-4xl font-display font-semibold text-brand-black md:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-brand-gray">{intro}</p>

        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-display font-semibold text-brand-black">{title}</h2>
      <div className="space-y-4 leading-8 text-brand-gray">{children}</div>
    </section>
  );
}
