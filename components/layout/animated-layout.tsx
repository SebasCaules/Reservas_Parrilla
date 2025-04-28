"use client"

import type { ReactNode } from "react"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "./page-transition"
import { SiteHeader } from "./site-header"

interface AnimatedLayoutProps {
  children: ReactNode
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col w-full mx-2 md:mx-4">
      <SiteHeader />
      <AnimatePresence mode="wait">
        <PageTransition>
          <main className="flex-1 w-full">{children}</main>
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
