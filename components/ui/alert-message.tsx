import type React from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertMessageProps {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: "warning" | "error" | "info" | "success"
  className?: string
}

export function AlertMessage({
  children,
  icon = <AlertTriangle className="h-5 w-5" />,
  variant = "warning",
  className,
}: AlertMessageProps) {
  const variantStyles = {
    warning: {
      container: "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800",
      icon: "bg-amber-100 dark:bg-amber-800/30",
      text: "text-amber-700 dark:text-amber-400",
    },
    error: {
      container: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
      icon: "bg-red-100 dark:bg-red-800/30",
      text: "text-red-700 dark:text-red-400",
    },
    info: {
      container: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
      icon: "bg-blue-100 dark:bg-blue-800/30",
      text: "text-blue-700 dark:text-blue-400",
    },
    success: {
      container: "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800",
      icon: "bg-green-100 dark:bg-green-800/30",
      text: "text-green-700 dark:text-green-400",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        "flex items-stretch text-sm border rounded-md overflow-hidden",
        styles.container,
        styles.text,
        className,
      )}
    >
      <div className={cn("flex items-center px-3", styles.icon)}>{icon}</div>
      <div className="p-3">{children}</div>
    </div>
  )
}
