import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, HelpCircle, Flame } from "lucide-react"
import { AnimatedLayout } from "@/components/layout/animated-layout"

export default function AboutPage() {
  return (
    <AnimatedLayout>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Acerca de Nuestro Sistema de Reservas</h1>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Introducción */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-orange-500" />
                <h2 className="text-2xl font-semibold">¿Qué es este sistema?</h2>
              </div>
              <p className="text-lg">
                Este es un sistema sencillo para reservar la parrilla del edificio. Fue creado para evitar confusiones y
                que dos vecinos quieran usar la parrilla al mismo tiempo.
              </p>
              <p className="text-lg mt-4">
                Con este sistema, todos pueden ver cuándo está ocupada la parrilla y hacer sus propias reservas de
                manera fácil.
              </p>
            </CardContent>
          </Card>

          {/* Cómo funciona */}
          <Card id="como-funciona">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="h-8 w-8 text-orange-500" />
                <h2 className="text-2xl font-semibold">¿Cómo funciona?</h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3 mt-1">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">1. Consulta el calendario</h3>
                    <p className="text-lg">
                      Primero, mira el calendario para ver qué días y horarios están disponibles. Los días con reservas
                      aparecen marcados con colores diferentes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3 mt-1">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">2. Haz tu reserva</h3>
                    <p className="text-lg">
                      Selecciona el día y la hora que prefieras. Completa el formulario con tu nombre, número de
                      apartamento y el título de tu evento.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3 mt-1">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">3. Guarda tu código</h3>
                    <p className="text-lg">
                      Después de hacer la reserva, recibirás un código de 4 dígitos. Guárdalo bien porque lo necesitarás
                      si quieres cancelar tu reserva más adelante.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Link href="/reserve">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 h-auto">
                      Hacer una Reserva Ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preguntas frecuentes */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium">¿Cuánto tiempo puedo reservar la parrilla?</h3>
                  <p className="text-lg">
                    Puedes reservar la parrilla por un máximo de 6 horas en un mismo día. No se permiten reservas que
                    pasen de un día a otro.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium">¿Qué pasa si quiero cancelar mi reserva?</h3>
                  <p className="text-lg">
                    Para cancelar tu reserva, ve al calendario, selecciona tu reserva y haz clic en el botón de
                    cancelar. Te pedirá el código de 4 dígitos que recibiste cuando hiciste la reserva.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium">¿Puedo modificar mi reserva?</h3>
                  <p className="text-lg">
                    No es posible modificar una reserva existente. Si necesitas cambiar algo, deberás cancelar tu
                    reserva actual y crear una nueva.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium">¿Qué significan los colores en el calendario?</h3>
                  <p className="text-lg">
                    <span className="inline-block w-4 h-4 bg-green-600 mr-2"></span> Verde: Día con 1 reserva
                    <br />
                    <span className="inline-block w-4 h-4 bg-amber-500 mr-2 mt-2"></span> Amarillo: Día con 2-3 reservas
                    <br />
                    <span className="inline-block w-4 h-4 bg-red-600 mr-2 mt-2"></span> Rojo: Día con 4 o más reservas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="outline" size="lg" className="text-lg px-6 py-5 h-auto">
                Volver a la Página Principal
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6 mx-2 md:mx-4">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Reservas de Parrilla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </AnimatedLayout>
  )
}
