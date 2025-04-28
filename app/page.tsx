import { getUpcomingRealTimeReservations } from "@/lib/services/real-time-service"
import { HomeContent } from "@/components/home/home-content"
import { AnimatedLayout } from "@/components/layout/animated-layout"
import { unstable_noStore } from "next/cache"

// Desactivar completamente la caché para esta página
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function Home() {
  // Desactivar explícitamente el almacenamiento en caché
  unstable_noStore()

  // Usar el nuevo servicio en tiempo real
  const upcomingReservations = await getUpcomingRealTimeReservations(10)
  const today = new Date()

  return (
    <AnimatedLayout>
      <HomeContent upcomingReservations={upcomingReservations} today={today} />
    </AnimatedLayout>
  )
}
