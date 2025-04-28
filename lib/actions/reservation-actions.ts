"use server"

import { revalidatePath } from "next/cache"
import type { Reservation, NewReservation } from "@/lib/types/database"
import * as ReservationService from "@/lib/services/reservation-service"

// Obtener todas las reservas
export async function getAllReservations() {
  return await ReservationService.getAllReservations()
}

// Obtener reservas de hoy
export async function getTodayReservations() {
  return await ReservationService.getTodayReservations()
}

// Obtener una reserva por ID
export async function getReservationById(id: string) {
  return await ReservationService.getReservationById(id)
}

// Crear una nueva reserva
export async function createReservation(reservation: NewReservation) {
  const result = await ReservationService.createReservation(reservation)

  // Revalidar rutas relevantes
  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return result
}

// Actualizar una reserva existente
export async function updateReservation(id: string, reservation: Partial<Reservation>) {
  const result = await ReservationService.updateReservation(id, reservation)

  // Revalidar rutas relevantes
  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return result
}

// Eliminar una reserva
export async function deleteReservation(id: string) {
  const result = await ReservationService.deleteReservation(id)

  // Revalidar rutas relevantes
  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return result
}

// Verificar código de cancelación y eliminar reserva
export async function cancelReservationWithCode(id: string, code: string) {
  const result = await ReservationService.cancelReservationWithCode(id, code)

  // Revalidar rutas relevantes
  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return result
}
