import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationForm } from "@/components/reservations/reservation-form"

// Actualizar la definición de la función para recibir searchParams
export default async function ReservePage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Obtener todas las reservas para verificar disponibilidad
  const { data: reservations } = await supabase.from("reservations").select("*")

  // Obtener la fecha de los parámetros de búsqueda
  const initialDate = searchParams?.date

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-lg py-8">
        <h1 className="text-3xl font-bold mb-8">Reservar la Parrilla</h1>
        <ReservationForm existingReservations={reservations || []} initialDate={initialDate} />
      </main>
    </div>
  )
}
