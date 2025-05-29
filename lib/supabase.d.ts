export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          user_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          total_amount: number
          status: string
          payment_status: string
          payment_method: string | null
          created_at: string
          updated_at: string
          shiprocket_order_id: string | null
          tracking_number: string | null
          invoice_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          total_amount: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
          shiprocket_order_id?: string | null
          tracking_number?: string | null
          invoice_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          shipping_address?: string
          total_amount?: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
          shiprocket_order_id?: string | null
          tracking_number?: string | null
          invoice_url?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_name: string
          product_price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_name: string
          product_price: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_name?: string
          product_price?: number
          quantity?: number
          created_at?: string
        }
      }
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
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
