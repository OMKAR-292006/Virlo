"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import TransitionWrapper from "./TransitionWrapper";
import { ReactNode } from "react";

export default function AnimatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <TransitionWrapper key={pathname}>{children}</TransitionWrapper>
    </AnimatePresence>
  );
}
