import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRole) {
    throw new Error('Supabase server config missing')
  }
  return createClient(supabaseUrl, serviceRole)
}

const getUserFromAuthHeader = async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return null
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if (!token) return null
  const anonClient = createClient(supabaseUrl, anonKey)
  try {
    const { data, error } = await anonClient.auth.getUser(token)
    if (error) return null
    return data?.user || null
  } catch (e) {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req)
    if (!caller) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase().trim()

    const supabase = getSupabaseServerClient()
    const { data: rawProfiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const profilesList: any[] = (rawProfiles as any[]) || []

    const users = profilesList
      .filter((p: any) => p.id !== caller.id)
      .map((p: any) => {
        const onboarding = p.onboarding || {}
        return {
          id: p.id,
          name: p.full_name || 'AMPRIORA Member',
          avatar: onboarding.avatar || '',
          title: onboarding.targetRole || onboarding.careerGoal || 'Software Engineer',
          college: onboarding.education || onboarding.branch || 'Student Developer',
          location: onboarding.location || 'India'
        }
      })
      .filter((u: any) => {
        if (!q) return true
        const matchName = u.name.toLowerCase().includes(q)
        const matchTitle = u.title.toLowerCase().includes(q)
        const matchCollege = u.college.toLowerCase().includes(q)
        return matchName || matchTitle || matchCollege
      })

    return NextResponse.json({ users })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
