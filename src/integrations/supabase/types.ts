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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      available_slots: {
        Row: {
          created_at: string
          date: string
          day_name: string
          id: string
          is_active: boolean
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          day_name: string
          id?: string
          is_active?: boolean
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          day_name?: string
          id?: string
          is_active?: boolean
          time?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booked_at: string
          created_at: string
          date: string
          expert_name: string | null
          id: string
          session_completed: boolean
          session_link: string | null
          time: string
          user_id: string
        }
        Insert: {
          booked_at?: string
          created_at?: string
          date: string
          expert_name?: string | null
          id?: string
          session_completed?: boolean
          session_link?: string | null
          time: string
          user_id: string
        }
        Update: {
          booked_at?: string
          created_at?: string
          date?: string
          expert_name?: string | null
          id?: string
          session_completed?: boolean
          session_link?: string | null
          time?: string
          user_id?: string
        }
        Relationships: []
      }
      discount_code_usages: {
        Row: {
          code_id: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_code_usages_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_percent: number
          id: string
          is_active: boolean
          max_uses: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Relationships: []
      }
      exam_results: {
        Row: {
          answers: Json
          axis_passed: Json
          axis_scores: Json
          completed_at: string
          created_at: string
          id: string
          passed: boolean
          performance_level: string
          total_score: number
          user_id: string
        }
        Insert: {
          answers?: Json
          axis_passed?: Json
          axis_scores?: Json
          completed_at?: string
          created_at?: string
          id?: string
          passed: boolean
          performance_level: string
          total_score: number
          user_id: string
        }
        Update: {
          answers?: Json
          axis_passed?: Json
          axis_scores?: Json
          completed_at?: string
          created_at?: string
          id?: string
          passed?: boolean
          performance_level?: string
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          financial_dept_size: string | null
          id: string
          job_title: string | null
          manager_email: string | null
          manager_name: string | null
          manager_phone: string | null
          name: string
          nda_accepted: boolean
          payment_status: boolean
          phone: string | null
          receipt_url: string | null
          sector: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          financial_dept_size?: string | null
          id?: string
          job_title?: string | null
          manager_email?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          name: string
          nda_accepted?: boolean
          payment_status?: boolean
          phone?: string | null
          receipt_url?: string | null
          sector?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          financial_dept_size?: string | null
          id?: string
          job_title?: string | null
          manager_email?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          name?: string
          nda_accepted?: boolean
          payment_status?: boolean
          phone?: string | null
          receipt_url?: string | null
          sector?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      notify_admins: {
        Args: { p_message: string; p_title: string }
        Returns: undefined
      }
      notify_user: {
        Args: { p_message: string; p_title: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
