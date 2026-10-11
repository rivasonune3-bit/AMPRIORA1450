"use client"

import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import supabaseBrowser from '../../../lib/supabaseClient'
import { useProfileContext } from '../../components/ProfileProvider'

export default function MentorshipRequests(){
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const { profile: contextProfile, loading: profileLoading } = useProfileContext()

  useEffect(()=>{
    if (!profileLoading) {
      if (contextProfile) {
        const reqs = contextProfile?.onboarding?.mentorshipRequests || []
        setRequests(reqs)
      } else {
        setRequests([])
      }
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [contextProfile, profileLoading])

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <div className="max-w-6xl mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold">Mentorship Requests</h1>
            <p className="mt-2 text-slate-600">Your mentorship requests are listed below.</p>

            {loading && <div className="mt-4 text-sm text-slate-500">Loading requests...</div>}
            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            <div className="mt-6 space-y-4">
              {requests.map(r => (
                <div key={r.id} className="p-4 border rounded">
                  <div className="font-semibold">Request to {r.mentorId} — <span className="text-sm text-slate-500">{r.status}</span></div>
                  <div className="text-sm text-slate-500">{r.message}</div>
                  <div className="text-xs text-slate-400">{r.createdAt}</div>
                </div>
              ))}
              {requests.length===0 && !loading && <div className="text-sm text-slate-500">No mentorship requests found.</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
