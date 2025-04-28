"use server"

import { createFreshSupabaseClient } from "@/lib/supabase/fresh-client"
import type { Reservation } from "@/lib/types/database"
import { unstable_noStore } from "next/cache"

// Función para obtener todas las reservas en tiempo real
export async function getRealTimeReservations(): Promise<Reservation[]> {
  // Desactivar explícitamente el almacenamiento en caché
  unstable_noStore()

  const supabase = createFreshSupabaseClient()

  // Usar un enfoque diferente para evitar la caché
  // En lugar de usar una columna inexistente, simplemente hacemos la consulta
  // y confiamos en unstable_noStore() y los encabezados para evitar la caché
  const { data, error } = await supabase.from("reservations").select("*").order("start_time", { ascending: false })

  if (error) {
    console.error("Error al obtener reservas en tiempo real:", error)
    throw new Error(`Error al obtener las reservas: ${error.message}`)
  }

  return data || []
}

// Función para obtener reservas para los próximos días en tiempo real
export async function getUpcomingRealTimeReservations(days = 10): Promise<Reservation[]> {
  // Desactivar explícitamente el almacenamiento en caché
  unstable_noStore()

  const supabase = createFreshSupabaseClient()

  // Calcular fechas
  const today = new Date()
  const endDate = new Date()
  endDate.setDate(today.getDate() + days)

  // Usar un enfoque diferente para evitar la caché
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("start_time", today.toISOString())
    .lte("start_time", endDate.toISOString())
    .order("start_time", { ascending: true })

  if (error) {
    console.error("Error al obtener reservas próximas en tiempo real:", error)
    throw new Error(`Error al obtener las reservas próximas: ${error.message}`)
  }

  return data || []
}
