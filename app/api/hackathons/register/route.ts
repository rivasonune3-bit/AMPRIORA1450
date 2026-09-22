import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!supabaseUrl || !serviceRole) throw new Error('Supabase server config missing')
  return createClient(supabaseUrl, serviceRole)
}

const getUserFromAuthHeader = async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if(!supabaseUrl || !anonKey) return null
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if(!token) return null
  const anonClient = createClient(supabaseUrl, anonKey)
  try{ const { data, error } = await anonClient.auth.getUser(token); if(error) return null; return data?.user || null }catch(e){ return null }
}

export async function POST(req: Request){
  try{
    const caller = await getUserFromAuthHeader(req)
    if(!caller) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const body = await req.json()
    const { hackathonId } = body
    if(!hackathonId) return NextResponse.json({ error: 'Missing hackathonId' }, { status: 400 })

    const supabase = getSupabaseServerClient()
    const { data: existing, error: selErr } = await supabase.from('profiles').select('onboarding, full_name').eq('id', caller.id).maybeSingle()
    if(selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })
    const onboarding = (existing?.onboarding) || {}
    const regs = onboarding.hackathonRegistrations || []
    const newReg = { id: `reg-${Date.now()}`, hackathonId, registeredAt: new Date().toISOString() }
    const updatedOnboarding = { ...(onboarding || {}), hackathonRegistrations: [...regs, newReg] }
    const payload: any = { id: caller.id, full_name: existing?.full_name || caller.email }
    payload.onboarding = updatedOnboarding
    const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
    if(error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: newReg })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
