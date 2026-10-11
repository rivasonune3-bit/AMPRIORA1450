"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import supabase from '../../lib/supabaseClient'
import { UserProfile } from '../../lib/hooks/useUserProfile'

interface ProfileContextType {
  user: any | null
  session: any | null
  authLoading: boolean
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>, mergeOnboarding?: boolean) => Promise<boolean>
}

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  session: null,
  authLoading: true,
  profile: null,
  loading: true,
  error: null,
  refreshProfile: async () => {},
  updateProfile: async () => false
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (activeSession?: any) => {
    setLoading(true)
    setError(null)
    try {
      let currentSession = activeSession
      if (!currentSession) {
        try {
          const { data } = await supabase.auth.getSession()
          currentSession = data?.session
        } catch (authErr) {
          console.warn('Supabase getSession error:', authErr)
        }
      }

      const token = currentSession?.access_token
      const currentUser = currentSession?.user

      if (!token || !currentUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(currentUser)
      setSession(currentSession)

      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          const rec = Array.isArray(json.data) ? json.data[0] : json.data
          setProfile(rec)
        } else {
          // Provide base profile derived from authenticated user
          setProfile({
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member',
            onboarding: {}
          })
        }
      } else {
        const errJson = await res.json().catch(() => ({}))
        setError(errJson.error || 'Failed to load profile')
        // Even if server profile query had a warning/error, populate base profile for authenticated user
        setProfile({
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member',
          onboarding: {}
        })
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching profile')
      if (activeSession?.user) {
        setProfile({
          id: activeSession.user.id,
          full_name: activeSession.user.user_metadata?.full_name || activeSession.user.email?.split('@')[0] || 'Member',
          onboarding: {}
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession()
        const initialSession = data?.session
        if (!mounted) return
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          await fetchProfile(initialSession)
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      } catch (err) {
        console.warn('Initial session check error:', err)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      } finally {
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
        setAuthLoading(false)
        await fetchProfile(newSession)
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
        setAuthLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const updateProfile = async (updates: Partial<UserProfile>, mergeOnboarding: boolean = true) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const token = currentSession?.access_token
      const currentUserId = profile?.id || currentSession?.user?.id
      if (!token || !currentUserId) return false

      const currentFullName = updates.full_name ?? profile?.full_name ?? currentSession?.user?.user_metadata?.full_name ?? 'Member'

      const payload: any = {
        id: currentUserId,
        full_name: currentFullName,
      }

      if (updates.onboarding) {
        if (mergeOnboarding) {
          payload.onboarding = {
            ...(profile?.onboarding || {}),
            ...updates.onboarding,
            resume: {
              ...(profile?.onboarding?.resume || {}),
              ...(updates.onboarding.resume || {})
            }
          }
        } else {
          payload.onboarding = updates.onboarding
        }
      } else if (profile?.onboarding) {
        payload.onboarding = profile.onboarding
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const json = await res.json()
        let updatedRecord = null
        if (Array.isArray(json.data) && json.data.length > 0) {
          updatedRecord = json.data[0]
        } else if (json.data && typeof json.data === 'object') {
          updatedRecord = json.data
        }

        if (updatedRecord) {
          setProfile(updatedRecord)
        } else {
          await fetchProfile(currentSession)
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      return false
    }
  }

  return (
    <ProfileContext.Provider value={{ 
      user, 
      session, 
      authLoading, 
      profile, 
      loading, 
      error, 
      refreshProfile: () => fetchProfile(session), 
      updateProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  return useContext(ProfileContext)
}
