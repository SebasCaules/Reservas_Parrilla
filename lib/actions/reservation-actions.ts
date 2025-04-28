"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Reservation, NewReservation } from "@/lib/types/database"

// Obtener todas las reservas
export async function getAllReservations() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").select("*").order("start_time", { ascending: false })

  if (error) {
    throw new Error(`Error al obtener las reservas: ${error.message}`)
  }

  return data || []
}

// Obtener reservas de hoy
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

// Obtener una reserva por ID
export async function getReservationById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error al obtener la reserva: ${error.message}`)
  }

  return data
}

// Crear una nueva reserva
export async function createReservation(reservation: NewReservation) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").insert(reservation).select().single()

  if (error) {
    throw new Error(`Error al crear la reserva: ${error.message}`)
  }

  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return data
}

// Actualizar una reserva existente
export async function updateReservation(id: string, reservation: Partial<Reservation>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("reservations").update(reservation).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error al actualizar la reserva: ${error.message}`)
  }

  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return data
}

// Eliminar una reserva
export async function deleteReservation(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) {
    throw new Error(`Error al eliminar la reserva: ${error.message}`)
  }

  revalidatePath("/calendar")
  revalidatePath("/historial")
  revalidatePath("/")

  return { success: true }
}
