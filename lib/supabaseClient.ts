import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ''

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * Creates a server-side Supabase client.
 * If an authenticated user token is provided, requests run in the user's
 * security context respecting Row Level Security (RLS).
 * If a service-role key is configured server-side, it can be used as an administrative option,
 * but normal user operations do NOT require it.
 */
export function getSupabaseServerClient(token?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''

  if (!url) {
    throw new Error('Supabase URL missing')
  }

  // If serviceRole is explicitly available in server environment, it can be used
  if (serviceRole) {
    return createClient(url, serviceRole)
  }

  // Otherwise, use authenticated user token with anon key and RLS
  if (token && anonKey) {
    return createClient(url, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }

  if (anonKey) {
    return createClient(url, anonKey)
  }

  throw new Error('Supabase anon key missing')
}

/**
 * Validates and extracts authenticated user and JWT token from request Authorization header
 */
export async function getUserFromAuthHeader(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''

  if (!url || !anonKey) return null

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if (!token) return null

  const anonClient = createClient(url, anonKey)
  try {
    const { data, error } = await anonClient.auth.getUser(token)
    if (error || !data?.user) return null
    return { user: data.user, token }
  } catch {
    return null
  }
}

export default supabaseBrowser
