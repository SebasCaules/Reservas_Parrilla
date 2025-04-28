"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { checkConnection } from "@/lib/actions/reservation-actions"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading")
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const isConnected = await checkConnection()
      setStatus(isConnected ? "connected" : "disconnected")
    } catch (error) {
      console.error("Error al verificar la conexión:", error)
      setStatus("disconnected")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "loading" || isChecking ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />
          <span>Verificando conexión...</span>
        </>
      ) : status === "connected" ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Conectado a la base de datos</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <span>Sin conexión a la base de datos</span>
        </>
      )}

      <Button variant="ghost" size="sm" className="ml-2 h-7 px-2" onClick={checkStatus} disabled={isChecking}>
        <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
