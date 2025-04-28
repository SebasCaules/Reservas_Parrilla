import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// Cliente Supabase optimizado para datos frescos
export function createFreshSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan las variables de entorno de Supabase")
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        // Encabezados para evitar caché
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        // Añadir un timestamp como encabezado personalizado para evitar caché
        "X-Timestamp": new Date().getTime().toString(),
      },
    },
    // Desactivar caché de Supabase
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })
}
