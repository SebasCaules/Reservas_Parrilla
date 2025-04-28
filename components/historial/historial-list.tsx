"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistorialFilters } from "./historial-filters"
import { formatDateTime, isPastReservation } from "@/lib/utils/date"
import type { Reservation } from "@/lib/types/database"
import { parseISO, getMonth, getYear } from "date-fns"

interface HistorialListProps {
  reservations: Reservation[]
}

export function HistorialList({ reservations }: HistorialListProps) {
  const [filteredReservations, setFilteredReservations] = useState(reservations)
  const [activeFilters, setActiveFilters] = useState({
    departamento: null as string | null,
    mes: null as string | null,
    año: null as string | null,
  })

  // Separar reservas pasadas y futuras
  const pastReservations = filteredReservations.filter((reservation) => isPastReservation(reservation))
  const upcomingReservations = filteredReservations.filter((reservation) => !isPastReservation(reservation))

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...reservations]

    // Filtrar por departamento
    if (activeFilters.departamento) {
      result = result.filter((reservation) => reservation.apartment_number === activeFilters.departamento)
    }

    // Filtrar por mes
    if (activeFilters.mes !== null) {
      const mesNum = Number.parseInt(activeFilters.mes)
      result = result.filter((reservation) => {
        const fecha = parseISO(reservation.start_time)
        return getMonth(fecha) === mesNum
      })
    }

    // Filtrar por año
    if (activeFilters.año) {
      const añoNum = Number.parseInt(activeFilters.año)
      result = result.filter((reservation) => {
        const fecha = parseISO(reservation.start_time)
        return getYear(fecha) === añoNum
      })
    }

    setFilteredReservations(result)
  }, [activeFilters, reservations])

  const handleFilterChange = (filters: {
    departamento: string | null
    mes: string | null
    año: string | null
  }) => {
    setActiveFilters(filters)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <HistorialFilters onFilterChange={handleFilterChange} />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">Todas ({filteredReservations.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximas ({upcomingReservations.length})</TabsTrigger>
          <TabsTrigger value="past">Pasadas ({pastReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Reservas</CardTitle>
              <CardDescription>
                Historial completo de reservas de la parrilla ({filteredReservations.length} reservas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReservations.length > 0 ? (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`flex flex-col space-y-2 rounded-lg border p-4 ${
                        isPastReservation(reservation) ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{reservation.title}</h3>
                        <span className="text-sm text-muted-foreground">Apto {reservation.apartment_number}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Fecha y hora:</span> {formatDateTime(reservation.start_time)} -{" "}
                        {formatDateTime(reservation.end_time)}
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
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No hay reservas que coincidan con los filtros seleccionados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
              <CardDescription>
                Reservas programadas para fechas futuras ({upcomingReservations.length} reservas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{reservation.title}</h3>
                        <span className="text-sm text-muted-foreground">Apto {reservation.apartment_number}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Fecha y hora:</span> {formatDateTime(reservation.start_time)} -{" "}
                        {formatDateTime(reservation.end_time)}
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
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No hay próximas reservas que coincidan con los filtros seleccionados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Reservas Pasadas</CardTitle>
              <CardDescription>Historial de reservas anteriores ({pastReservations.length} reservas)</CardDescription>
            </CardHeader>
            <CardContent>
              {pastReservations.length > 0 ? (
                <div className="space-y-4">
                  {pastReservations.map((reservation) => (
                    <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4 opacity-60">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{reservation.title}</h3>
                        <span className="text-sm text-muted-foreground">Apto {reservation.apartment_number}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Fecha y hora:</span> {formatDateTime(reservation.start_time)} -{" "}
                        {formatDateTime(reservation.end_time)}
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
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No hay reservas pasadas que coincidan con los filtros seleccionados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
