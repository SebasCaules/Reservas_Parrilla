"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

export function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Forzar una actualización completa
    // 1. Limpiar la caché del router
    router.refresh()

    // 2. Recargar la página completamente para evitar cualquier caché
    window.location.reload()

    // No necesitamos resetear isRefreshing ya que la página se recargará
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-1"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Actualizando..." : "Actualizar datos"}
    </Button>
  )
}
