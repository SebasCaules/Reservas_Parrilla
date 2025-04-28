import { getUpcomingReservations } from "@/lib/actions/reservation-actions"
import { HomeContent } from "@/components/home/home-content"
import { AnimatedLayout } from "@/components/layout/animated-layout"
import { unstable_noStore } from "next/cache"

// Desactivar completamente la caché para esta página
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function Home() {
  // Desactivar explícitamente el almacenamiento en caché
  unstable_noStore()

  try {
    // Usar el servicio optimizado
    const upcomingReservations = await getUpcomingReservations(10)
    const today = new Date()

    return (
      <AnimatedLayout>
        <HomeContent upcomingReservations={upcomingReservations} today={today} />
      </AnimatedLayout>
    )
  } catch (error) {
    console.error("Error en la página principal:", error)

    // Mostrar un mensaje de error amigable
    return (
      <AnimatedLayout>
        <div className="container py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">No se pudieron cargar los datos</h1>
          <p>Por favor, intenta recargar la página o vuelve más tarde.</p>
        </div>
      </AnimatedLayout>
    )
  }
}
