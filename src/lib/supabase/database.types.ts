export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: number;
          meta: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: never;
          meta?: NonNullable<Json>;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: never;
          meta?: NonNullable<Json>;
        };
        Relationships: [];
      };
      buyer_requests: {
        Row: {
          budget_max: number | null;
          budget_min: number | null;
          consent_at: string;
          consent_version: string;
          contact: string;
          created_at: string;
          crm_status: Database["public"]["Enums"]["crm_status"];
          detail: string | null;
          district: string | null;
          id: string;
          ip_hash: string | null;
          min_rai: number | null;
          name: string;
          preferred_zone: string | null;
          purpose: string | null;
          road_need: string | null;
          target_property_id: string | null;
          updated_at: string;
          utility_need: string | null;
        };
        ComputedFields: never;
        Insert: {
          budget_max?: number | null;
          budget_min?: number | null;
          consent_at: string;
          consent_version: string;
          contact: string;
          created_at?: string;
          crm_status?: Database["public"]["Enums"]["crm_status"];
          detail?: string | null;
          district?: string | null;
          id?: string;
          ip_hash?: string | null;
          min_rai?: number | null;
          name: string;
          preferred_zone?: string | null;
          purpose?: string | null;
          road_need?: string | null;
          target_property_id?: string | null;
          updated_at?: string;
          utility_need?: string | null;
        };
        Update: {
          budget_max?: number | null;
          budget_min?: number | null;
          consent_at?: string;
          consent_version?: string;
          contact?: string;
          created_at?: string;
          crm_status?: Database["public"]["Enums"]["crm_status"];
          detail?: string | null;
          district?: string | null;
          id?: string;
          ip_hash?: string | null;
          min_rai?: number | null;
          name?: string;
          preferred_zone?: string | null;
          purpose?: string | null;
          road_need?: string | null;
          target_property_id?: string | null;
          updated_at?: string;
          utility_need?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buyer_requests_district_fkey";
            columns: ["district"];
            isOneToOne: false;
            referencedRelation: "districts";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "buyer_requests_target_property_id_fkey";
            columns: ["target_property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      crm_events: {
        Row: {
          actor_id: string | null;
          created_at: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["crm_entity"];
          from_status: string | null;
          id: number;
          note: string | null;
          to_status: string;
        };
        ComputedFields: never;
        Insert: {
          actor_id?: string | null;
          created_at?: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["crm_entity"];
          from_status?: string | null;
          id?: never;
          note?: string | null;
          to_status: string;
        };
        Update: {
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["crm_entity"];
          from_status?: string | null;
          id?: never;
          note?: string | null;
          to_status?: string;
        };
        Relationships: [];
      };
      districts: {
        Row: {
          center_lat: number;
          center_lon: number;
          name_en: string;
          name_th: string;
          slug: string;
        };
        ComputedFields: never;
        Insert: {
          center_lat: number;
          center_lon: number;
          name_en: string;
          name_th: string;
          slug: string;
        };
        Update: {
          center_lat?: number;
          center_lon?: number;
          name_en?: string;
          name_th?: string;
          slug?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          consent_at: string;
          consent_version: string;
          contact: string;
          created_at: string;
          crm_status: Database["public"]["Enums"]["crm_status"];
          id: string;
          ip_hash: string | null;
          message: string | null;
          name: string;
          property_id: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          consent_at: string;
          consent_version: string;
          contact: string;
          created_at?: string;
          crm_status?: Database["public"]["Enums"]["crm_status"];
          id?: string;
          ip_hash?: string | null;
          message?: string | null;
          name: string;
          property_id?: string | null;
          updated_at?: string;
        };
        Update: {
          consent_at?: string;
          consent_version?: string;
          contact?: string;
          created_at?: string;
          crm_status?: Database["public"]["Enums"]["crm_status"];
          id?: string;
          ip_hash?: string | null;
          message?: string | null;
          name?: string;
          property_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      poi: {
        Row: {
          id: number;
          kind: string;
          lat: number;
          lon: number;
          name_en: string;
          name_th: string;
        };
        ComputedFields: never;
        Insert: {
          id?: never;
          kind: string;
          lat: number;
          lon: number;
          name_en: string;
          name_th: string;
        };
        Update: {
          id?: never;
          kind?: string;
          lat?: number;
          lon?: number;
          name_en?: string;
          name_th?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          code: string | null;
          created_at: string;
          deed_type: string | null;
          district: string;
          frontage_en: string | null;
          frontage_th: string | null;
          highlights_en: string[];
          highlights_th: string[];
          id: string;
          listing_status: Database["public"]["Enums"]["listing_status"];
          ngan: number;
          price: number;
          published_at: string | null;
          rai: number;
          road_en: string | null;
          road_th: string | null;
          slug: string | null;
          state: Database["public"]["Enums"]["property_state"];
          subdistrict: string | null;
          tags: string[];
          title_en: string | null;
          title_th: string;
          total_wah: number | null;
          type: Database["public"]["Enums"]["property_type"];
          updated_at: string;
          utilities_en: string | null;
          utilities_th: string | null;
          wah: number;
          zone_en: string | null;
          zone_lat: number | null;
          zone_lon: number | null;
          zone_radius_m: number;
          zone_th: string;
        };
        ComputedFields: never;
        Insert: {
          code?: string | null;
          created_at?: string;
          deed_type?: string | null;
          district: string;
          frontage_en?: string | null;
          frontage_th?: string | null;
          highlights_en?: string[];
          highlights_th?: string[];
          id?: string;
          listing_status?: Database["public"]["Enums"]["listing_status"];
          ngan?: number;
          price: number;
          published_at?: string | null;
          rai?: number;
          road_en?: string | null;
          road_th?: string | null;
          slug?: string | null;
          state?: Database["public"]["Enums"]["property_state"];
          subdistrict?: string | null;
          tags?: string[];
          title_en?: string | null;
          title_th: string;
          total_wah?: never;
          type: Database["public"]["Enums"]["property_type"];
          updated_at?: string;
          utilities_en?: string | null;
          utilities_th?: string | null;
          wah?: number;
          zone_en?: string | null;
          zone_lat?: number | null;
          zone_lon?: number | null;
          zone_radius_m?: number;
          zone_th: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          deed_type?: string | null;
          district?: string;
          frontage_en?: string | null;
          frontage_th?: string | null;
          highlights_en?: string[];
          highlights_th?: string[];
          id?: string;
          listing_status?: Database["public"]["Enums"]["listing_status"];
          ngan?: number;
          price?: number;
          published_at?: string | null;
          rai?: number;
          road_en?: string | null;
          road_th?: string | null;
          slug?: string | null;
          state?: Database["public"]["Enums"]["property_state"];
          subdistrict?: string | null;
          tags?: string[];
          title_en?: string | null;
          title_th?: string;
          total_wah?: never;
          type?: Database["public"]["Enums"]["property_type"];
          updated_at?: string;
          utilities_en?: string | null;
          utilities_th?: string | null;
          wah?: number;
          zone_en?: string | null;
          zone_lat?: number | null;
          zone_lon?: number | null;
          zone_radius_m?: number;
          zone_th?: string;
        };
        Relationships: [
          {
            foreignKeyName: "properties_district_fkey";
            columns: ["district"];
            isOneToOne: false;
            referencedRelation: "districts";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "properties_district_subdistrict_fkey";
            columns: ["district", "subdistrict"];
            isOneToOne: false;
            referencedRelation: "subdistricts";
            referencedColumns: ["district_slug", "slug"];
          },
        ];
      };
      property_photos: {
        Row: {
          alt_en: string | null;
          alt_th: string | null;
          created_at: string;
          id: string;
          is_cover: boolean;
          property_id: string;
          sort_order: number;
          storage_path: string;
        };
        ComputedFields: never;
        Insert: {
          alt_en?: string | null;
          alt_th?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          property_id: string;
          sort_order?: number;
          storage_path: string;
        };
        Update: {
          alt_en?: string | null;
          alt_th?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          property_id?: string;
          sort_order?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      property_private: {
        Row: {
          admin_note: string | null;
          consent_at: string | null;
          consent_version: string | null;
          created_at: string;
          deed_number: string | null;
          encumbrance: string | null;
          exact_lat: number | null;
          exact_lon: number | null;
          ip_hash: string | null;
          owner_contact: string | null;
          owner_name: string | null;
          property_id: string;
        };
        ComputedFields: never;
        Insert: {
          admin_note?: string | null;
          consent_at?: string | null;
          consent_version?: string | null;
          created_at?: string;
          deed_number?: string | null;
          encumbrance?: string | null;
          exact_lat?: number | null;
          exact_lon?: number | null;
          ip_hash?: string | null;
          owner_contact?: string | null;
          owner_name?: string | null;
          property_id: string;
        };
        Update: {
          admin_note?: string | null;
          consent_at?: string | null;
          consent_version?: string | null;
          created_at?: string;
          deed_number?: string | null;
          encumbrance?: string | null;
          exact_lat?: number | null;
          exact_lon?: number | null;
          ip_hash?: string | null;
          owner_contact?: string | null;
          owner_name?: string | null;
          property_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_private_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      subdistricts: {
        Row: {
          district_slug: string;
          name_en: string;
          name_th: string;
          slug: string;
        };
        ComputedFields: never;
        Insert: {
          district_slug: string;
          name_en: string;
          name_th: string;
          slug: string;
        };
        Update: {
          district_slug?: string;
          name_en?: string;
          name_th?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subdistricts_district_slug_fkey";
            columns: ["district_slug"];
            isOneToOne: false;
            referencedRelation: "districts";
            referencedColumns: ["slug"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      crm_entity: "lead" | "buyer_request" | "property";
      crm_status: "new" | "contacted" | "viewing" | "negotiating" | "won" | "cancelled";
      listing_status: "available" | "viewing" | "offers";
      property_state: "pending" | "approved" | "rejected" | "sold" | "archived";
      property_type: "land" | "house" | "orchard" | "commercial" | "resort" | "farm";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      crm_entity: ["lead", "buyer_request", "property"],
      crm_status: ["new", "contacted", "viewing", "negotiating", "won", "cancelled"],
      listing_status: ["available", "viewing", "offers"],
      property_state: ["pending", "approved", "rejected", "sold", "archived"],
      property_type: ["land", "house", "orchard", "commercial", "resort", "farm"],
    },
  },
} as const;
