export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cat_colonies: {
        Row: {
          address: string | null
          approximate_count: number
          caretaker_contact: string | null
          caretaker_name: string | null
          city: string
          created_at: string
          description: string | null
          id: string
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          needs_help: boolean | null
          photos: string[] | null
          region: string
          sterilized_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          approximate_count: number
          caretaker_contact?: string | null
          caretaker_name?: string | null
          city: string
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude: number
          longitude: number
          name: string
          needs_help?: boolean | null
          photos?: string[] | null
          region: string
          sterilized_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          approximate_count?: number
          caretaker_contact?: string | null
          caretaker_name?: string | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          needs_help?: boolean | null
          photos?: string[] | null
          region?: string
          sterilized_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          city: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_approved: boolean | null
          latitude: number | null
          longitude: number | null
          photos: string[] | null
          region: string
          start_date: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          photos?: string[] | null
          region: string
          start_date: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          photos?: string[] | null
          region?: string
          start_date?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          breed: string | null
          city: string
          color: string | null
          created_at: string
          description: string | null
          found_date: string | null
          id: string
          latitude: number | null
          longitude: number | null
          lost_date: string | null
          microchip_number: string | null
          name: string
          photos: string[] | null
          region: string
          size: Database["public"]["Enums"]["pet_size"] | null
          species: Database["public"]["Enums"]["pet_species"]
          status: Database["public"]["Enums"]["pet_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          breed?: string | null
          city: string
          color?: string | null
          created_at?: string
          description?: string | null
          found_date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          lost_date?: string | null
          microchip_number?: string | null
          name: string
          photos?: string[] | null
          region: string
          size?: Database["public"]["Enums"]["pet_size"] | null
          species: Database["public"]["Enums"]["pet_species"]
          status?: Database["public"]["Enums"]["pet_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          breed?: string | null
          city?: string
          color?: string | null
          created_at?: string
          description?: string | null
          found_date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          lost_date?: string | null
          microchip_number?: string | null
          name?: string
          photos?: string[] | null
          region?: string
          size?: Database["public"]["Enums"]["pet_size"] | null
          species?: Database["public"]["Enums"]["pet_species"]
          status?: Database["public"]["Enums"]["pet_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean | null
          region: string | null
          reputation_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          region?: string | null
          reputation_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          region?: string | null
          reputation_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      report_flags: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_flags_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_helpers: {
        Row: {
          created_at: string
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_helpers_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          address: string | null
          city: string
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          pet_id: string | null
          photos: string[] | null
          region: string
          resolved_at: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          pet_id?: string | null
          photos?: string[] | null
          region: string
          resolved_at?: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          pet_id?: string | null
          photos?: string[] | null
          region?: string
          resolved_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vet_clinics: {
        Row: {
          address: string
          city: string
          created_at: string
          description: string | null
          email: string | null
          has_microchip_scanner: boolean | null
          id: string
          is_24_hours: boolean | null
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          phone: string | null
          region: string
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          has_microchip_scanner?: boolean | null
          id?: string
          is_24_hours?: boolean | null
          is_verified?: boolean | null
          latitude: number
          longitude: number
          name: string
          phone?: string | null
          region: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          has_microchip_scanner?: boolean | null
          id?: string
          is_24_hours?: boolean | null
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
          region?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      event_type:
        | "adoption"
        | "sterilization"
        | "vaccination"
        | "rescue"
        | "other"
      pet_size: "tiny" | "small" | "medium" | "large" | "giant"
      pet_species:
        | "dog"
        | "cat"
        | "bird"
        | "rabbit"
        | "hamster"
        | "turtle"
        | "fish"
        | "other"
      pet_status: "safe" | "lost" | "found" | "adoption"
      report_type: "lost" | "found" | "sighting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      event_type: [
        "adoption",
        "sterilization",
        "vaccination",
        "rescue",
        "other",
      ],
      pet_size: ["tiny", "small", "medium", "large", "giant"],
      pet_species: [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "hamster",
        "turtle",
        "fish",
        "other",
      ],
      pet_status: ["safe", "lost", "found", "adoption"],
      report_type: ["lost", "found", "sighting"],
    },
  },
} as const
