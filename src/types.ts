export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      papers: {
        Row: {
          abstract: string | null
          author: string | null
          id: number
          title: string | null
          votes: number | null
        }
        Insert: {
          abstract?: string | null
          author?: string | null
          id?: never
          title?: string | null
          votes?: number | null
        }
        Update: {
          abstract?: string | null
          author?: string | null
          id?: never
          title?: string | null
          votes?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          email?: string | null
          id?: never
          name?: string | null
        }
        Update: {
          email?: string | null
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: number
          paper_id: number | null
          user_id: number | null
          vote: number | null
        }
        Insert: {
          id?: never
          paper_id?: number | null
          user_id?: number | null
          vote?: number | null
        }
        Update: {
          id?: never
          paper_id?: number | null
          user_id?: number | null
          vote?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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