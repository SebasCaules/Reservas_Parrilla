import { getAllReservations } from "@/lib/actions/reservation-actions"
import { addDays } from "date-fns"
import { HomeContent } from "@/components/home/home-content"
import { AnimatedLayout } from "@/components/layout/animated-layout"

// This is now a Server Component (no "use client" directive)
export default async function Home() {
  const today = new Date()
  const tenDaysLater = addDays(today, 10)

  // Fetch data on the server
  const allReservations = await getAllReservations()

  // Filter reservations for the next 10 days
  const upcomingReservations = allReservations
    .filter((reservation) => {
      const reservationDate = new Date(reservation.start_time)
      return reservationDate >= today && reservationDate <= tenDaysLater
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  // Pass the pre-fetched data to the client component
  return (
    <AnimatedLayout>
      <HomeContent upcomingReservations={upcomingReservations} today={today} />
    </AnimatedLayout>
  )
}
