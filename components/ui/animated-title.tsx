"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedTitleProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedTitle({ children, className, delay = 0 }: AnimatedTitleProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={cn("text-3xl font-bold", className)}
    >
      {children}
    </motion.h1>
  )
}
