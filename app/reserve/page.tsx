import { ReservationForm } from "@/components/reservations/reservation-form"
import { getAllReservations } from "@/lib/actions/reservation-actions"
import { AnimatedLayout } from "@/components/layout/animated-layout"

export default async function ReservePage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  const reservations = await getAllReservations()
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
