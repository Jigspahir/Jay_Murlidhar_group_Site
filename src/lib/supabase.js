import { createClient } from '@supabase/supabase-js';

/**
 * JAY MURLIDHAR GROUP (JMG) — SUPABASE CLIENT FOUNDATION
 * 
 * Phase 2 Database & Auth Client Initialization.
 * 
 * SECURITY RULES:
 * - Uses only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * - NEVER commit or reference SUPABASE_SERVICE_ROLE_KEY in frontend code.
 * - All multi-company data access is protected by PostgreSQL Row Level Security (RLS).
 */

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '';


export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Helper to assert Supabase configuration before performing operations
 */
export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      '[JMG Platform] Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
}

/**
 * Creates the initialized Supabase client if credentials are present,
 * or a descriptive fallback proxy that informs developers when called.
 */
function initializeSupabaseClient() {
  if (isSupabaseConfigured) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  // Graceful fallback proxy for development and public website builds
  const missingConfigHandler = {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: new Error('Supabase credentials missing') }),
          getSession: async () => ({ data: { session: null }, error: new Error('Supabase credentials missing') }),
          signInWithPassword: async () => {
            assertSupabaseConfigured();
          },
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        };
      }
      if (prop === 'from') {
        return (table) => ({
          select: () => {
            assertSupabaseConfigured();
            return Promise.resolve({ data: [], error: new Error(`Cannot query ${table}: Supabase not configured`) });
          },
          insert: () => {
            assertSupabaseConfigured();
            return Promise.resolve({ data: null, error: new Error(`Cannot insert into ${table}: Supabase not configured`) });
          }
        });
      }
      return () => {
        assertSupabaseConfigured();
      };
    }
  };

  return new Proxy({}, missingConfigHandler);
}

export const supabase = initializeSupabaseClient();
