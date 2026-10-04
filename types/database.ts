export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserPath = "direct_selling" | "learn_and_earn";
export type AppRole = "student" | "client" | "ads_manager" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          college: string | null;
          city: string | null;
          skills: string[] | null;
          interests: string[] | null;
          path: UserPath | null;
          referral_code: string;
          referred_by: string | null;
          onboarding_completed: boolean;
          role: string;
          website: string | null;
          twitter: string | null;
          linkedin: string | null;
          instagram: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          referral_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: AppRole;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
        Relationships: [];
      };
      platform_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platform_settings"]["Insert"]>;
        Relationships: [];
      };
      wallets: {
        Row: {
          user_id: string;
          cash_balance_paise: number;
          points_balance: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          cash_balance_paise?: number;
          points_balance?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wallets"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          slug: string;
          description: string | null;
          status: string;
          price_paise: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["courses"]["Row"]> & {
          creator_id: string;
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_path: UserPath;
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
