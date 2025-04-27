"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface MyReservationsProps {
  reservations: Reservation[]
}

export function MyReservations({ reservations }: MyReservationsProps) {
  const router = useRouter()
  const supabase = createClientSupabaseClient()
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
      const { error } = await supabase.from("reservations").delete().eq("id", reservationToDelete)

      if (error) throw error

      toast({
        title: "Reservation deleted",
        description: "Your reservation has been cancelled successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Reservations</span>
            <Link href="/reservations/new">
              <Button size="sm">New Reservation</Button>
            </Link>
          </CardTitle>
          <CardDescription>Manage your grill reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No reservations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">You haven't made any grill reservations yet.</p>
              <Link href="/reservations/new" className="mt-4 inline-block">
                <Button>Book the Grill</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingReservations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Upcoming Reservations</h3>
                  <div className="space-y-3">
                    {upcomingReservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h4 className="font-medium">{reservation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(reservation.start_time)} • {formatTime(reservation.start_time)} -{" "}
                            {formatTime(reservation.end_time)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/reservations/edit/${reservation.id}`}>
                            <Button size="icon" variant="outline">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button size="icon" variant="outline" onClick={() => handleDeleteClick(reservation.id)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastReservations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Past Reservations</h3>
                  <div className="space-y-3">
                    {pastReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between rounded-lg border p-4 opacity-70"
                      >
                        <div>
                          <h4 className="font-medium">{reservation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(reservation.start_time)} • {formatTime(reservation.start_time)} -{" "}
                            {formatTime(reservation.end_time)}
                          </p>
                        </div>
                        <Button size="icon" variant="outline" onClick={() => handleDeleteClick(reservation.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              Keep Reservation
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              {isLoading ? "Cancelling..." : "Cancel Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
