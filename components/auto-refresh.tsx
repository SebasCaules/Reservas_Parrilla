"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AutoRefreshProps {
  interval?: number // Intervalo en segundos
  onlyWhenVisible?: boolean // Solo actualizar cuando la página está visible
}

export function AutoRefresh({ interval = 60, onlyWhenVisible = true }: AutoRefreshProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(interval)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Detectar cuando la página está visible/oculta
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Actualizar el contador cada segundo
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Si la página está oculta y onlyWhenVisible es true, no actualizar
        if (document.hidden && onlyWhenVisible) {
          return prev
        }

        if (prev <= 1) {
          // Cuando llega a 0, refrescar la página y reiniciar el contador
          router.refresh()
          return interval
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [router, interval, onlyWhenVisible])

  // No mostrar nada si la página está oculta y onlyWhenVisible es true
  if (!isVisible && onlyWhenVisible) {
    return null
  }

  return <div className="text-xs text-gray-400 mt-1">Actualización automática en {timeLeft} segundos</div>
}
