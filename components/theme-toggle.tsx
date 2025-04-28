"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkMode = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      {isDarkMode ? <Moon className="h-4 w-4 text-slate-300" /> : <Sun className="h-4 w-4 text-amber-500" />}
      <span className="text-sm hidden sm:inline-block">{isDarkMode ? "Modo Oscuro" : "Modo Claro"}</span>
      <Switch
        checked={isDarkMode}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Cambiar tema"
      />
    </div>
  )
}
