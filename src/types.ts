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
          Category: string | null
          id: number
          image_src: string | null
          Link: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          abstract?: string | null
          author?: string | null
          Category?: string | null
          id?: never
          image_src?: string | null
          Link?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          abstract?: string | null
          author?: string | null
          Category?: string | null
          id?: never
          image_src?: string | null
          Link?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          paper_id: number | null
          user_id: string
          vote: number | null
        }
        Insert: {
          paper_id?: number | null
          user_id: string
          vote?: number | null
        }
        Update: {
          paper_id?: number | null
          user_id?: string
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