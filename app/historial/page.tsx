import { HistorialList } from "@/components/historial/historial-list"
import { getAllReservations } from "@/lib/actions/reservation-actions"
import { AnimatedLayout } from "@/components/layout/animated-layout"

// Configuración de caché para asegurar datos frescos
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HistorialPage() {
  const reservations = await getAllReservations()

  return (
    <AnimatedLayout>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Historial de Reservas</h1>
        <HistorialList reservations={reservations} />
      </main>
    </AnimatedLayout>
  )
}
