import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { formatDateTime } from "@/lib/utils/date"
import { CalendarClock, Flame, PlusCircle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get user's reservations
  const { data: userReservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", session.user.id)
    .order("start_time", { ascending: true })
    .limit(3)

  // Get all upcoming reservations
  const { data: upcomingReservations } = await supabase
    .from("reservations")
    .select("*, profiles(full_name)")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(5)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="mr-2 h-5 w-5 text-orange-500" />
                My Reservations
              </CardTitle>
              <CardDescription>Your upcoming grill reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {!userReservations || userReservations.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No reservations yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You haven't made any grill reservations yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userReservations.map((reservation) => (
                    <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <h3 className="font-medium">{reservation.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(reservation.start_time)} - {formatDateTime(reservation.end_time)}
                      </p>
                      {reservation.description && <p className="text-sm">{reservation.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/reservations" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Reservations
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Reservations</span>
                <Link href="/reservations/new">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Reservation
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Recently scheduled grill times</CardDescription>
            </CardHeader>
            <CardContent>
              {!upcomingReservations || upcomingReservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming reservations. The grill is available!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{reservation.title}</h3>
                        <span className="text-sm text-muted-foreground">Apt {reservation.apartment_number}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDateTime(reservation.start_time)}</p>
                      <p className="text-sm">Reserved by: {reservation.profiles?.full_name || "Unknown"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/reservations" className="w-full">
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
