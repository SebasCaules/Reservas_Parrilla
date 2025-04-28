"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedListProps {
  children: ReactNode[]
  staggerDelay?: number
}

export function AnimatedList({ children, staggerDelay = 0.1 }: AnimatedListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {children.map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
