"use server"

import { createFreshSupabaseClient } from "@/lib/supabase/fresh-client"
import { unstable_noStore } from "next/cache"

/**
 * Verifica el estado de la conexión a Supabase sin revelar información sensible
 * @returns Un objeto con el estado de la conexión y un mensaje genérico
 */
export async function checkSupabaseConnection(): Promise<{
  isConnected: boolean
  message: string
  timestamp: string
}> {
  // Evitar caché
  unstable_noStore()

  try {
    const supabase = createFreshSupabaseClient()

    // Intentar una operación simple: obtener la hora actual del servidor
    const { data, error } = await supabase.rpc("get_server_timestamp")

    if (error) {
      console.error("Error al verificar la conexión a Supabase:", error)
      return {
        isConnected: false,
        message: "No se pudo conectar a la base de datos",
        timestamp: new Date().toISOString(),
      }
    }

    return {
      isConnected: true,
      message: "Conexión establecida correctamente",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error al verificar la conexión a Supabase:", error)
    return {
      isConnected: false,
      message: "Error al intentar conectar con la base de datos",
      timestamp: new Date().toISOString(),
    }
  }
}
