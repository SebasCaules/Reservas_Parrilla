"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistorialFilters } from "./historial-filters"
import { formatDate, formatTime, isPastReservation } from "@/lib/utils/date"
import type { Reservation } from "@/lib/types/database"
import { parseISO, getMonth, getYear } from "date-fns"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedList } from "@/components/ui/animated-list"
import { motion } from "framer-motion"

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

  // Función para renderizar una reserva con el formato actualizado
  const renderReservation = (reservation: Reservation, isPast = false) => {
    const startDate = new Date(reservation.start_time)
    const endDate = new Date(reservation.end_time)

    return (
      <div
        key={reservation.id}
        className={`flex flex-col space-y-2 rounded-lg border p-4 ${isPast ? "opacity-60" : ""}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{reservation.title}</h3>
          <span className="text-sm text-muted-foreground">Unidad {reservation.apartment_number}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Reservado por:</span> {reservation.name}
        </div>
        <div className="text-sm">
          <span className="font-medium">Fecha:</span> {formatDate(startDate)}
        </div>
        <div className="text-sm">
          <span className="font-medium">Horario:</span> {formatTime(startDate)} - {formatTime(endDate)}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <HistorialFilters onFilterChange={handleFilterChange} />
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">Todas ({filteredReservations.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas ({upcomingReservations.length})</TabsTrigger>
            <TabsTrigger value="past">Pasadas ({pastReservations.length})</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="all">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Todas las Reservas</CardTitle>
              <CardDescription>
                Historial completo de reservas de la parrilla ({filteredReservations.length} reservas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReservations.length > 0 ? (
                <AnimatedList>
                  {filteredReservations.map((reservation) =>
                    renderReservation(reservation, isPastReservation(reservation)),
                  )}
                </AnimatedList>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay reservas que coincidan con los filtros seleccionados
                </motion.p>
              )}
            </CardContent>
          </AnimatedCard>
        </TabsContent>

        <TabsContent value="upcoming">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
              <CardDescription>
                Reservas programadas para fechas futuras ({upcomingReservations.length} reservas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length > 0 ? (
                <AnimatedList>{upcomingReservations.map((reservation) => renderReservation(reservation))}</AnimatedList>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay próximas reservas que coincidan con los filtros seleccionados
                </motion.p>
              )}
            </CardContent>
          </AnimatedCard>
        </TabsContent>

        <TabsContent value="past">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Reservas Pasadas</CardTitle>
              <CardDescription>Historial de reservas anteriores ({pastReservations.length} reservas)</CardDescription>
            </CardHeader>
            <CardContent>
              {pastReservations.length > 0 ? (
                <AnimatedList>
                  {pastReservations.map((reservation) => renderReservation(reservation, true))}
                </AnimatedList>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay reservas pasadas que coincidan con los filtros seleccionados
                </motion.p>
              )}
            </CardContent>
          </AnimatedCard>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
