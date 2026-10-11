"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import JobList from '../components/JobList'
import { useProfileContext } from '../components/ProfileProvider'
import supabase from '../../lib/supabaseClient'
import Link from 'next/link'
import { Briefcase, Search, Filter, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import FeatureBanner from '../components/FeatureBanner'

export default function JobsPage(){
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Array<any>>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [modeFilter, setModeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { profile, loading: profileLoading, updateProfile } = useProfileContext()

  useEffect(()=>{
    ;(async ()=>{
      setLoading(true)
      try{
        const res = await fetch('/api/jobs')
        const j = await res.json()
        setJobs(j.data || [])
      }catch(e){
        console.error(e)
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!profileLoading && profile) {
      const saved = profile?.onboarding?.savedOpportunities || []
      setSavedIds(saved.map((s:any)=> s.opportunityId || s.jobId))
    }
  }, [profile, profileLoading])

  const handleSave = async (job:any) => {
    try{
      const existing = profile?.onboarding || {}
      const savedOpportunities = existing.savedOpportunities || []
      if(savedOpportunities.some((s:any)=> s.opportunityId === job.id || s.jobId === job.id)) return
      const updated = [...savedOpportunities, { opportunityId: job.id, type: 'job', savedAt: new Date().toISOString(), title: job.title, organization: job.organization }]
      const updatedOnboarding = { ...existing, savedOpportunities: updated }
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if(ok){
        setSavedIds(s=> [...s, job.id])
      }
    }catch(err){ console.error(err) }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesMode = !modeFilter || job.mode?.toLowerCase() === modeFilter.toLowerCase()
    
    return matchesSearch && matchesLocation && matchesMode
  })


  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeatureBanner 
          title="Jobs"
          subtitle="Find and apply to early-career opportunities."
          icon={Briefcase}
          bgPatternIcon={Briefcase}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/job-recommendations"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl transition-colors font-medium text-sm"
              >
                <Sparkles className="h-4 w-4 text-indigo-600" />
                AI Recommendations
              </Link>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl transition-colors font-medium text-sm",
                  showFilters ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 outline-none"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-sky-500 outline-none"
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"></div>
          </div>
        ) : (
          <div>
            {filteredJobs.length > 0 ? (
              <JobList jobs={filteredJobs} onSave={handleSave} savedIds={savedIds} />
            ) : (
              <EmptyState 
                title="No jobs found" 
                message={searchQuery ? "We couldn't find any jobs matching your search." : "No job listings are currently available."}
                icon={<Briefcase />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
