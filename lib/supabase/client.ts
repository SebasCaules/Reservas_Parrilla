import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClientSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("createClientSupabaseClient debe ser llamado solo en el cliente")
  }

  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variables de entorno de Supabase no definidas")
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseKey)
  return client
}
