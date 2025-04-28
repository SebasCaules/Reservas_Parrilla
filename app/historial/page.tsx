import { SiteHeader } from "@/components/layout/site-header"
import { HistorialList } from "@/components/historial/historial-list"
import { getAllReservations } from "@/lib/actions/reservation-actions"

export default async function HistorialPage() {
  const reservations = await getAllReservations()

  return (
    <div className="flex min-h-screen flex-col w-full">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Historial de Reservas</h1>
        <HistorialList reservations={reservations} />
      </main>
    </div>
  )
}
