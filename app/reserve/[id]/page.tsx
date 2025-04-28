import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationForm } from "@/components/reservations/reservation-form"
import { getAllReservations, getReservationById } from "@/lib/actions/reservation-actions"

export default async function EditReservationPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const reservation = await getReservationById(params.id)
    const reservations = await getAllReservations()

    return (
      <div className="flex min-h-screen flex-col w-full mx-2 md:mx-4">
        <SiteHeader />
        <main className="flex-1 container max-w-lg py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Editar Reserva</h1>
          <ReservationForm existingReservations={reservations} initialData={reservation} />
        </main>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
