import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flame, Calendar, ClipboardList } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <Link href="/" className="font-bold text-lg">
            Reservas de Parrilla
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/calendar">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendario
            </Button>
          </Link>
          <Link href="/historial">
            <Button variant="ghost" size="sm">
              <ClipboardList className="h-4 w-4 mr-2" />
              Historial
            </Button>
          </Link>
          <Link href="/reserve">
            <Button>Reservar Parrilla</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
