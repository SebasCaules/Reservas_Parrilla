import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { MyReservations } from "@/components/reservations/my-reservations"

export default async function MyReservationsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get user's reservations
  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", session.user.id)
    .order("start_time", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1 container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
        <MyReservations reservations={reservations || []} />
      </main>
    </div>
  )
}
