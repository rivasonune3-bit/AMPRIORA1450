"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '../../../lib/supabaseClient'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isConnectionError, setIsConnectionError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignUp(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      setIsConnectionError(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setIsConnectionError(false)
      return
    }

    setLoading(true)
    setError(undefined)
    setIsConnectionError(false)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim()
      })

      if (signUpError) {
        setLoading(false)
        if (
          signUpError.message === 'Failed to fetch' ||
          signUpError.message.includes('fetch') ||
          signUpError.status === 0
        ) {
          setIsConnectionError(true)
          setError('Something went wrong while connecting to your account.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      // If user session is created immediately or user auto-logs in
      if (!data?.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        })

        if (signInError) {
          setLoading(false)
          // If email confirmation is required by Supabase project settings
          if (data?.user && !data?.session) {
            setError('Account created! Please check your email to verify your account before logging in.')
            return
          }
          setError(signInError.message || 'Account created. Please log in.')
          return
        }
      }

      setLoading(false)
      router.push('/onboarding')
    } catch (err: any) {
      setLoading(false)
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setIsConnectionError(true)
        setError('Something went wrong while connecting to your account.')
      } else {
        setError(err.message || 'An unexpected error occurred.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-sky-600 tracking-tight">AMPRIORA</h1>
          <p className="text-xs text-slate-500 font-medium">
            Create your account to start your career journey
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition outline-none"
              placeholder="student@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition outline-none"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl space-y-2">
              <p>{error}</p>
              {isConnectionError && (
                <div className="pt-1">
                  <p className="text-[11px] text-rose-600 mb-2">Please try again in a moment.</p>
                  <button
                    type="submit"
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs font-medium text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-sky-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
