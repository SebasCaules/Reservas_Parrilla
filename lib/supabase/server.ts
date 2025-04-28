import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"
import { cache } from "react"

// Usar cache() para evitar múltiples instancias pero permitir revalidación
export const createServerSupabaseClient = cache(() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("La variable de entorno NEXT_PUBLIC_SUPABASE_URL no está definida")
  }

  if (!supabaseKey) {
    throw new Error("Las variables de entorno SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY no están definidas")
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
