"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AnimatedLayout({ children }: { children: ReactNode }) {
  usePathname(); // keep for future use
  return <>{children}</>;
}
