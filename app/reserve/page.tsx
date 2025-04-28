import { ReservationForm } from "@/components/reservations/reservation-form"
import { getRealTimeReservations } from "@/lib/services/real-time-service"
import { AnimatedLayout } from "@/components/layout/animated-layout"

// Desactivar completamente la caché para esta página
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function ReservePage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  // Usar el nuevo servicio en tiempo real
  const reservations = await getRealTimeReservations()
  const initialDate = searchParams?.date

  return (
    <AnimatedLayout>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Reservar la Parrilla</h1>
        <ReservationForm existingReservations={reservations} initialDate={initialDate} />
      </main>
    </AnimatedLayout>
  )
}
