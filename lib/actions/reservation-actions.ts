"use server"

import type { Reservation, NewReservation } from "@/lib/types/database"
import * as ReservationService from "@/lib/services/reservation-service"
import { revalidatePath } from "next/cache"

// Rutas principales para revalidar
const MAIN_ROUTES = ["/", "/calendar", "/historial", "/reserve"]

// Función para revalidar todas las rutas principales
function revalidateAllRoutes() {
  MAIN_ROUTES.forEach((path) => revalidatePath(path))
}

// Obtener todas las reservas
export async function getAllReservations() {
  return await ReservationService.getAllReservations()
}

// Obtener reservas para los próximos días
export async function getUpcomingReservations(days = 10) {
  return await ReservationService.getUpcomingReservations(days)
}

// Obtener una reserva por ID
export async function getReservationById(id: string) {
  return await ReservationService.getReservationById(id)
}

// Crear una nueva reserva
export async function createReservation(reservation: NewReservation) {
  const result = await ReservationService.createReservation(reservation)
  revalidateAllRoutes()
  return result
}

// Actualizar una reserva existente
export async function updateReservation(id: string, reservation: Partial<Reservation>) {
  const result = await ReservationService.updateReservation(id, reservation)
  revalidateAllRoutes()
  return result
}

// Eliminar una reserva
export async function deleteReservation(id: string) {
  const result = await ReservationService.deleteReservation(id)
  revalidateAllRoutes()
  return result
}

// Verificar código de cancelación y eliminar reserva
export async function cancelReservationWithCode(id: string, code: string) {
  const result = await ReservationService.cancelReservationWithCode(id, code)
  revalidateAllRoutes()
  return result
}

// Verificar el estado de la conexión
export async function checkConnection() {
  return await ReservationService.checkConnection()
}
