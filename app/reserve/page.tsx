import { ReservationForm } from "@/components/reservations/reservation-form"
import { getAllReservations } from "@/lib/actions/reservation-actions"
import { AnimatedLayout } from "@/components/layout/animated-layout"
import { unstable_noStore } from "next/cache"

// Desactivar completamente la caché para esta página
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function ReservePage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  // Desactivar explícitamente el almacenamiento en caché
  unstable_noStore()

  try {
    // Usar el servicio optimizado
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
  } catch (error) {
    console.error("Error en la página de reserva:", error)

    // Mostrar un mensaje de error amigable
    return (
      <AnimatedLayout>
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Reservar la Parrilla</h1>
          <div className="text-center py-10">
            <p className="text-xl mb-4">No se pudieron cargar los datos necesarios</p>
            <p>Por favor, intenta recargar la página o vuelve más tarde.</p>
          </div>
        </main>
      </AnimatedLayout>
    )
  }
}
