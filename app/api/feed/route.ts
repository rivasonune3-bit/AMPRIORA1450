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
    const supabase = getSupabaseServerClient()

    // 1. Fetch all real profiles from profiles table
    const { data: rawProfiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    const profilesList: any[] = (rawProfiles as any[]) || []
    const profileMap = new Map<string, any>()
    const suggestedMembers: any[] = []

    profilesList.forEach((p: any) => {
      profileMap.set(p.id, p)
      if (!caller || p.id !== caller.id) {
        const onboarding = p.onboarding || {}
        suggestedMembers.push({
          id: p.id,
          name: p.full_name || 'AMPRIORA Member',
          avatar: onboarding.avatar || '',
          title: onboarding.targetRole || onboarding.careerGoal || 'Software Engineer',
          college: onboarding.education || onboarding.branch || 'Student Developer',
          skills: onboarding.skills || []
        })
      }
    })

    // 2. Fetch posts from 'posts' table if it exists
    let postsFromTable: any[] = []
    try {
      const { data: tPosts } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false })
      if (tPosts) {
        postsFromTable = (tPosts as any[]) || []
      }
    } catch (e) {
      // Table might not exist yet
    }

    // 3. Extract posts from profiles onboarding.posts array
    const postsFromProfiles: any[] = []
    profilesList.forEach((p: any) => {
      const uPosts = p.onboarding?.posts || []
      if (Array.isArray(uPosts)) {
        uPosts.forEach((post: any) => {
          if (post && post.id) {
            postsFromProfiles.push(post)
          }
        })
      }
    })

    // 4. Merge and deduplicate by post ID
    const mergedMap = new Map<string, any>()
    postsFromProfiles.forEach(p => mergedMap.set(p.id, p))
    postsFromTable.forEach(p => mergedMap.set(p.id, p))

    const rawPosts = Array.from(mergedMap.values())

    // 5. Connect posts with real profiles (Single Source of Truth)
    const processedPosts = rawPosts.map((post: any) => {
      const authorId = post.authorId || post.author_id
      const authorProfile = authorId ? profileMap.get(authorId) : null
      const authorOnboarding = authorProfile?.onboarding || {}

      const authorName = authorProfile?.full_name || post.authorName || 'AMPRIORA Member'
      const authorAvatar = authorOnboarding.avatar || post.authorAvatar || ''
      const authorRole = authorOnboarding.targetRole || authorOnboarding.careerGoal || post.authorRole || 'Software Engineer'
      const authorCompanyOrSchool = authorOnboarding.education || authorOnboarding.branch || post.authorCompanyOrSchool || 'AMPRIORA Member'

      // Process comments to also connect with real profiles
      const comments = (post.comments || []).map((c: any) => {
        const cAuthorId = c.authorId || c.author_id
        const cProfile = cAuthorId ? profileMap.get(cAuthorId) : null
        const cOnboarding = cProfile?.onboarding || {}

        return {
          ...c,
          authorId: cAuthorId || c.authorId,
          authorName: cProfile?.full_name || c.authorName || 'AMPRIORA Member',
          authorAvatar: cOnboarding.avatar || c.authorAvatar || '',
          authorRole: cOnboarding.targetRole || c.authorRole || 'Member'
        }
      })

      const likedBy = Array.isArray(post.likedBy) ? post.likedBy : []
      const hasLiked = caller ? likedBy.includes(caller.id) : Boolean(post.hasLiked)
      const likesCount = likedBy.length > 0 ? likedBy.length : (post.likesCount || 0)

      return {
        ...post,
        authorId,
        authorName,
        authorAvatar,
        authorRole,
        authorCompanyOrSchool,
        likesCount,
        hasLiked,
        likedBy,
        comments,
        isUserPost: Boolean(caller && authorId === caller.id)
      }
    })

    // 6. Sort posts descending by createdAt
    processedPosts.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0
      const timeB = new Date(b.createdAt).getTime() || 0
      return timeB - timeA
    })

    return NextResponse.json({
      posts: processedPosts,
      suggestedMembers: suggestedMembers.slice(0, 5)
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req)
    if (!caller) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { content, mediaUrl, mediaType, projectDetails, tags } = body

    if (!content && mediaType === 'text') {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Fetch caller's profile
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .eq('id', caller.id)
      .maybeSingle()

    const onboarding = callerProfile?.onboarding || {}

    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      authorId: caller.id,
      authorName: callerProfile?.full_name || caller.email || 'AMPRIORA Member',
      authorAvatar: onboarding.avatar || '',
      authorRole: onboarding.targetRole || onboarding.careerGoal || 'Software Engineer',
      authorCompanyOrSchool: onboarding.education || onboarding.branch || 'AMPRIORA Member',
      authorBadge: 'Member',
      createdAt: new Date().toISOString(),
      content: (content || '').trim(),
      tags: Array.isArray(tags) ? tags : [],
      mediaUrl: mediaUrl?.trim() || null,
      mediaType: mediaType || 'text',
      projectDetails: projectDetails || null,
      likesCount: 0,
      likedBy: [],
      reactions: { thumbsUp: 0, celebrate: 0, insightful: 0, love: 0 },
      userReaction: null,
      comments: [],
      sharesCount: 0,
      isUserPost: true
    }

    // Try storing in 'posts' table
    try {
      await supabase.from('posts').insert([newPost])
    } catch (e) {
      // Ignore if table does not exist
    }

    // Also persist in profile onboarding.posts array
    const existingPosts = onboarding.posts || []
    const updatedPosts = [newPost, ...existingPosts]
    const updatedOnboarding = { ...onboarding, posts: updatedPosts }

    await supabase
      .from('profiles')
      .upsert({
        id: caller.id,
        full_name: callerProfile?.full_name || caller.email || 'AMPRIORA Member',
        onboarding: updatedOnboarding
      }, { onConflict: 'id' })

    return NextResponse.json({ post: newPost })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req)
    if (!caller) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('id')
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // 1. Delete from 'posts' table if present
    try {
      await supabase.from('posts').delete().eq('id', postId).eq('authorId', caller.id)
    } catch (e) {
      // Ignore
    }

    // 2. Remove from caller's profile onboarding.posts
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .eq('id', caller.id)
      .maybeSingle()

    if (callerProfile) {
      const onboarding = callerProfile.onboarding || {}
      const currentPosts = onboarding.posts || []
      const updatedPosts = currentPosts.filter((p: any) => p.id !== postId)
      const updatedOnboarding = { ...onboarding, posts: updatedPosts }

      await supabase
        .from('profiles')
        .upsert({
          id: caller.id,
          full_name: callerProfile.full_name,
          onboarding: updatedOnboarding
        }, { onConflict: 'id' })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
