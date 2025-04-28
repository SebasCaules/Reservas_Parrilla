"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import type { Reservation } from "@/lib/types/database"
import { formatDate, formatTime } from "@/lib/utils/date"
import { CalendarClock, Edit, Trash } from "lucide-react"
import { deleteReservation } from "@/lib/actions/reservation-actions"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedList } from "@/components/ui/animated-list"

interface MyReservationsProps {
  reservations: Reservation[]
}

export function MyReservations({ reservations }: MyReservationsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null)

  // Sort reservations by start time (upcoming first)
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  )

  // Split into upcoming and past reservations
  const now = new Date()
  const upcomingReservations = sortedReservations.filter((reservation) => new Date(reservation.end_time) >= now)
  const pastReservations = sortedReservations.filter((reservation) => new Date(reservation.end_time) < now)

  function handleDeleteClick(id: string) {
    setReservationToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!reservationToDelete) return

    setIsLoading(true)

    try {
      await deleteReservation(reservationToDelete)

      toast({
        title: "Reserva eliminada",
        description: "Tu reserva ha sido cancelada exitosamente.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Algo salió mal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setReservationToDelete(null)
    }
  }

  return (
    <>
      <AnimatedCard>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mis Reservas</span>
            <Link href="/reservations/new">
              <AnimatedButton size="sm">Nueva Reserva</AnimatedButton>
            </Link>
          </CardTitle>
          <CardDescription>Administra tus reservas de parrilla</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No tienes reservas</h3>
              <p className="mt-2 text-sm text-muted-foreground">Aún no has realizado ninguna reserva de parrilla.</p>
              <Link href="/reservations/new" className="mt-4 inline-block">
                <AnimatedButton>Reservar la Parrilla</AnimatedButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingReservations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Próximas Reservas</h3>
                  <AnimatedList>
                    {upcomingReservations.map((reservation) => {
                      const startDate = new Date(reservation.start_time)
                      const endDate = new Date(reservation.end_time)

                      return (
                        <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <h4 className="font-medium">{reservation.title}</h4>
                            <p className="text-sm">
                              <span className="font-medium">Fecha:</span> {formatDate(startDate)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Horario:</span> {formatTime(startDate)} -{" "}
                              {formatTime(endDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">Unidad {reservation.apartment_number}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/reservations/edit/${reservation.id}`}>
                              <Button size="icon" variant="outline">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button size="icon" variant="outline" onClick={() => handleDeleteClick(reservation.id)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </AnimatedList>
                </div>
              )}

              {pastReservations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Reservas Pasadas</h3>
                  <AnimatedList>
                    {pastReservations.map((reservation) => {
                      const startDate = new Date(reservation.start_time)
                      const endDate = new Date(reservation.end_time)

                      return (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between rounded-lg border p-4 opacity-70"
                        >
                          <div>
                            <h4 className="font-medium">{reservation.title}</h4>
                            <p className="text-sm">
                              <span className="font-medium">Fecha:</span> {formatDate(startDate)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Horario:</span> {formatTime(startDate)} -{" "}
                              {formatTime(endDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">Unidad {reservation.apartment_number}</p>
                          </div>
                          <Button size="icon" variant="outline" onClick={() => handleDeleteClick(reservation.id)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      )
                    })}
                  </AnimatedList>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              Mantener Reserva
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              {isLoading ? "Cancelando..." : "Cancelar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
