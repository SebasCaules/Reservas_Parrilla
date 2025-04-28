"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Flame, Calendar, ClipboardList, Menu, Home, Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Función para verificar si un enlace está activo
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

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
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/") && "bg-orange-600 hover:bg-orange-700 text-white")}
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
            <Link href="/calendar">
              <Button
                variant={isActive("/calendar") ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/calendar") && "bg-orange-600 hover:bg-orange-700 text-white")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendario
              </Button>
            </Link>
            <Link href="/historial">
              <Button
                variant={isActive("/historial") ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/historial") && "bg-orange-600 hover:bg-orange-700 text-white")}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Historial
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/about") && "bg-orange-600 hover:bg-orange-700 text-white")}
              >
                <Info className="h-4 w-4 mr-2" />
                Acerca de
              </Button>
            </Link>
            <Link href="/reserve" className="pr-2 md:pr-4">
              <Button
                className={cn(
                  "bg-orange-600 hover:bg-orange-700 text-white",
                  isActive("/reserve") && "ring-2 ring-orange-300 dark:ring-orange-700",
                )}
              >
                Reservar Parrilla
              </Button>
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
                  <Button
                    variant={isActive("/") ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive("/") && "bg-orange-600 hover:bg-orange-700 text-white",
                    )}
                    size="lg"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Inicio
                  </Button>
                </Link>
                <Link href="/calendar" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/calendar") ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive("/calendar") && "bg-orange-600 hover:bg-orange-700 text-white",
                    )}
                    size="lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Calendario
                  </Button>
                </Link>
                <Link href="/historial" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/historial") ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive("/historial") && "bg-orange-600 hover:bg-orange-700 text-white",
                    )}
                    size="lg"
                  >
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Historial
                  </Button>
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/about") ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive("/about") && "bg-orange-600 hover:bg-orange-700 text-white",
                    )}
                    size="lg"
                  >
                    <Info className="h-5 w-5 mr-2" />
                    Acerca de
                  </Button>
                </Link>
                <Link href="/reserve" onClick={() => setIsOpen(false)}>
                  <Button
                    className={cn(
                      "w-full mt-4 bg-orange-600 hover:bg-orange-700",
                      isActive("/reserve") && "ring-2 ring-orange-300 dark:ring-orange-700",
                    )}
                  >
                    Reservar Parrilla
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
