import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase"

// Simple singleton pattern with better error handling
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")

    // Return a mock client that throws helpful errors
    return {
      auth: {
        signInWithPassword: () =>
          Promise.reject(
            new Error(
              "Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        signUp: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        resetPasswordForEmail: () => Promise.reject(new Error("Supabase not configured")),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      }),
    } as any
  }

  try {
    // Validate URL format
    new URL(supabaseUrl)

    // Create the Supabase client with minimal configuration
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable to prevent URL parsing issues
      },
    })

    return supabaseClient
  } catch (error) {
    console.error("Failed to create Supabase client:", error)

    // Return mock client on error
    return {
      auth: {
        signInWithPassword: () =>
          Promise.reject(new Error("Supabase configuration error. Please check your environment variables.")),
        signUp: () => Promise.reject(new Error("Supabase configuration error")),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        resetPasswordForEmail: () => Promise.reject(new Error("Supabase configuration error")),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      }),
    } as any
  }
}

export const supabase = getSupabaseClient()
