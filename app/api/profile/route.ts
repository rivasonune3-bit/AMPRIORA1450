import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!supabaseUrl || !serviceRole) {
    throw new Error('Supabase server config missing')
  }
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
  try{
    const { data, error } = await anonClient.auth.getUser(token)
    if(error) return null
    return data?.user || null
  }catch(e){
    return null
  }
}

export async function POST(req: Request){
  try{
    const body = await req.json()
    const { id, full_name, onboarding, resume } = body
    if(!id) return NextResponse.json({error:'Missing id'}, {status:400})
    if(!full_name) return NextResponse.json({error:'Missing full_name'}, {status:400})
    // verify the caller is the authenticated user (prevent arbitrary upserts)
    const caller = await getUserFromAuthHeader(req)
    if(!caller) return NextResponse.json({error:'Not authenticated'}, {status:401})
    if(caller.id !== id) return NextResponse.json({error:'Forbidden'}, {status:403})

    const supabase = getSupabaseServerClient()
    
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
          ...(onboarding.resume || {})
        }
      }
    }

    if (resume) {
      mergedOnboarding.resume = {
        ...(mergedOnboarding.resume || {}),
        ...resume
      }
    }

    const payload: any = { 
      id, 
      full_name,
      onboarding: mergedOnboarding
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select('id, full_name, onboarding')

    if(error) return NextResponse.json({error: error.message}, {status:500})
    return NextResponse.json({data})
  }catch(err:any){
    return NextResponse.json({error: err.message}, {status:500})
  }
}

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  try{
    // Ensure caller is authenticated and can only access their own profile
    const caller = await getUserFromAuthHeader(req)
    if(!caller) return NextResponse.json({error: 'Not authenticated'}, {status:401})

    // If an id was provided, ensure it matches caller.id
    if(id && id !== caller.id) return NextResponse.json({error: 'Forbidden'}, {status:403})

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from('profiles').select('id, full_name, onboarding').eq('id', caller.id).maybeSingle()
    if(error) return NextResponse.json({error: error.message}, {status:500})
    return NextResponse.json({data})
  }catch(err:any){
    return NextResponse.json({exists:false, error: err.message}, {status:500})
  }
}
