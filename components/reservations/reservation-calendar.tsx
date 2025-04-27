"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reservation } from "@/lib/types/database"
import { formatTime } from "@/lib/utils/date"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, PlusCircle } from "lucide-react"

interface ReservationCalendarProps {
  reservations: Reservation[]
}

export function ReservationCalendar({ reservations }: ReservationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Filtrar reservas para la fecha seleccionada
  const filteredReservations = reservations.filter((reservation) =>
    isSameDay(parseISO(reservation.start_time), selectedDate),
  )

  // Ordenar reservas por hora de inicio
  const sortedReservations = [...filteredReservations].sort(
    (a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime(),
  )

  // Calcular días con reservas para el calendario
  const daysWithReservations = reservations.reduce((acc, reservation) => {
    const date = parseISO(reservation.start_time)
    const dateString = format(date, "yyyy-MM-dd")
    if (!acc.includes(dateString)) {
      acc.push(dateString)
    }
    return acc
  }, [] as string[])

  return (
    <div className="grid gap-6 md:grid-cols-2">
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
              booked: (date) => daysWithReservations.includes(format(date, "yyyy-MM-dd")),
            }}
            modifiersStyles={{
              booked: { fontWeight: "bold", backgroundColor: "rgba(234, 88, 12, 0.3)", color: "#c2410c" },
            }}
          />
        </CardContent>
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
              {sortedReservations.map((reservation) => (
                <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{reservation.title}</h3>
                    <span className="text-sm text-muted-foreground">Apto {reservation.apartment_number}</span>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
