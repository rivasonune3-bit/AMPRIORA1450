"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { GraduationCap, Search, Filter, MapPin, Clock, Building, ExternalLink, CheckCircle2, Bookmark } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { cn } from '../../lib/utils'
import FeatureBanner from '../components/FeatureBanner'

export default function InternshipsPage(){
  const [internships, setInternships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [modeFilter, setModeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { profile, loading: profileLoading, updateProfile } = useProfileContext()

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/internships')
        const json = await r.json()
        setInternships(json.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!profileLoading && profile) {
      const apps = profile?.onboarding?.internshipApplications || []
      setAppliedIds(new Set(apps.map((a:any)=>a.internshipId)))

      const saved = profile?.onboarding?.savedOpportunities || []
      setSavedIds(new Set(saved.map((s:any)=> s.opportunityId || s.internshipId)))
    }
  }, [profile, profileLoading])

  const handleApply = async (id: string) =>{
    if(appliedIds.has(id)) return
    setApplyingId(id)
    setError(null)
    try{
      const existing = profile?.onboarding || {}
      const apps = existing.internshipApplications || []
      
      const item = internships.find(i => i.id === id)
      if(!item) throw new Error('Item not found')
      const updated = [...apps, { internshipId: item.id, appliedAt: new Date().toISOString(), title: item.title, organization: item.organization }]
      const updatedOnboarding = { ...existing, internshipApplications: updated }
      
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if (ok) {
        setAppliedIds(prev => new Set(prev).add(id))
      }
    }catch(e:any){ setError(e?.message || 'Apply error') }
    setApplyingId(null)
  }

  const handleSave = async (item: any) => {
    if(savedIds.has(item.id)) return
    try {
      const existing = profile?.onboarding || {}
      const saved = existing.savedOpportunities || []
      
      const updated = [...saved, { opportunityId: item.id, type: 'internship', savedAt: new Date().toISOString(), title: item.title, organization: item.organization }]
      const updatedOnboarding = { ...existing, savedOpportunities: updated }
      
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if(ok) {
        setSavedIds(prev => new Set(prev).add(item.id))
      }
    } catch(err) { console.error(err) }
  }

  const filteredInternships = internships.filter(intern => {
    const matchesSearch = intern.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          intern.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !locationFilter || intern.location?.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesMode = !modeFilter || intern.mode?.toLowerCase() === modeFilter.toLowerCase()
    
    return matchesSearch && matchesLocation && matchesMode
  })

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeatureBanner 
          title="Internships"
          subtitle="Kickstart your career with top internship programs."
          icon={GraduationCap}
          bgPatternIcon={GraduationCap}
        />

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by role or company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl transition-colors font-medium text-sm",
                showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="">Any Location</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Work Mode</label>
                <select 
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="">Any Mode</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => { setLocationFilter(''); setModeFilter(''); setSearchQuery(''); }}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div>
            {filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map(item => {
                  const isApplied = appliedIds.has(item.id)
                  const isSaved = savedIds.has(item.id)
                  
                  return (
                    <div key={item.id} className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md hover:border-indigo-300 transition-all">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
                              {item.organization?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h3>
                              <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                                <Building className="w-4 h-4" />
                                {item.organization}
                                {item.verified && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSave(item)}
                            disabled={isSaved}
                            className={cn(
                              "p-2 rounded-full transition-colors shrink-0 z-10 relative",
                              isSaved ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            )}
                            title={isSaved ? "Saved" : "Save Internship"}
                          >
                            <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100/50">
                            <Clock className="w-3.5 h-3.5" />
                            {item.mode}
                          </span>
                          {item.deadline && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100/50">
                              <Clock className="w-3.5 h-3.5" />
                              Deadline: {item.deadline}
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                        <a 
                          href={`/internships/${item.id}`} 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          View Details
                        </a>
                        <a 
                          href={item.sourceUrl || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                          Apply
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState 
                title="No internships found" 
                message={searchQuery ? "We couldn't find any internships matching your search." : "No internship listings are currently available."}
                icon={<GraduationCap />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

