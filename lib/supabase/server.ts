import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

export function createServerSupabaseClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}
