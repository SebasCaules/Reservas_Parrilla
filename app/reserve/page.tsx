import { SiteHeader } from "@/components/layout/site-header"
import { ReservationForm } from "@/components/reservations/reservation-form"
import { getAllReservations } from "@/lib/actions/reservation-actions"

export default async function ReservePage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  const reservations = await getAllReservations()
  const initialDate = searchParams?.date

  return (
    <div className="flex min-h-screen flex-col w-full">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Reservar la Parrilla</h1>
        <ReservationForm existingReservations={reservations} initialDate={initialDate} />
      </main>
    </div>
  )
}
