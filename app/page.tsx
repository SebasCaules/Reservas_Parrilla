"use client"

import { getAllReservations } from "@/lib/actions/reservation-actions"
import { addDays } from "date-fns"
import { HomeContent } from "@/components/home/home-content"
import { AnimatedLayout } from "@/components/layout/animated-layout"

export default async function Home() {
  const today = new Date()
  const tenDaysLater = addDays(today, 10)

  // Obtener todas las reservas
  const allReservations = await getAllReservations()

  // Filtrar reservas para los próximos 10 días
  const upcomingReservations = allReservations
    .filter((reservation) => {
      const reservationDate = new Date(reservation.start_time)
      return reservationDate >= today && reservationDate <= tenDaysLater
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  return (
    <AnimatedLayout>
      <HomeContent upcomingReservations={upcomingReservations} today={today} />
    </AnimatedLayout>
  )
}
