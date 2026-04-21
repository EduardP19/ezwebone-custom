"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { updateTrackingConsent } from "@/lib/consent";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function Clarity() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAcceptedForClarity, setIsAcceptedForClarity] = useState(false);
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";
  const pageKey = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      updateTrackingConsent("accepted");
      setIsAcceptedForClarity(true);
      window.clarity?.("consent");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [pageKey]);

  if (!projectId || !isAcceptedForClarity) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
