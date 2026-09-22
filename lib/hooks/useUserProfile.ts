import { useState, useEffect, useCallback } from 'react'
import supabase from '../supabaseClient'

export interface UserProfile {
  id: string
  full_name: string
  onboarding?: {
    education?: string
    branch?: string
    year?: string
    skills?: string
    targetCareer?: string
    dreamCompany?: string
    targetRole?: string
    experience?: string | any[] | any
    linkedin?: string
    github?: string
    resume?: any
    [key: string]: any
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

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
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
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
          payload.onboarding = { ...(profile.onboarding || {}), ...updates.onboarding }
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
        if (json.data && json.data.length > 0) {
          setProfile(json.data[0])
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      return false
    }
  }

  return { profile, loading, error, refreshProfile: fetchProfile, updateProfile }
}
