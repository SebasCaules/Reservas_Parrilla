import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationForm } from "@/components/reservations/reservation-form"

export default async function EditReservationPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  // Obtener la reserva
  const { data: reservation } = await supabase.from("reservations").select("*").eq("id", params.id).single()

  if (!reservation) {
    notFound()
  }

  // Obtener todas las reservas para verificar disponibilidad
  const { data: reservations } = await supabase.from("reservations").select("*")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-lg py-8">
        <h1 className="text-3xl font-bold mb-8">Editar Reserva</h1>
        <ReservationForm existingReservations={reservations || []} initialData={reservation} />
      </main>
    </div>
  )
}
