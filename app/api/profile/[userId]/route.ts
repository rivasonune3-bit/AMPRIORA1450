import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '../../../../lib/supabaseClient'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
    const supabase = getSupabaseServerClient(token)
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!profileData) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Extract public fields only (Security & RLS)
    const onboarding = profileData.onboarding || {}
    const publicProfile = {
      id: profileData.id,
      fullName: profileData.full_name || 'AMPRIORA Member',
      avatar: onboarding.avatar || '',
      banner: onboarding.banner || '',
      education: onboarding.education || '',
      branch: onboarding.branch || '',
      year: onboarding.year || '',
      targetRole: onboarding.targetRole || onboarding.careerGoal || 'Software Engineer',
      location: onboarding.location || 'India',
      about: onboarding.about || onboarding.bio || '',
      skills: onboarding.skills || [],
      experiences: onboarding.experiences || [],
      projects: onboarding.projects || onboarding.resume?.projects || [],
      educationHistory: onboarding.educationHistory || [],
      certifications: onboarding.certifications || [],
      badges: onboarding.badges || [],
      linkedin: onboarding.linkedin || '',
      github: onboarding.github || '',
      portfolio: onboarding.portfolio || '',
      dreamCompany: onboarding.dreamCompany || '',
      careerGoal: onboarding.careerGoal || onboarding.targetRole || '',
      posts: onboarding.posts || []
    }

    return NextResponse.json({ profile: publicProfile })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
