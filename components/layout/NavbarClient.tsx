"use client";

import dynamic from "next/dynamic";

const NavbarNoSsr = dynamic(
  () => import("@/components/layout/Navbar").then((mod) => mod.Navbar),
  { ssr: false }
);

export function NavbarClient() {
  return <NavbarNoSsr />;
}
