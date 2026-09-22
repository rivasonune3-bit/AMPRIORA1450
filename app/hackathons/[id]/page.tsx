"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DashboardShell from '../../components/DashboardShell'
import { Trophy, Calendar, MapPin, Users, Globe, ExternalLink, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Opportunity } from '../../../lib/opportunities/types'

export default function HackathonDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [hackathon, setHackathon] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const r = await fetch('/api/hackathons')
        const js = await r.json()
        const found = js.data?.find((h: Opportunity) => h.id === id)
        if (found) {
          setHackathon(found)
        } else {
          setError('Hackathon not found')
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load hackathon details')
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !hackathon) {
    return (
      <DashboardShell>
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
          {error || 'Hackathon not found'}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/hackathons" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Hackathons
        </Link>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Trophy className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl font-bold text-purple-600 shrink-0">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{hackathon.title}</h1>
                    <p className="text-lg text-slate-600 mt-1">{hackathon.organization}</p>
                  </div>
                  <a 
                    href={hackathon.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shrink-0"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {hackathon.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {hackathon.mode}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Deadline: {new Date(hackathon.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-8 border-slate-100" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">About the Hackathon</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    <p>{hackathon.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.skills?.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100/50">
                        <Tag className="w-3.5 h-3.5" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4">Event Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Eligibility</div>
                      <div className="text-sm text-slate-900 font-medium">{hackathon.eligibility}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Prize / Compensation</div>
                      <div className="text-sm text-emerald-600 font-bold">{hackathon.compensation}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Type</div>
                      <div className="text-sm text-slate-900 font-medium">{hackathon.type}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Looking for a team?
                  </h4>
                  <p className="text-sm text-purple-700 mb-4">
                    Join forces with other developers and designers to build something amazing.
                  </p>
                  <Link 
                    href="/hackathons/team"
                    className="block w-full text-center px-4 py-2 bg-white text-purple-700 font-semibold rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
                  >
                    Find Teammates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
