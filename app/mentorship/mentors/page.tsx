"use client"

import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import supabaseBrowser from '../../../lib/supabaseClient'
import { useProfileContext } from '../../components/ProfileProvider'

export default function MentorsPage(){
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [requestingId, setRequestingId] = useState<string|null>(null)
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())

  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/mentors')
        const js = await r.json()
        setMentors(js.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!profileLoading) {
      if (contextProfile) {
        const reqs = contextProfile?.onboarding?.mentorshipRequests || []
        setRequestedIds(new Set(reqs.map((r:any)=> r.mentorId)))
      }
    }
  }, [contextProfile, profileLoading])

  const handleRequest = async (mentorId: string)=>{
    if(requestedIds.has(mentorId)) return
    setRequestingId(mentorId)
    setError(null)
    try{
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token
      if(!token) throw new Error('Not authenticated')
      const res = await fetch('/api/mentorship/requests', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ mentorId }) })
      const js = await res.json()
      if(!res.ok) throw new Error(js?.error || 'Request failed')
      setRequestedIds(prev => new Set(prev).add(mentorId))
    }catch(e:any){ setError(e?.message || 'Request error') }
    setRequestingId(null)
  }

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <div className="max-w-6xl mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold">Mentors</h1>
            <p className="mt-2 text-slate-600">Browse available mentors and send a request.</p>

            {loading && <div className="mt-4 text-sm text-slate-500">Loading mentors...</div>}
            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            <div className="mt-6 space-y-4">
              {mentors.map(m => (
                <div key={m.id} className="p-4 border rounded flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{m.name} <span className="text-sm text-slate-500">- {m.title} @ {m.company}</span></div>
                    <div className="text-sm text-slate-500">Expertise: {m.expertise.join(', ')}</div>
                    <div className="mt-2 text-sm text-slate-600">{m.bio}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <button onClick={()=>handleRequest(m.id)} disabled={requestedIds.has(m.id) || requestingId===m.id} className="px-3 py-2 border rounded">
                      {requestedIds.has(m.id) ? 'Requested' : (requestingId===m.id ? 'Requesting...' : 'Request Mentor')}
                    </button>
                  </div>
                </div>
              ))}
              {mentors.length===0 && !loading && <div className="text-sm text-slate-500">No mentors found.</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
