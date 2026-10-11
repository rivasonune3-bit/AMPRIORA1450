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

export async function POST(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req)
    if (!caller) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { targetUserId } = await req.json()
    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 })
    }

    // Pair ID prevents duplicate conversations between the same two users
    const conversationId = [caller.id, targetUserId].sort().join('_')

    const supabase = getSupabaseServerClient()

    // Fetch caller & target user profiles
    const { data: rawProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .in('id', [caller.id, targetUserId])

    const profilesList: any[] = (rawProfiles as any[]) || []
    const targetProfile = profilesList.find((p: any) => p.id === targetUserId)

    if (!targetProfile) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    const callerProfile = profilesList.find((p: any) => p.id === caller.id)

    // Ensure conversation exists in caller's profile onboarding.conversations
    const onboarding = callerProfile?.onboarding || {}
    const conversations = { ...(onboarding.conversations || {}) }

    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        id: conversationId,
        participants: [caller.id, targetUserId],
        messages: []
      }

      await supabase.from('profiles').upsert({
        id: caller.id,
        full_name: callerProfile?.full_name || caller.email || 'AMPRIORA Member',
        onboarding: {
          ...onboarding,
          conversations
        }
      }, { onConflict: 'id' })
    }

    const targetOnboarding = targetProfile.onboarding || {}
    const targetConvs = { ...(targetOnboarding.conversations || {}) }

    if (!targetConvs[conversationId]) {
      targetConvs[conversationId] = {
        id: conversationId,
        participants: [caller.id, targetUserId],
        messages: []
      }

      await supabase.from('profiles').upsert({
        id: targetProfile.id,
        full_name: targetProfile.full_name,
        onboarding: {
          ...targetOnboarding,
          conversations: targetConvs
        }
      }, { onConflict: 'id' })
    }

    return NextResponse.json({
      conversationId,
      participant: {
        id: targetProfile.id,
        name: targetProfile.full_name || 'AMPRIORA Member',
        avatar: targetOnboarding.avatar || '',
        title: targetOnboarding.targetRole || targetOnboarding.careerGoal || 'Software Engineer',
        college: targetOnboarding.education || targetOnboarding.branch || 'Student Developer'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
