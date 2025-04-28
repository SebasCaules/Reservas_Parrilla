import { SiteHeader } from "@/components/layout/site-header"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"
import { getAllReservations } from "@/lib/actions/reservation-actions"

export default async function CalendarPage() {
  const reservations = await getAllReservations()

  return (
    <div className="flex min-h-screen flex-col w-full mx-2 md:mx-4">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Calendario de Reservas de Parrilla</h1>
        <ReservationCalendar reservations={reservations} />
      </main>
    </div>
  )
}
