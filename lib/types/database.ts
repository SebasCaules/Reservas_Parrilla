export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string
          name: string
          apartment_number: string
          title: string
          start_time: string
          end_time: string
          created_at: string
          cancellation_code: string
        }
        Insert: {
          id?: string
          name: string
          apartment_number: string
          title: string
          start_time: string
          end_time: string
          created_at?: string
          cancellation_code: string
        }
        Update: {
          id?: string
          name?: string
          apartment_number?: string
          title?: string
          start_time?: string
          end_time?: string
          created_at?: string
          cancellation_code?: string
        }
      }
    }
  }
}

export type Reservation = Database["public"]["Tables"]["reservations"]["Row"]
export type NewReservation = Database["public"]["Tables"]["reservations"]["Insert"]
