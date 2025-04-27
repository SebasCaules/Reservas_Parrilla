import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationForm } from "@/components/reservations/reservation-form"

export default async function EditReservationPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get the reservation
  const { data: reservation } = await supabase.from("reservations").select("*").eq("id", params.id).single()

  if (!reservation) {
    notFound()
  }

  // Check if the user owns this reservation
  if (reservation.user_id !== session.user.id) {
    redirect("/reservations")
  }

  // Get user's profile to get apartment number
  const { data: profile } = await supabase
    .from("profiles")
    .select("apartment_number")
    .eq("id", session.user.id)
    .single()

  // Get all reservations for checking availability
  const { data: reservations } = await supabase.from("reservations").select("*")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1 container max-w-lg py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Reservation</h1>
        <ReservationForm
          userId={session.user.id}
          apartmentNumber={profile?.apartment_number || "Unknown"}
          existingReservations={reservations || []}
          initialData={reservation}
        />
      </main>
    </div>
  )
}
