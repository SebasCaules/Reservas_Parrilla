"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Flame, Calendar, ClipboardList, Menu, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 pl-2 md:pl-4">
          <Flame className="h-6 w-6 text-orange-500" />
          <Link href="/" className="font-bold text-lg">
            Reservas de Parrilla
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
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
            <Link href="/reserve" className="pr-2 md:pr-4">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">Reservar Parrilla</Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="lg">
                    <Home className="h-5 w-5 mr-2" />
                    Inicio
                  </Button>
                </Link>
                <Link href="/calendar" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Calendario
                  </Button>
                </Link>
                <Link href="/historial" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="lg">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Historial
                  </Button>
                </Link>
                <Link href="/reserve" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">Reservar Parrilla</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
