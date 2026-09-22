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

    const { postId } = await req.json()
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Fetch all profiles to locate the post
    const { data: rawProfiles } = await supabase.from('profiles').select('id, full_name, onboarding')
    const profilesList: any[] = (rawProfiles as any[]) || []

    let targetAuthorProfile: any = null
    let targetPost: any = null

    profilesList.forEach((p: any) => {
      const uPosts = p.onboarding?.posts || []
      const found = uPosts.find((post: any) => post.id === postId)
      if (found) {
        targetAuthorProfile = p
        targetPost = found
      }
    })

    if (!targetAuthorProfile || !targetPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const likedBy: string[] = Array.isArray(targetPost.likedBy) ? targetPost.likedBy : []
    const hasLiked = likedBy.includes(caller.id)

    let updatedLikedBy: string[] = []
    if (hasLiked) {
      updatedLikedBy = likedBy.filter((id: string) => id !== caller.id)
    } else {
      updatedLikedBy = [...likedBy, caller.id]
    }

    const updatedPost = {
      ...targetPost,
      likedBy: updatedLikedBy,
      likesCount: updatedLikedBy.length,
      hasLiked: !hasLiked
    }

    // Update target author's profile onboarding.posts
    const onboarding = targetAuthorProfile.onboarding || {}
    const currentPosts = onboarding.posts || []
    const updatedPosts = currentPosts.map((p: any) => (p.id === postId ? updatedPost : p))
    const updatedOnboarding = { ...onboarding, posts: updatedPosts }

    await supabase.from('profiles').upsert({
      id: targetAuthorProfile.id,
      full_name: targetAuthorProfile.full_name,
      onboarding: updatedOnboarding
    }, { onConflict: 'id' })

    // Also update 'posts' table if present
    try {
      await supabase.from('posts').update({
        likedBy: updatedLikedBy,
        likesCount: updatedLikedBy.length
      }).eq('id', postId)
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({ post: updatedPost })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
