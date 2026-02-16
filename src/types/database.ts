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
            todos: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    date: string
                    status: boolean
                    priority: 'low' | 'medium' | 'high'
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    date: string
                    status?: boolean
                    priority?: 'low' | 'medium' | 'high'
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    date?: string
                    status?: boolean
                    priority?: 'low' | 'medium' | 'high'
                    created_at?: string
                }
                Relationships: []
            }
            expenses: {
                Row: {
                    id: string
                    amount: number
                    category: string
                    date: string
                    note: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    amount: number
                    category: string
                    date: string
                    note?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    amount?: number
                    category?: string
                    date?: string
                    note?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            notes: {
                Row: {
                    id: string
                    date: string
                    content: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    content: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    content?: string
                    updated_at?: string
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
