import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"
import { cache } from "react"

// Usar cache() para evitar múltiples instancias pero permitir revalidación
export const createServerSupabaseClient = cache(() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan las variables de entorno de Supabase")
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    // Desactivar caché de Supabase para asegurar datos frescos
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  })
})
