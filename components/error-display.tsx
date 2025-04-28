"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorDisplayProps {
  title?: string
  message: string
}

export function ErrorDisplay({ title = "Error", message }: ErrorDisplayProps) {
  const router = useRouter()

  const handleRefresh = () => {
    router.refresh()
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Se ha producido un error en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/10">
            <p className="text-sm text-red-800 dark:text-red-300">{message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
          <p className="text-xs text-center text-gray-500">
            Si el problema persiste, contacta al administrador del sistema para verificar la configuración de las
            variables de entorno.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
