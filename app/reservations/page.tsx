import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"

export default async function ReservationsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get all reservations
  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .order("start_time", { ascending: true })

  // Get all profiles for displaying names
  const { data: profilesData } = await supabase.from("profiles").select("id, full_name")

  // Convert profiles array to a map for easier lookup
  const profiles = (profilesData || []).reduce(
    (acc, profile) => {
      acc[profile.id] = { full_name: profile.full_name }
      return acc
    },
    {} as Record<string, { full_name: string | null }>,
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Grill Reservations</h1>
        <ReservationCalendar reservations={reservations || []} profiles={profiles} />
      </main>
    </div>
  )
}
