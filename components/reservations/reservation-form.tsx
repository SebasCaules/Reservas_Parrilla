"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { format, addMinutes, parseISO, isBefore, startOfDay, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Reservation } from "@/lib/types/database"
import { generateTimeSlots, isValidReservation } from "@/lib/utils/date"
import { createReservation, updateReservation } from "@/lib/actions/reservation-actions"
import { AlertMessage } from "@/components/ui/alert-message"
import { generateCancellationCode } from "@/lib/utils/reservation"
import { ReservationSuccessDialog } from "./reservation-success-dialog"
import { AnimatedButton } from "@/components/ui/animated-button"
import { motion } from "framer-motion"

interface ReservationFormProps {
  existingReservations: Reservation[]
  initialData?: Reservation
  initialDate?: string
}

export function ReservationForm({ existingReservations, initialData, initialDate }: ReservationFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || "")
  const [apartmentNumber, setApartmentNumber] = useState(initialData?.apartment_number || "")
  const [title, setTitle] = useState(initialData?.title || "")

  // Obtener la fecha actual para deshabilitar fechas pasadas
  const today = new Date()

  // Corregir el problema de fecha
  const [date, setDate] = useState<Date | undefined>(() => {
    if (initialData) {
      return new Date(initialData.start_time)
    } else if (initialDate) {
      // Corregir el problema de zona horaria al parsear la fecha
      const [year, month, day] = initialDate.split("-").map(Number)
      // Crear la fecha usando UTC para evitar ajustes de zona horaria
      // y luego convertirla a fecha local
      return new Date(year, month - 1, day)
    } else {
      return new Date()
    }
  })

  const [availableStartTimes, setAvailableStartTimes] = useState<{ time: Date; available: boolean; isPast: boolean }[]>(
    [],
  )
  const [availableEndTimes, setAvailableEndTimes] = useState<{ time: Date; available: boolean; isPast: boolean }[]>([])
  const [startTime, setStartTime] = useState<Date | undefined>(
    initialData ? new Date(initialData.start_time) : undefined,
  )
  const [endTime, setEndTime] = useState<Date | undefined>(initialData ? new Date(initialData.end_time) : undefined)

  // Calcular el número de reservas para el día seleccionado
  const reservationsForSelectedDate = date
    ? existingReservations.filter(
        (reservation) =>
          isSameDay(parseISO(reservation.start_time), date) &&
          // Excluir la reserva actual si estamos editando
          (!initialData || reservation.id !== initialData.id),
      )
    : []

  const reservationsCount = reservationsForSelectedDate.length

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdReservation, setCreatedReservation] = useState<any>(null)
  const [generatedCode, setGeneratedCode] = useState("")

  // Actualizar horarios disponibles cuando cambia la fecha
  useEffect(() => {
    if (date) {
      const timeSlots = generateTimeSlots(date, existingReservations)
      setAvailableStartTimes(timeSlots)
      setStartTime(undefined)
      setEndTime(undefined)
    }
  }, [date, existingReservations])

  // Actualizar horarios de finalización cuando cambia la hora de inicio
  useEffect(() => {
    if (date && startTime) {
      // Generar horarios posibles de finalización (desde startTime + 30min hasta startTime + 6h)
      const possibleEndTimes = []
      let currentTime = new Date(startTime)
      currentTime = addMinutes(currentTime, 30)

      const maxEndTime = new Date(startTime)
      maxEndTime.setHours(maxEndTime.getHours() + 6)

      // Asegurarse de que no pase a otro día
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const endTimeLimit = maxEndTime < endOfDay ? maxEndTime : endOfDay

      // Obtener la hora actual para deshabilitar slots pasados
      const now = new Date()

      while (currentTime <= endTimeLimit) {
        const isAvailable = !existingReservations.some((reservation) => {
          // Ignorar la reserva actual si estamos editando
          if (initialData && reservation.id === initialData.id) return false

          const reservationStart = parseISO(reservation.start_time)
          const reservationEnd = parseISO(reservation.end_time)

          return currentTime > reservationStart && currentTime <= reservationEnd
        })

        // Verificar si el horario ya pasó
        const isPast = isBefore(currentTime, now)

        possibleEndTimes.push({
          time: new Date(currentTime),
          available: isAvailable,
          isPast: isPast,
        })

        currentTime = addMinutes(currentTime, 30)
      }

      setAvailableEndTimes(possibleEndTimes)
      setEndTime(undefined)
    }
  }, [startTime, date, existingReservations, initialData])

  // Función para manejar el cierre del diálogo de éxito
  const handleSuccessDialogClose = (open: boolean) => {
    setShowSuccessDialog(open)
    if (!open) {
      // Redirigir al calendario cuando se cierra el diálogo
      router.refresh()
      router.push("/calendar")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    if (!date || !startTime || !endTime) {
      toast({
        title: "Error",
        description: "Por favor selecciona fecha y horarios",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validar la reserva
    const validation = isValidReservation(startTime, endTime)
    if (!validation.valid) {
      toast({
        title: "Error",
        description: validation.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Generar código de cancelación
      const cancellationCode = generateCancellationCode()

      if (initialData) {
        // Actualizar reserva existente
        await updateReservation(initialData.id, {
          name,
          apartment_number: apartmentNumber,
          title,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          cancellation_code: initialData.cancellation_code || cancellationCode,
        })

        toast({
          title: "Reserva actualizada",
          description: "Tu reserva ha sido actualizada exitosamente.",
        })

        // Redirigir inmediatamente para actualizaciones
        router.refresh()
        router.push("/calendar")
      } else {
        // Crear nueva reserva
        const newReservation = await createReservation({
          name,
          apartment_number: apartmentNumber,
          title,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          cancellation_code: cancellationCode,
        })

        // Mostrar el diálogo con el código
        setCreatedReservation(newReservation)
        setGeneratedCode(cancellationCode)
        setShowSuccessDialog(true)

        toast({
          title: "Reserva creada",
          description: "Tu reserva ha sido creada exitosamente.",
        })

        // No redirigir automáticamente, esperar a que el usuario cierre el diálogo
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Algo salió mal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>{initialData ? "Editar Reserva" : "Nueva Reserva"}</CardTitle>
          <CardDescription>
            {initialData ? "Actualiza los detalles de tu reserva" : "Reserva la parrilla para tu evento"}
          </CardDescription>
          {reservationsCount >= 2 && (
            <AlertMessage className="mt-2">
              {reservationsCount >= 4
                ? `¡Atención! Este día tiene ${reservationsCount} reservas. Es muy probable que haya superposición de horarios.`
                : `Este día tiene ${reservationsCount} reservas. Es posible que haya superposición de horarios.`}
            </AlertMessage>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Tu Nombre</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="apartmentNumber">Número de Apartamento</Label>
              <Select value={apartmentNumber} onValueChange={setApartmentNumber} required>
                <SelectTrigger id="apartmentNumber" className="w-full">
                  <SelectValue placeholder="Selecciona tu apartamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PB A">PB A</SelectItem>
                  <SelectItem value="PB B">PB B</SelectItem>
                  <SelectItem value="1C">1C</SelectItem>
                  <SelectItem value="1D">1D</SelectItem>
                  <SelectItem value="2E">2E</SelectItem>
                  <SelectItem value="2F">2F</SelectItem>
                  <SelectItem value="3G">3G</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="title">Título del Evento</Label>
              <Input
                id="title"
                placeholder="Asado Familiar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="space-y-2"
            >
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={es}
                    disabled={(date) => isBefore(date, startOfDay(today))}
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Select
                disabled={!date || availableStartTimes.length === 0}
                value={startTime?.toISOString()}
                onValueChange={(value) => setStartTime(new Date(value))}
              >
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue placeholder="Selecciona hora de inicio">
                    {startTime ? format(startTime, "h:mm a") : "Selecciona hora de inicio"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableStartTimes.map((slot, index) => (
                    <SelectItem
                      key={index}
                      value={slot.time.toISOString()}
                      disabled={!slot.available || slot.isPast}
                      className={!slot.available || slot.isPast ? "opacity-50" : ""}
                    >
                      {format(slot.time, "h:mm a")}
                      {!slot.available && " (No disponible)"}
                      {slot.isPast && " (Hora pasada)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="endTime">Hora de Finalización</Label>
              <Select
                disabled={!startTime || availableEndTimes.length === 0}
                value={endTime?.toISOString()}
                onValueChange={(value) => setEndTime(new Date(value))}
              >
                <SelectTrigger id="endTime" className="w-full">
                  <SelectValue placeholder="Selecciona hora de finalización">
                    {endTime ? format(endTime, "h:mm a") : "Selecciona hora de finalización"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableEndTimes.map((slot, index) => (
                    <SelectItem
                      key={index}
                      value={slot.time.toISOString()}
                      disabled={!slot.available || slot.isPast}
                      className={!slot.available || slot.isPast ? "opacity-50" : ""}
                    >
                      {format(slot.time, "h:mm a")}
                      {!slot.available && " (No disponible)"}
                      {slot.isPast && " (Hora pasada)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Máximo 6 horas, debe terminar el mismo día</p>
            </motion.div>
          </CardContent>
          <CardFooter>
            <AnimatedButton
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading || !date || !startTime || !endTime}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? "Guardando..." : initialData ? "Actualizar Reserva" : "Crear Reserva"}
            </AnimatedButton>
          </CardFooter>
        </form>
        <ReservationSuccessDialog
          open={showSuccessDialog}
          onOpenChange={handleSuccessDialogClose}
          reservation={createdReservation}
          cancellationCode={generatedCode}
        />
      </Card>
    </motion.div>
  )
}
