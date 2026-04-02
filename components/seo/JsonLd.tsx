import Script from "next/script";

interface JsonLdProps {
  data: unknown;
  id?: string;
}

export function JsonLd({ data, id = "structured-data" }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
