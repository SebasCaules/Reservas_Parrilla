"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AutoRefreshProps {
  interval?: number // Intervalo en segundos
}

export function AutoRefresh({ interval = 30 }: AutoRefreshProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(interval)

  useEffect(() => {
    // Actualizar el contador cada segundo
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Cuando llega a 0, refrescar la página y reiniciar el contador
          router.refresh()
          return interval
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, interval])

  return <div className="text-xs text-gray-400 mt-1">Actualización automática en {timeLeft} segundos</div>
}
