"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function AnimatedCard({ children, className, delay = 0, duration = 0.5 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className={cn(className)}>{children}</Card>
    </motion.div>
  )
}
