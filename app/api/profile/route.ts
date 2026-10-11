import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getUserFromAuthHeader } from '../../../lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, full_name, onboarding, resume } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    if (!full_name) return NextResponse.json({ error: 'Missing full_name' }, { status: 400 })

    // Verify the caller is the authenticated user (prevent arbitrary upserts)
    const authData = await getUserFromAuthHeader(req)
    if (!authData) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const { user: caller, token } = authData
    if (caller.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const supabase = getSupabaseServerClient(token)

    // Fetch existing profile to ensure deep onboarding preservation
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('onboarding')
      .eq('id', id)
      .maybeSingle()

    const existingOnboarding = existingProfile?.onboarding || {}
    let mergedOnboarding = { ...existingOnboarding }

    if (onboarding) {
      mergedOnboarding = {
        ...mergedOnboarding,
        ...onboarding,
        resume: {
          ...(mergedOnboarding.resume || {}),
          ...(onboarding.resume || {}),
        },
      }
    }

    if (resume) {
      mergedOnboarding.resume = {
        ...(mergedOnboarding.resume || {}),
        ...resume,
      }
    }

    const payload: any = {
      id,
      full_name,
      onboarding: mergedOnboarding,
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select('id, full_name, onboarding')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  try {
    // Ensure caller is authenticated and can only access their own profile
    const authData = await getUserFromAuthHeader(req)
    if (!authData) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const { user: caller, token } = authData

    // If an id was provided, ensure it matches caller.id
    if (id && id !== caller.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const supabase = getSupabaseServerClient(token)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .eq('id', caller.id)
      .maybeSingle()

    if (error) {
      // If table is missing or query fails, return a safe fallback profile for the authenticated caller
      const fallbackName = caller.user_metadata?.full_name || caller.email?.split('@')[0] || 'Member'
      return NextResponse.json({
        data: {
          id: caller.id,
          full_name: fallbackName,
          onboarding: {},
        },
        warning: error.message,
      })
    }

    if (!data) {
      // Authenticated user exists in Auth, but has not yet created a record in 'profiles'
      const defaultName = caller.user_metadata?.full_name || caller.email?.split('@')[0] || 'Member'
      return NextResponse.json({
        data: {
          id: caller.id,
          full_name: defaultName,
          onboarding: {},
        },
      })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 })
  }
}
