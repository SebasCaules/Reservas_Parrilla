import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"

export default async function CalendarPage() {
  const supabase = createServerSupabaseClient()

  // Obtener todas las reservas
  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .order("start_time", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Calendario de Reservas de Parrilla</h1>
        <ReservationCalendar reservations={reservations || []} />
      </main>
    </div>
  )
}
