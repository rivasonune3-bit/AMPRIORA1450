import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !serviceRole) {
    throw new Error('Supabase service role config missing')
  }
  return createClient(supabaseUrl, serviceRole)
}

async function getUserFromAuthHeader(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !anonKey) return null

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if (!token) return null

  const anonClient = createClient(supabaseUrl, anonKey)
  try {
    const { data, error } = await anonClient.auth.getUser(token)
    if (error || !data?.user) return null
    return data.user
  } catch (e) {
    return null
  }
}

export async function GET(req: Request) {
  try {
    // 1. Authenticate caller
    const caller = await getUserFromAuthHeader(req)
    if (!caller) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to access the Admin Dashboard.' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseServerClient()

    // 2. Fetch caller's profile to check authorization
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('onboarding')
      .eq('id', caller.id)
      .maybeSingle()

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    const isExplicitAdmin = callerProfile?.onboarding?.isAdmin === true || (caller.email && adminEmails.includes(caller.email.toLowerCase()))
    
    // Security check: If ADMIN_EMAILS or explicit flags are set, enforce strict check
    if (adminEmails.length > 0 && !isExplicitAdmin) {
      return NextResponse.json(
        { error: 'Access denied. You do not have administrator privileges.' },
        { status: 403 }
      )
    }

    // 3. Fetch real Supabase Auth users using service role client
    const { data: authUsersData, error: authUsersErr } = await supabase.auth.admin.listUsers()

    if (authUsersErr) {
      return NextResponse.json({ error: authUsersErr.message || 'Failed to list Auth users' }, { status: 500 })
    }

    const authUsers = authUsersData?.users || []

    // 4. Fetch real profiles from profiles table
    const { data: rawProfiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('*')

    if (profilesErr) {
      console.warn('Warning fetching profiles table:', profilesErr.message)
    }

    const profilesMap = new Map<string, any>()
    if (Array.isArray(rawProfiles)) {
      rawProfiles.forEach(p => {
        if (p.id) profilesMap.set(p.id, p)
      })
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000

    let completedProfilesCount = 0

    // 5. Build list of real users combined from Auth & Profiles table
    const formattedUsers = authUsers.map(user => {
      const profile = profilesMap.get(user.id)
      const onboarding = profile?.onboarding || {}

      const fullName = profile?.full_name || onboarding?.fullName || onboarding?.name || user.user_metadata?.full_name || 'Not provided'
      const college = onboarding?.college || onboarding?.education || onboarding?.branch || 'Not provided'
      const careerGoal = onboarding?.targetRole || onboarding?.careerGoal || 'Not provided'
      const dreamCompany = onboarding?.dreamCompany || 'Not provided'

      // Calculate profile completion percentage deterministically
      const completionChecks = [
        Boolean(fullName && fullName !== 'Not provided'),
        Boolean(onboarding?.college || onboarding?.education),
        Boolean(onboarding?.targetRole || onboarding?.careerGoal),
        Boolean(onboarding?.dreamCompany),
        Array.isArray(onboarding?.skills) && onboarding.skills.length > 0,
        Array.isArray(onboarding?.projects) && onboarding.projects.length > 0,
        Boolean(onboarding?.github || onboarding?.linkedin),
        Boolean(onboarding?.completed)
      ]
      const metCount = completionChecks.filter(Boolean).length
      const completionPercentage = Math.round((metCount / completionChecks.length) * 100)

      if (onboarding?.completed || completionPercentage >= 60) {
        completedProfilesCount++
      }

      const createdAtTime = user.created_at ? new Date(user.created_at).getTime() : 0

      return {
        id: user.id,
        email: user.email || 'Not provided',
        fullName,
        college,
        year: onboarding?.year || 'Not provided',
        education: onboarding?.education || college,
        careerGoal,
        dreamCompany,
        profileCompletion: completionPercentage,
        isCompleted: Boolean(onboarding?.completed || completionPercentage >= 60),
        signupDate: user.created_at || new Date().toISOString(),
        createdAtTime,
        emailVerified: Boolean(user.email_confirmed_at),
        accountStatus: user.banned_until ? 'Banned' : 'Active',
        avatar: onboarding?.avatar || '',
        skills: Array.isArray(onboarding?.skills) ? onboarding.skills : [],
        projects: Array.isArray(onboarding?.projects) ? onboarding.projects : (onboarding?.resume?.projects || []),
        certifications: Array.isArray(onboarding?.certifications) ? onboarding.certifications : [],
        experiences: Array.isArray(onboarding?.experiences) ? onboarding.experiences : [],
        badges: Array.isArray(onboarding?.badges) ? onboarding.badges : [],
        github: onboarding?.github || 'Not provided',
        linkedin: onboarding?.linkedin || 'Not provided',
        otherLinks: Array.isArray(onboarding?.otherLinks) ? onboarding.otherLinks : [],
        skillGap: Array.isArray(onboarding?.skillGap) ? onboarding.skillGap : [],
        readinessScore: typeof onboarding?.readinessScore === 'number' ? onboarding.readinessScore : null,
        roadmapProgress: typeof onboarding?.roadmapProgress === 'number' ? onboarding.roadmapProgress : null
      }
    })

    // Sort by signupDate descending by default
    formattedUsers.sort((a, b) => b.createdAtTime - a.createdAtTime)

    // Calculate real stats
    const totalUsers = formattedUsers.length
    const newUsersToday = formattedUsers.filter(u => u.createdAtTime >= todayStart).length
    const newUsersThisWeek = formattedUsers.filter(u => u.createdAtTime >= sevenDaysAgo).length
    const profilesCompleted = completedProfilesCount
    const profilesIncomplete = totalUsers - profilesCompleted

    return NextResponse.json({
      stats: {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        profilesCompleted,
        profilesIncomplete
      },
      users: formattedUsers
    })
  } catch (err: any) {
    console.error('Error in Admin users API:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch admin dashboard data' },
      { status: 500 }
    )
  }
}
