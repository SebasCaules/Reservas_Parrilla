"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidateAllRoutes } from "@/lib/utils/revalidation"
import type { Reservation, NewReservation } from "@/lib/types/database"
import { generateCancellationCode } from "@/lib/utils/reservation"
import { unstable_cache } from "next/cache"
import { RESERVATION_TAG } from "@/lib/utils/revalidation"

// Usar unstable_cache con tags para permitir revalidación selectiva
export const getAllReservations = unstable_cache(
  async () => {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("reservations").select("*").order("start_time", { ascending: false })

    if (error) {
      throw new Error(`Error al obtener las reservas: ${error.message}`)
    }

    return data || []
  },
  ["all-reservations"],
  {
    tags: [RESERVATION_TAG],
    revalidate: 0, // No almacenar en caché
  },
)

export async function getTodayReservations() {
  const supabase = createServerSupabaseClient()
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("start_time", startOfDay)
    .lte("start_time", endOfDay)
    .order("start_time", { ascending: true })

  if (error) {
    throw new Error(`Error al obtener las reservas de hoy: ${error.message}`)
  }

  return data || []
}

export async function getReservationById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error al obtener la reserva: ${error.message}`)
  }

  return data
}

export async function createReservation(reservation: NewReservation) {
  const supabase = createServerSupabaseClient()

  // Asegurarse de que haya un código de cancelación
  if (!reservation.cancellation_code) {
    reservation.cancellation_code = generateCancellationCode()
  }

  const { data, error } = await supabase.from("reservations").insert(reservation).select().single()

  if (error) {
    throw new Error(`Error al crear la reserva: ${error.message}`)
  }

  // Usar el nuevo mecanismo de revalidación
  revalidateAllRoutes()

  return data
}

export async function updateReservation(id: string, reservation: Partial<Reservation>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").update(reservation).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error al actualizar la reserva: ${error.message}`)
  }

  // Usar el nuevo mecanismo de revalidación
  revalidateAllRoutes()

  return data
}

export async function deleteReservation(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) {
    throw new Error(`Error al eliminar la reserva: ${error.message}`)
  }

  // Usar el nuevo mecanismo de revalidación
  revalidateAllRoutes()

  return { success: true }
}

export async function cancelReservationWithCode(id: string, code: string) {
  const supabase = createServerSupabaseClient()

  // Primero verificamos que el código sea correcto
  const { data: reservation, error: fetchError } = await supabase
    .from("reservations")
    .select("cancellation_code")
    .eq("id", id)
    .single()

  if (fetchError) {
    throw new Error(`Error al verificar la reserva: ${fetchError.message}`)
  }

  if (!reservation) {
    throw new Error("Reserva no encontrada")
  }

  // Verificar que el código coincida
  if (reservation.cancellation_code !== code) {
    return { success: false, message: "Código de cancelación incorrecto" }
  }

  // Si el código es correcto, eliminar la reserva
  const { error: deleteError } = await supabase.from("reservations").delete().eq("id", id)

  if (deleteError) {
    throw new Error(`Error al eliminar la reserva: ${deleteError.message}`)
  }

  // Usar el nuevo mecanismo de revalidación
  revalidateAllRoutes()

  return { success: true, message: "Reserva cancelada exitosamente" }
}
