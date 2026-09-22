"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import supabase from '../../lib/supabaseClient'
import { UserProfile } from '../../lib/hooks/useUserProfile'

interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>, mergeOnboarding?: boolean) => Promise<boolean>
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  error: null,
  refreshProfile: async () => {},
  updateProfile: async () => false
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let token: string | undefined

      try {
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.access_token
      } catch (authErr) {
        console.warn('Supabase getSession error:', authErr)
      }

      if (!token) {
        setProfile(null)
        setLoading(false)
        return
      }

      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setProfile(json.data)
        } else {
          setProfile(null)
        }
      } else {
        const errJson = await res.json()
        setError(errJson.error || 'Failed to load profile')
        setProfile(null)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()

    // Listen to Supabase auth changes to auto-update profile state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        fetchProfile()
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const updateProfile = async (updates: Partial<UserProfile>, mergeOnboarding: boolean = true) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token || !profile) return false

      const payload: any = {
        id: profile.id,
        full_name: updates.full_name ?? profile.full_name,
      }

      if (updates.onboarding) {
        if (mergeOnboarding) {
          payload.onboarding = {
            ...(profile.onboarding || {}),
            ...updates.onboarding,
            resume: {
              ...(profile.onboarding?.resume || {}),
              ...(updates.onboarding.resume || {})
            }
          }
        } else {
          payload.onboarding = updates.onboarding
        }
      } else if (profile.onboarding) {
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
          await fetchProfile()
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
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile: fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  return useContext(ProfileContext)
}
