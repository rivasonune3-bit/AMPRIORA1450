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

    const supabase = getSupabaseServerClient()

    // 1. Fetch all profiles from profiles table
    const { data: rawProfiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    const profilesList: any[] = (rawProfiles as any[]) || []
    const profileMap = new Map<string, any>()
    profilesList.forEach((p: any) => profileMap.set(p.id, p))

    // 2. Collect all conversations from profiles onboarding.conversations
    const convMap = new Map<string, any>()

    profilesList.forEach((p: any) => {
      const uConvs = p.onboarding?.conversations || {}
      Object.keys(uConvs).forEach(convId => {
        const conv = uConvs[convId]
        if (!conv) return

        const participants: string[] = Array.isArray(conv.participants) 
          ? conv.participants 
          : (convId.includes('_') ? convId.split('_') : [p.id, conv.participantId].filter(Boolean))

        // Only include conversation if caller is a participant
        if (participants.includes(caller.id)) {
          if (!convMap.has(convId)) {
            convMap.set(convId, { ...conv, id: convId, participants })
          } else {
            // Merge messages if existing
            const existing = convMap.get(convId)
            const msgMap = new Map<string, any>()
            ;(existing.messages || []).forEach((m: any) => msgMap.set(m.id, m))
            ;(conv.messages || []).forEach((m: any) => msgMap.set(m.id, m))
            const mergedMsgs = Array.from(msgMap.values()).sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
            convMap.set(convId, { ...existing, messages: mergedMsgs })
          }
        }
      })
    })

    // Also check 'messages' or 'conversations' table if present in Supabase
    try {
      const { data: tMsgs } = await supabase.from('messages').select('*')
      if (tMsgs && Array.isArray(tMsgs)) {
        tMsgs.forEach((msg: any) => {
          const convId = msg.conversationId || msg.conversation_id
          if (convId && convId.includes(caller.id)) {
            let conv = convMap.get(convId)
            if (!conv) {
              const parts = convId.split('_')
              conv = { id: convId, participants: parts, messages: [] }
              convMap.set(convId, conv)
            }
            const existingMsgs = conv.messages || []
            if (!existingMsgs.some((m: any) => m.id === msg.id)) {
              conv.messages = [...existingMsgs, msg].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              )
            }
          }
        })
      }
    } catch (e) {
      // Ignore if table does not exist
    }

    // 3. Format conversations with up-to-date Single Source of Truth profile info
    const formattedConversations = Array.from(convMap.values()).map(conv => {
      const participants: string[] = conv.participants || []
      const participantId = participants.find(id => id !== caller.id) || conv.participantId || caller.id
      const pProfile = profileMap.get(participantId)
      const pOnboarding = pProfile?.onboarding || {}

      const participantName = pProfile?.full_name || conv.participantName || 'AMPRIORA Member'
      const participantAvatar = pOnboarding.avatar || conv.participantAvatar || ''
      const participantRole = pOnboarding.targetRole || pOnboarding.careerGoal || conv.participantRole || 'Software Engineer'
      const participantCompanyOrSchool = pOnboarding.education || pOnboarding.branch || conv.participantCompanyOrSchool || 'AMPRIORA Member'

      const rawMessages = conv.messages || []
      const messages = rawMessages.map((m: any) => {
        const isMe = m.senderId === caller.id || m.senderId === 'me'
        const sProfile = isMe ? profileMap.get(caller.id) : pProfile
        const sOnboarding = sProfile?.onboarding || {}

        return {
          ...m,
          senderId: isMe ? 'me' : participantId,
          senderName: isMe ? 'You' : (sProfile?.full_name || 'Member'),
          senderAvatar: sOnboarding.avatar || ''
        }
      })

      const lastMsg = messages[messages.length - 1]
      const unreadCount = messages.filter((m: any) => m.senderId !== 'me' && !m.isRead).length

      return {
        id: conv.id,
        participantId,
        participantName,
        participantAvatar,
        participantRole,
        participantCompanyOrSchool,
        isOnline: true,
        lastSeen: 'Active',
        messages,
        lastMessageTime: lastMsg ? lastMsg.timestamp : new Date().toISOString(),
        unreadCount
      }
    })

    // Sort conversations by last message timestamp descending
    formattedConversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )

    return NextResponse.json({ conversations: formattedConversations })
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
    const { conversationId, targetUserId, text, attachment } = body

    if (!text && !attachment) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    let finalConvId = conversationId
    let targetId = targetUserId

    if (!finalConvId && targetId) {
      finalConvId = [caller.id, targetId].sort().join('_')
    }

    if (!finalConvId) {
      return NextResponse.json({ error: 'Missing conversationId or targetUserId' }, { status: 400 })
    }

    if (!targetId && finalConvId.includes('_')) {
      const parts = finalConvId.split('_')
      targetId = parts.find((id: string) => id !== caller.id) || caller.id
    }

    const supabase = getSupabaseServerClient()

    // Fetch caller & target user profiles
    const { data: rawProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, onboarding')
      .in('id', [caller.id, targetId])

    const profilesList: any[] = (rawProfiles as any[]) || []
    const callerProfile = profilesList.find((p: any) => p.id === caller.id)
    const targetProfile = profilesList.find((p: any) => p.id === targetId)

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      conversationId: finalConvId,
      senderId: caller.id,
      senderName: callerProfile?.full_name || caller.email || 'AMPRIORA Member',
      senderAvatar: callerProfile?.onboarding?.avatar || '',
      text: (text || '').trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      attachment: attachment || null
    }

    // Function to update conversation state in user profile
    const updateProfileConversations = async (profileData: any, otherUserId: string) => {
      if (!profileData) return
      const onboarding = profileData.onboarding || {}
      const conversations = { ...(onboarding.conversations || {}) }

      const existingConv = conversations[finalConvId] || {
        id: finalConvId,
        participants: [caller.id, otherUserId],
        messages: []
      }

      const currentMsgs = existingConv.messages || []
      const updatedMsgs = [...currentMsgs, newMessage]

      conversations[finalConvId] = {
        ...existingConv,
        id: finalConvId,
        participants: [caller.id, otherUserId],
        messages: updatedMsgs,
        lastMessage: newMessage
      }

      await supabase.from('profiles').upsert({
        id: profileData.id,
        full_name: profileData.full_name,
        onboarding: {
          ...onboarding,
          conversations
        }
      }, { onConflict: 'id' })
    }

    // Update BOTH caller and target user in Supabase
    await updateProfileConversations(callerProfile, targetId)
    if (targetProfile && targetId !== caller.id) {
      await updateProfileConversations(targetProfile, caller.id)
    }

    // Try inserting into 'messages' table if present
    try {
      await supabase.from('messages').insert([{
        id: newMessage.id,
        conversationId: finalConvId,
        senderId: caller.id,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        attachment: newMessage.attachment
      }])
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      conversationId: finalConvId,
      message: newMessage
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
