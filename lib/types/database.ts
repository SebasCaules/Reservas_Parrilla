export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string
          user_id: string | null
          name: string
          apartment_number: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          apartment_number: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          apartment_number?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
    }
  }
}

export type Reservation = Database["public"]["Tables"]["reservations"]["Row"]
export type NewReservation = Database["public"]["Tables"]["reservations"]["Insert"]
