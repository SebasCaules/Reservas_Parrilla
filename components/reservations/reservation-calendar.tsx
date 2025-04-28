"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertMessage } from "@/components/ui/alert-message"
import type { Reservation } from "@/lib/types/database"
import { formatTime, isPastReservation } from "@/lib/utils/date"
import { format, isSameDay, parseISO, isBefore, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { CancelReservationDialog } from "./cancel-reservation-dialog"

interface ReservationCalendarProps {
  reservations: Reservation[]
}

export function ReservationCalendar({ reservations }: ReservationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reservationsCountByDay, setReservationsCountByDay] = useState<Record<string, number>>({})

  // Filtrar reservas para la fecha seleccionada
  const filteredReservations = reservations.filter((reservation) =>
    isSameDay(parseISO(reservation.start_time), selectedDate),
  )

  // Ordenar reservas por hora de inicio
  const sortedReservations = [...filteredReservations].sort(
    (a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime(),
  )

  // Calcular el número de reservas por día
  useEffect(() => {
    const countByDay: Record<string, number> = {}

    reservations.forEach((reservation) => {
      const date = parseISO(reservation.start_time)
      const dateString = format(date, "yyyy-MM-dd")

      if (!countByDay[dateString]) {
        countByDay[dateString] = 0
      }

      countByDay[dateString]++
    })

    setReservationsCountByDay(countByDay)
  }, [reservations])

  // Obtener la fecha actual para deshabilitar fechas pasadas
  const today = new Date()

  // Función para determinar si un día tiene una reserva
  const hasOneReservation = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return reservationsCountByDay[dateString] === 1 && !isBefore(date, startOfDay(today))
  }

  // Función para determinar si un día tiene 2-3 reservas
  const hasMediumReservations = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return (
      reservationsCountByDay[dateString] >= 2 &&
      reservationsCountByDay[dateString] <= 3 &&
      !isBefore(date, startOfDay(today))
    )
  }

  // Función para determinar si un día tiene 4 o más reservas
  const hasHighReservations = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return reservationsCountByDay[dateString] >= 4 && !isBefore(date, startOfDay(today))
  }

  // Número de reservas para el día seleccionado
  const selectedDateReservationsCount = reservationsCountByDay[format(selectedDate, "yyyy-MM-dd")] || 0

  return (
    <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Calendario</span>
            <Link href={`/reserve?date=${format(selectedDate, "yyyy-MM-dd")}`}>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Reserva
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Selecciona una fecha para ver las reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            locale={es}
            modifiers={{
              oneReservation: hasOneReservation,
              mediumReservations: hasMediumReservations,
              highReservations: hasHighReservations,
              past: (date) => isBefore(date, startOfDay(today)),
            }}
            modifiersStyles={{
              oneReservation: {
                backgroundColor: "rgb(22, 163, 74)", // green-600
                color: "white",
                fontWeight: "bold",
              },
              mediumReservations: {
                backgroundColor: "rgb(245, 158, 11)", // amber-500
                color: "white",
                fontWeight: "bold",
              },
              highReservations: {
                backgroundColor: "rgb(220, 38, 38)", // red-600
                color: "white",
                fontWeight: "bold",
              },
              past: {
                opacity: "0.5",
              },
              selected: {
                borderWidth: "2px",
                borderColor: "rgb(249, 115, 22)", // orange-500
                borderStyle: "solid",
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.8) inset",
                transform: "scale(1.1)",
                zIndex: "10",
                position: "relative",
              },
            }}
            disabled={(date) => isBefore(date, startOfDay(today))}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-sm bg-green-600"></div>
            <span className="text-sm">Días con 1 reserva</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-sm bg-amber-500"></div>
            <span className="text-sm">Días con 2-3 reservas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-sm bg-red-600"></div>
            <span className="text-sm">Días con 4 o más reservas</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>Reservas para {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
          </CardTitle>
          <CardDescription>
            {sortedReservations.length === 0
              ? "No hay reservas para esta fecha"
              : `${sortedReservations.length} reserva(s) programada(s)`}
          </CardDescription>
          {selectedDateReservationsCount >= 2 && (
            <AlertMessage variant="warning" className="mt-2">
              {selectedDateReservationsCount >= 4
                ? `¡Atención! Este día tiene ${selectedDateReservationsCount} reservas. Es muy probable que haya superposición de horarios.`
                : `Este día tiene ${selectedDateReservationsCount} reservas. Es posible que haya superposición de horarios.`}
            </AlertMessage>
          )}
        </CardHeader>
        <CardContent>
          {sortedReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">¡La parrilla está disponible todo el día!</p>
              <Link href={`/reserve?date=${format(selectedDate, "yyyy-MM-dd")}`}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Reservar la Parrilla
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReservations.map((reservation) => {
                const isPast = isPastReservation(reservation)

                return (
                  <div
                    key={reservation.id}
                    className={`flex flex-col space-y-2 rounded-lg border p-4 ${isPast ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{reservation.title}</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">Apto {reservation.apartment_number}</span>
                        {!isPast && (
                          <CancelReservationDialog
                            reservationId={reservation.id}
                            reservationTitle={reservation.title}
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Horario:</span> {formatTime(reservation.start_time)} -{" "}
                      {formatTime(reservation.end_time)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Reservado por:</span> {reservation.name}
                    </div>
                    {reservation.description && (
                      <p className="text-sm text-muted-foreground mt-2">{reservation.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
