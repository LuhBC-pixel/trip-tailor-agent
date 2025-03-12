export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      flight_search_results: {
        Row: {
          airline: string
          arrival_time: string
          cabin_class: string | null
          created_at: string | null
          currency: string | null
          data_source: string
          deep_link: string | null
          departure_date: string
          departure_time: string
          destination: string
          duration: number
          flight_number: string
          id: string
          layover_airports: string[] | null
          layovers: number | null
          origin: string
          price: number
          return_date: string | null
          search_id: string
          seats_available: number | null
        }
        Insert: {
          airline: string
          arrival_time: string
          cabin_class?: string | null
          created_at?: string | null
          currency?: string | null
          data_source: string
          deep_link?: string | null
          departure_date: string
          departure_time: string
          destination: string
          duration: number
          flight_number: string
          id?: string
          layover_airports?: string[] | null
          layovers?: number | null
          origin: string
          price: number
          return_date?: string | null
          search_id: string
          seats_available?: number | null
        }
        Update: {
          airline?: string
          arrival_time?: string
          cabin_class?: string | null
          created_at?: string | null
          currency?: string | null
          data_source?: string
          deep_link?: string | null
          departure_date?: string
          departure_time?: string
          destination?: string
          duration?: number
          flight_number?: string
          id?: string
          layover_airports?: string[] | null
          layovers?: number | null
          origin?: string
          price?: number
          return_date?: string | null
          search_id?: string
          seats_available?: number | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_triggered: string | null
          price_threshold: number
          search_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          price_threshold: number
          search_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          price_threshold?: number
          search_id?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          airline: string
          currency: string | null
          departure_date: string
          destination: string
          id: string
          origin: string
          price: number
          return_date: string | null
          timestamp: string | null
        }
        Insert: {
          airline: string
          currency?: string | null
          departure_date: string
          destination: string
          id?: string
          origin: string
          price: number
          return_date?: string | null
          timestamp?: string | null
        }
        Update: {
          airline?: string
          currency?: string | null
          departure_date?: string
          destination?: string
          id?: string
          origin?: string
          price?: number
          return_date?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      recurring_searches: {
        Row: {
          created_at: string | null
          departure_date: string
          destination: string
          id: string
          is_active: boolean | null
          last_checked: string | null
          max_price: number | null
          min_price: number | null
          origin: string
          return_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          departure_date: string
          destination: string
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          max_price?: number | null
          min_price?: number | null
          origin: string
          return_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          departure_date?: string
          destination?: string
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          max_price?: number | null
          min_price?: number | null
          origin?: string
          return_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          alert_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          alert_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          alert_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "price_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allow_layovers: boolean | null
          cabin_class: string | null
          created_at: string | null
          destination: string
          id: string
          max_budget: number | null
          max_duration: number | null
          origin: string
          preferred_airlines: string[] | null
          preferred_arrival_time: string | null
          preferred_departure_time: string | null
          trip_duration: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_layovers?: boolean | null
          cabin_class?: string | null
          created_at?: string | null
          destination: string
          id?: string
          max_budget?: number | null
          max_duration?: number | null
          origin: string
          preferred_airlines?: string[] | null
          preferred_arrival_time?: string | null
          preferred_departure_time?: string | null
          trip_duration?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_layovers?: boolean | null
          cabin_class?: string | null
          created_at?: string | null
          destination?: string
          id?: string
          max_budget?: number | null
          max_duration?: number | null
          origin?: string
          preferred_airlines?: string[] | null
          preferred_arrival_time?: string | null
          preferred_departure_time?: string | null
          trip_duration?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
