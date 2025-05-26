import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          created_at: string
          updated_at: string
          payment_id: string | null
          payment_status: "pending" | "completed" | "failed" | "refunded"
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          awb_code: string | null
          shipment_id: string | null
          courier_name: string | null
          tracking_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          created_at?: string
          updated_at?: string
          payment_id?: string | null
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          awb_code?: string | null
          shipment_id?: string | null
          courier_name?: string | null
          tracking_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          shipping_address?: string
          updated_at?: string
          payment_id?: string | null
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          awb_code?: string | null
          shipment_id?: string | null
          courier_name?: string | null
          tracking_url?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: number
          product_name: string
          product_price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: number
          product_name: string
          product_price: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: number
          product_name?: string
          product_price?: number
          quantity?: number
        }
      }
    }
  }
}
