"use server"

import { createFreshSupabaseClient } from "@/lib/supabase/fresh-client"
import type { Reservation, NewReservation } from "@/lib/types/database"
import { unstable_noStore } from "next/cache"

// Función base para obtener el cliente de Supabase con manejo de errores
async function getSupabaseClient() {
  try {
    return createFreshSupabaseClient()
  } catch (error) {
    console.error("Error al crear el cliente de Supabase:", error)
    throw new Error("No se pudo conectar a la base de datos. Verifica la configuración.")
  }
}

// Obtener todas las reservas
export async function getAllReservations(): Promise<Reservation[]> {
  unstable_noStore()

  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from("reservations").select("*").order("start_time", { ascending: false })

    if (error) throw new Error(`Error al obtener las reservas: ${error.message}`)
    return data || []
  } catch (error) {
    console.error("Error en getAllReservations:", error)
    throw error
  }
}

// Obtener reservas para los próximos días
export async function getUpcomingReservations(days = 10): Promise<Reservation[]> {
  unstable_noStore()

  try {
    const supabase = await getSupabaseClient()
    const today = new Date()
    const endDate = new Date()
    endDate.setDate(today.getDate() + days)

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .gte("start_time", today.toISOString())
      .lte("start_time", endDate.toISOString())
      .order("start_time", { ascending: true })

    if (error) throw new Error(`Error al obtener las reservas próximas: ${error.message}`)
    return data || []
  } catch (error) {
    console.error("Error en getUpcomingReservations:", error)
    throw error
  }
}

// Obtener una reserva por ID
export async function getReservationById(id: string): Promise<Reservation | null> {
  unstable_noStore()

  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from("reservations").select("*").eq("id", id).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 es el código para "no se encontraron resultados"
      throw new Error(`Error al obtener la reserva: ${error.message}`)
    }

    return data || null
  } catch (error) {
    console.error("Error en getReservationById:", error)
    throw error
  }
}

// Crear una nueva reserva
export async function createReservation(reservation: NewReservation): Promise<Reservation> {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from("reservations").insert(reservation).select().single()

    if (error) throw new Error(`Error al crear la reserva: ${error.message}`)
    if (!data) throw new Error("No se pudo crear la reserva")

    return data
  } catch (error) {
    console.error("Error en createReservation:", error)
    throw error
  }
}

// Actualizar una reserva existente
export async function updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from("reservations").update(reservation).eq("id", id).select().single()

    if (error) throw new Error(`Error al actualizar la reserva: ${error.message}`)
    if (!data) throw new Error("No se pudo actualizar la reserva")

    return data
  } catch (error) {
    console.error("Error en updateReservation:", error)
    throw error
  }
}

// Eliminar una reserva
export async function deleteReservation(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from("reservations").delete().eq("id", id)

    if (error) throw new Error(`Error al eliminar la reserva: ${error.message}`)
    return { success: true }
  } catch (error) {
    console.error("Error en deleteReservation:", error)
    throw error
  }
}

// Verificar código de cancelación y eliminar reserva
export async function cancelReservationWithCode(
  id: string,
  code: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await getSupabaseClient()

    // Verificar que el código sea correcto
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("cancellation_code")
      .eq("id", id)
      .single()

    if (fetchError) throw new Error(`Error al verificar la reserva: ${fetchError.message}`)
    if (!reservation) return { success: false, message: "Reserva no encontrada" }
    if (reservation.cancellation_code !== code) return { success: false, message: "Código de cancelación incorrecto" }

    // Si el código es correcto, eliminar la reserva
    const { error: deleteError } = await supabase.from("reservations").delete().eq("id", id)

    if (deleteError) throw new Error(`Error al eliminar la reserva: ${deleteError.message}`)
    return { success: true, message: "Reserva cancelada exitosamente" }
  } catch (error) {
    console.error("Error en cancelReservationWithCode:", error)
    throw error
  }
}

// Verificar el estado de la conexión a Supabase
export async function checkConnection(): Promise<boolean> {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from("reservations").select("id").limit(1)
    return !error
  } catch (error) {
    console.error("Error al verificar la conexión:", error)
    return false
  }
}
