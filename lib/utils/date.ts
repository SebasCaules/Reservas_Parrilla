import { format, parseISO, isWithinInterval, isSameDay, differenceInHours, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import type { Reservation } from "../types/database"

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "d 'de' MMMM, yyyy", { locale: es })
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "h:mm a")
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "d 'de' MMMM, yyyy h:mm a", { locale: es })
}

export function isTimeSlotAvailable(startTime: Date, endTime: Date, reservations: Reservation[]): boolean {
  return !reservations.some((reservation) => {
    const reservationStart = parseISO(reservation.start_time)
    const reservationEnd = parseISO(reservation.end_time)

    return (
      isWithinInterval(startTime, { start: reservationStart, end: reservationEnd }) ||
      isWithinInterval(endTime, { start: reservationStart, end: reservationEnd }) ||
      isWithinInterval(reservationStart, { start: startTime, end: endTime }) ||
      isWithinInterval(reservationEnd, { start: startTime, end: endTime })
    )
  })
}

export function generateTimeSlots(
  date: Date,
  reservations: Reservation[],
): {
  time: Date
  available: boolean
  isPast: boolean
}[] {
  const slots = []
  const startHour = 8 // 8 AM
  const endHour = 22 // 10 PM
  const slotInterval = 30 // 30 minutes

  const baseDate = new Date(date)
  baseDate.setHours(0, 0, 0, 0)

  // Filtrar reservas solo para el día seleccionado
  const dayReservations = reservations.filter((reservation) => isSameDay(parseISO(reservation.start_time), date))

  // Obtener la hora actual para deshabilitar slots pasados
  const now = new Date()

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotTime = new Date(baseDate)
      slotTime.setHours(hour, minute, 0, 0)

      // Verificar si este horario está disponible
      const isAvailable = !dayReservations.some((reservation) => {
        const reservationStart = parseISO(reservation.start_time)
        const reservationEnd = parseISO(reservation.end_time)
        return slotTime >= reservationStart && slotTime < reservationEnd
      })

      // Verificar si el horario ya pasó
      const isPast = isBefore(slotTime, now)

      slots.push({
        time: slotTime,
        available: isAvailable,
        isPast: isPast,
      })
    }
  }

  return slots
}

export function isValidReservation(startTime: Date, endTime: Date): { valid: boolean; message?: string } {
  // Verificar que la reserva no sea de más de 6 horas
  const hoursDiff = differenceInHours(endTime, startTime)
  if (hoursDiff > 6) {
    return { valid: false, message: "La reserva no puede ser de más de 6 horas" }
  }

  // Verificar que la reserva no pase a otro día
  if (!isSameDay(startTime, endTime)) {
    return { valid: false, message: "La reserva debe comenzar y terminar el mismo día" }
  }

  // Verificar que la hora de fin sea posterior a la hora de inicio
  if (endTime <= startTime) {
    return { valid: false, message: "La hora de finalización debe ser posterior a la hora de inicio" }
  }

  // Verificar que la reserva no sea para una fecha/hora pasada
  const now = new Date()
  if (isBefore(startTime, now)) {
    return { valid: false, message: "No se pueden hacer reservas para fechas u horas pasadas" }
  }

  return { valid: true }
}

export function isPastReservation(reservation: Reservation): boolean {
  const now = new Date()
  const endTime = parseISO(reservation.end_time)
  return isBefore(endTime, now)
}
