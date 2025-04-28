"use client"

import Link from "next/link"
import { Flame, Calendar, Users } from "lucide-react"
import { formatTime, formatDate } from "@/lib/utils/date"
import { format, addDays } from "date-fns"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllReservations } from "@/lib/actions/reservation-actions"
import { AlertMessage } from "@/components/ui/alert-message"
import { AnimatedLayout } from "@/components/layout/animated-layout"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedTitle } from "@/components/ui/animated-title"
import { AnimatedList } from "@/components/ui/animated-list"
import { motion } from "framer-motion"

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

  // Verificar si hay más de 4 reservas
  const hasMoreThanFourReservations = upcomingReservations.length > 4

  // Limitar a 4 reservas para mostrar
  const reservationsToShow = upcomingReservations.slice(0, 4)

  return (
    <AnimatedLayout>
      <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <AnimatedTitle className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Reserva la Parrilla
                </AnimatedTitle>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                >
                  Reserva fácilmente la parrilla comunitaria para tu próximo evento. Sin más conflictos de horarios o
                  confusiones.
                </motion.p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={`/reserve?date=${format(today, "yyyy-MM-dd")}`}>
                  <AnimatedButton
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-wide"
                  >
                    Hacer una Reserva
                  </AnimatedButton>
                </Link>
                <Link href="/calendar">
                  <AnimatedButton size="lg" variant="outline">
                    Ver Calendario
                  </AnimatedButton>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur-xl opacity-20 animate-pulse" />
              <AnimatedCard delay={0.3}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reservas de los próximos 10 días</span>
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </CardTitle>
                  <CardDescription>
                    {upcomingReservations.length === 0
                      ? "No hay reservas programadas"
                      : `${upcomingReservations.length} reserva(s) programada(s)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reservationsToShow.length > 0 ? (
                    <AnimatedList>
                      {reservationsToShow.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex flex-col p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{formatDate(reservation.start_time)}</span>
                            <span className="text-sm">{reservation.apartment_number}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 truncate max-w-[60%] text-right">
                              {reservation.title} - {reservation.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </AnimatedList>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                      <span className="font-medium">Próximos 10 días</span>
                      <span className="text-sm text-green-600 dark:text-green-400">Disponible</span>
                    </div>
                  )}

                  {hasMoreThanFourReservations && (
                    <AlertMessage className="mt-4">
                      Hay {upcomingReservations.length} reservas en los próximos días. Consulta el calendario para ver
                      todas.
                    </AlertMessage>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/calendar" className="w-full">
                    <AnimatedButton variant="outline" className="w-full">
                      Ver Calendario Completo
                    </AnimatedButton>
                  </Link>
                </CardFooter>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.4} className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <AnimatedTitle delay={0.5} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Cómo Funciona
              </AnimatedTitle>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
              >
                Nuestro sistema de reservas facilita la reserva de la parrilla para tu próximo evento.
              </motion.p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <AnimatedCard delay={0.7} className="flex flex-col items-center space-y-2 p-6">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold">Verifica Disponibilidad</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Consulta el calendario para ver cuándo está disponible la parrilla para tu evento.
              </p>
            </AnimatedCard>
            <AnimatedCard delay={0.8} className="flex flex-col items-center space-y-2 p-6">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold">Reserva tu Horario</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Reserva la parrilla para tu fecha y hora preferidas con unos pocos clics.
              </p>
            </AnimatedCard>
            <AnimatedCard delay={0.9} className="flex flex-col items-center space-y-2 p-6">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold">Disfruta tu Evento</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Organiza tu reunión sin preocuparte por conflictos de horarios.
              </p>
            </AnimatedCard>
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/about#como-funciona">
              <AnimatedButton className="bg-orange-600 hover:bg-orange-700 text-white">
                Aprender más sobre cómo funciona
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </AnimatedSection>
      <footer className="w-full border-t py-6 mx-2 md:mx-4">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Reservas de Parrilla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </AnimatedLayout>
  )
}
