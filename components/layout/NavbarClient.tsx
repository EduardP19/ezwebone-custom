"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const NavbarNoSsr = dynamic(
  () => import("@/components/layout/Navbar").then((mod) => mod.Navbar),
  { ssr: false }
);

export function NavbarClient() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/hf") ||
    pathname?.startsWith("/ro/hf") ||
    pathname?.startsWith("/bt") ||
    pathname?.startsWith("/ro/bt")
  ) {
    return null;
  }
  return <NavbarNoSsr />;
}
