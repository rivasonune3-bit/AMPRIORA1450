"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../../components/DashboardShell'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import supabaseBrowser from '../../../lib/supabaseClient'
import { ArrowLeft, Building, Calendar, CheckCircle2, MapPin, Briefcase, ExternalLink, ShieldCheck, Bookmark } from 'lucide-react'
import { Opportunity } from '../../../lib/opportunities/types'
import { cn } from '../../../lib/utils'
import { useProfileContext } from '../../components/ProfileProvider'

export default function InternshipDetails(){
  const params = useParams()
  const id = params?.id as string
  const [item, setItem] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()
  const [matchData, setMatchData] = useState<any>(null)
  const [analyzingMatch, setAnalyzingMatch] = useState(false)

  useEffect(()=>{
    const loadData = async ()=>{
      setLoading(true)
      try {
        const r = await fetch(`/api/internships/${id}`)
        if(!r.ok){ setItem(null); setLoading(false); return }
        const js = await r.json()
        const internshipData = js.data || null
        setItem(internshipData)

        if (!profileLoading) {
          if (contextProfile) {
            const apps = contextProfile?.onboarding?.internshipApplications || []
            setApplied(apps.some((a:any)=>a.internshipId === id))
            const savedApps = contextProfile?.onboarding?.savedOpportunities || []
            setSaved(savedApps.some((a:any)=>a.opportunityId === id || a.internshipId === id))
          }
          if (contextProfile && internshipData) {
            analyzeMatch(contextProfile, internshipData)
          }
        }
      } catch(e:any) {
        setError(e?.message || 'Failed to load')
      }
      setLoading(false)
    }

    if(id) loadData()
  }, [id, contextProfile, profileLoading])

  const analyzeMatch = async (userProfile: any, opportunityData: any) => {
    setAnalyzingMatch(true)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile.onboarding, opportunity: opportunityData })
      })
      if (res.ok) {
        const js = await res.json()
        setMatchData(js.data)
      }
    } catch (e) {
      console.error('Failed to get match data', e)
    }
    setAnalyzingMatch(false)
  }

  const handleApply = async ()=>{
    if(applied || !item) return
    setApplying(true)
    setError(null)
    try{
      const existing = contextProfile?.onboarding || {}
      const apps = existing.internshipApplications || []
      const updated = [...apps, { internshipId: item.id, appliedAt: new Date().toISOString(), title: item.title, organization: item.organization }]
      const updatedOnboarding = { ...existing, internshipApplications: updated }
      
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if (ok) setApplied(true)
    }catch(e:any){ setError(e?.message || 'Apply error') }
    setApplying(false)
  }

  const handleSave = async ()=>{
    if(!item || saved) return
    setSaving(true)
    try{
      const existing = contextProfile?.onboarding || {}
      const savedApps = existing.savedOpportunities || []
      
      const updated = [...savedApps, { opportunityId: item.id, type: 'internship', savedAt: new Date().toISOString(), title: item.title, organization: item.organization }]
      const updatedOnboarding = { ...existing, savedOpportunities: updated }
      
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if (ok) setSaved(true)
    }catch(err){ console.error(err) }
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      </DashboardShell>
    )
  }

  if (!item && !loading) {
    return (
      <DashboardShell>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <h2 className="text-xl font-semibold text-slate-800">Internship not found</h2>
          <Link href="/internships" className="mt-4 inline-block text-indigo-600 hover:underline">Return to Internships</Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div>
          <Link href="/internships" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to internships
          </Link>
        </div>

        {item && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Details (Left) */}
            <div className="flex-1 w-full space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
                    {item.organization.charAt(0)}
                  </div>
                  <div className="pt-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{item.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-slate-600 font-medium">
                      <Building className="w-4 h-4" />
                      <span>{item.organization}</span>
                      {item.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" aria-label="Verified Opportunity" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</div>
                    <div className="mt-1 font-medium text-slate-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {item.location}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Mode</div>
                    <div className="mt-1 font-medium text-slate-800 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {item.mode}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</div>
                    <div className="mt-1 font-medium text-slate-800">{item.category}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</div>
                    <div className="mt-1 font-medium text-slate-800 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-400" /> {item.deadline || 'Rolling'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About this internship</h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  <p>{item.description}</p>
                </div>

                {item.skills && item.skills.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Preferred Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar (Right) */}
            <div className="w-full lg:w-[340px] shrink-0 sticky top-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Stipend / Compensation</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{item.compensation || 'Unpaid / TBD'}</div>
                  
                  {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">{error}</div>}

                  <div className="mt-6 space-y-3">
                    <a 
                      href={item.sourceUrl || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors shadow-sm"
                    >
                      Apply on {item.source || 'External'}
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button 
                      onClick={handleApply} 
                      disabled={applied || applying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                    >
                      {applied ? (
                        <><CheckCircle2 className="w-5 h-5" /> 1-Click Applied</>
                      ) : applying ? (
                        'Applying...'
                      ) : (
                        '1-Click Quick Apply'
                      )}
                    </button>
                    
                    <button 
                      onClick={handleSave} 
                      disabled={saved || saving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                      {saved ? (
                        <><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Saved to Profile</>
                      ) : saving ? (
                        'Saving...'
                      ) : (
                        <><Bookmark className="w-5 h-5 text-slate-400" /> Save for Later</>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 px-6 border-t border-slate-100 text-sm text-slate-500 text-center flex flex-col items-center justify-center gap-1">
                  <span>Source: <strong>{item.source || item.organization}</strong></span>
                  {item.verified && <span className="text-emerald-600 font-medium flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified Listing</span>}
                </div>
              </div>

              {/* AI Match Analysis */}
              <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 shadow-sm overflow-hidden p-6 relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h3 className="font-bold text-slate-900">AI Match Analysis</h3>
                </div>
                
                {!contextProfile ? (
                  <div className="text-sm text-slate-600 text-center py-4 bg-white/50 rounded-xl border border-indigo-100/50">
                    Log in to see your personalized AI match score.
                  </div>
                ) : analyzingMatch ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                    <span className="text-xs font-medium text-indigo-600 animate-pulse">AI is analyzing fit...</span>
                  </div>
                ) : matchData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Match Score</div>
                        <div className="text-xl font-bold text-slate-900">{matchData.score}%</div>
                      </div>
                      <div className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg border",
                        matchData.score > 75 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        matchData.score > 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {matchData.verdict}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {matchData.summary}
                    </p>

                    <div className="space-y-3 pt-2">
                      {matchData.pros?.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-emerald-700 uppercase mb-1">Pros</div>
                          <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-emerald-400">
                            {matchData.pros.map((pro: string, i: number) => <li key={i}>{pro}</li>)}
                          </ul>
                        </div>
                      )}
                      {matchData.cons?.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-amber-700 uppercase mb-1">Missing / Weak</div>
                          <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-amber-400">
                            {matchData.cons.map((con: string, i: number) => <li key={i}>{con}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 text-center py-4 bg-white/50 rounded-xl border border-indigo-100/50">
                    Could not load analysis.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
