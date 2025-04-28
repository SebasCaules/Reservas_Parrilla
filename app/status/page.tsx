import { ConnectionStatus } from "@/components/connection-status"
import { AnimatedLayout } from "@/components/layout/animated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatusPage() {
  return (
    <AnimatedLayout>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Estado del Sistema</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Estado de la Conexión</CardTitle>
            <CardDescription>Verifica si la aplicación puede conectarse a la base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectionStatus />
          </CardContent>
        </Card>
      </main>
    </AnimatedLayout>
  )
}
