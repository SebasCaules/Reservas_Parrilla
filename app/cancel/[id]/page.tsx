import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils/date"
import { getReservationById, deleteReservation } from "@/lib/actions/reservation-actions"

export default async function CancelReservationPage({
  params,
}: {
  params: { id: string }
}) {
  // Obtener la reserva
  const reservation = await getReservationById(params.id)

  if (!reservation) {
    notFound()
  }

  async function cancelReservation() {
    "use server"

    await deleteReservation(params.id)
    return { success: true }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-lg py-8">
        <h1 className="text-3xl font-bold mb-8">Cancelar Reserva</h1>

        <Card>
          <CardHeader>
            <CardTitle>Confirmar Cancelación</CardTitle>
            <CardDescription>¿Estás seguro de que deseas cancelar esta reserva?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Evento:</span> {reservation.title}
                </div>
                <div>
                  <span className="font-medium">Reservado por:</span> {reservation.name} (Apto{" "}
                  {reservation.apartment_number})
                </div>
                <div>
                  <span className="font-medium">Horario:</span> {formatDateTime(reservation.start_time)} a{" "}
                  {formatDateTime(reservation.end_time)}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/calendar">
              <Button variant="outline">Volver</Button>
            </Link>
            <form action={cancelReservation}>
              <Button variant="destructive" type="submit">
                Cancelar Reserva
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
