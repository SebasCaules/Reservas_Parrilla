"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { format, addMinutes, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Reservation } from "@/lib/types/database"
import { generateTimeSlots, isValidReservation } from "@/lib/utils/date"

// Modificar el componente para aceptar una fecha inicial y cambiar el campo de apartamento por un selector

// Actualizar la interfaz ReservationFormProps para incluir initialDate
interface ReservationFormProps {
  existingReservations: Reservation[]
  initialData?: Reservation
  initialDate?: string
}

export function ReservationForm({ existingReservations, initialData, initialDate }: ReservationFormProps) {
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || "")
  const [apartmentNumber, setApartmentNumber] = useState(initialData?.apartment_number || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  // Modificar el useState de date para usar initialDate si está disponible
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.start_time) : initialDate ? new Date(initialDate) : new Date(),
  )

  const [availableStartTimes, setAvailableStartTimes] = useState<{ time: Date; available: boolean }[]>([])
  const [availableEndTimes, setAvailableEndTimes] = useState<{ time: Date; available: boolean }[]>([])
  const [startTime, setStartTime] = useState<Date | undefined>(
    initialData ? new Date(initialData.start_time) : undefined,
  )
  const [endTime, setEndTime] = useState<Date | undefined>(initialData ? new Date(initialData.end_time) : undefined)

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

      while (currentTime <= endTimeLimit) {
        const isAvailable = !existingReservations.some((reservation) => {
          // Ignorar la reserva actual si estamos editando
          if (initialData && reservation.id === initialData.id) return false

          const reservationStart = parseISO(reservation.start_time)
          const reservationEnd = parseISO(reservation.end_time)

          return currentTime > reservationStart && currentTime <= reservationEnd
        })

        possibleEndTimes.push({
          time: new Date(currentTime),
          available: isAvailable,
        })

        currentTime = addMinutes(currentTime, 30)
      }

      setAvailableEndTimes(possibleEndTimes)
      setEndTime(undefined)
    }
  }, [startTime, date, existingReservations, initialData])

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
      if (initialData) {
        // Actualizar reserva existente
        const { error } = await supabase
          .from("reservations")
          .update({
            name,
            apartment_number: apartmentNumber,
            title,
            description,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Reserva actualizada",
          description: "Tu reserva ha sido actualizada exitosamente.",
        })
      } else {
        // Crear nueva reserva
        const { error } = await supabase.from("reservations").insert({
          name,
          apartment_number: apartmentNumber,
          title,
          description,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
        })

        if (error) throw error

        toast({
          title: "Reserva creada",
          description: "Tu reserva ha sido creada exitosamente.",
        })
      }

      router.refresh()
      router.push("/calendar")
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
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Editar Reserva" : "Nueva Reserva"}</CardTitle>
        <CardDescription>
          {initialData ? "Actualiza los detalles de tu reserva" : "Reserva la parrilla para tu evento"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tu Nombre</Label>
            <Input id="name" placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Reemplazar el campo de texto de apartamento por un selector */}
          <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento</Label>
            <Input
              id="title"
              placeholder="Asado Familiar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Detalles sobre tu evento..."
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
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
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
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
                    disabled={!slot.available}
                    className={!slot.available ? "opacity-50" : ""}
                  >
                    {format(slot.time, "h:mm a")}
                    {!slot.available && " (No disponible)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
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
                    disabled={!slot.available}
                    className={!slot.available ? "opacity-50" : ""}
                  >
                    {format(slot.time, "h:mm a")}
                    {!slot.available && " (No disponible)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Máximo 6 horas, debe terminar el mismo día</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !date || !startTime || !endTime}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar Reserva" : "Crear Reserva"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
