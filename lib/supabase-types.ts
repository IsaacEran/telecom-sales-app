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
      customers: {
        Row: {
          id: string
          created_at: string
          name: string
          company_name: string
          email: string
          phone: string
          address: string
          is_multi_branch: boolean
          tax_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          company_name: string
          email: string
          phone: string
          address: string
          is_multi_branch?: boolean
          tax_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          company_name?: string
          email?: string
          phone?: string
          address?: string
          is_multi_branch?: boolean
          tax_id?: string | null
        }
      }
      // Add other tables here as needed
    }
  }
}