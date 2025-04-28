import { ReservationCalendar } from "@/components/reservations/reservation-calendar"
import { getAllReservations } from "@/lib/actions/reservation-actions"
import { AnimatedLayout } from "@/components/layout/animated-layout"

// Configuración de caché para asegurar datos frescos
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CalendarPage() {
  const reservations = await getAllReservations()

  return (
    <AnimatedLayout>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Calendario de Reservas de Parrilla</h1>
        <ReservationCalendar reservations={reservations} />
      </main>
    </AnimatedLayout>
  )
}
