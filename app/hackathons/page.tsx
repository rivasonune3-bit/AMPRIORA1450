"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { Trophy, Search, Filter, Calendar, MapPin, Users, ExternalLink, ArrowRight } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { cn } from '../../lib/utils'
import Link from 'next/link'
import { Opportunity } from '../../lib/opportunities/types'
import FeatureBanner from '../components/FeatureBanner'

export default function HackathonsPage(){
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/hackathons')
        const js = await r.json()
        setItems(js.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  const filteredItems = items.filter(h => {
    const matchesSearch = h.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !locationFilter || h.location?.toLowerCase().includes(locationFilter.toLowerCase())
    
    return matchesSearch && matchesLocation
  })

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeatureBanner 
          title="Hackathons"
          subtitle="Build, compete, and showcase your skills."
          icon={Trophy}
          bgPatternIcon={Trophy}
        >
          <Link 
            href="/hackathons/team"
            className="px-4 py-2 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors inline-flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Find or Create a Team
          </Link>
        </FeatureBanner>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by event or organizer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl transition-colors font-medium text-sm",
                showFilters ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location / Mode</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-purple-500 outline-none"
                >
                  <option value="">Any Location</option>
                  <option value="online">Online / Virtual</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => { setLocationFilter(''); setSearchQuery(''); }}
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : (
          <div>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(h => (
                  <div key={h.id} className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md hover:border-purple-300 transition-all">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-xl font-bold text-purple-600 shrink-0">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <div>
                            <Link href={`/hackathons/${h.id}`} className="font-semibold text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                              {h.title}
                            </Link>
                            <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                              <Users className="w-4 h-4" />
                              {h.organization}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                          <MapPin className="w-3.5 h-3.5" />
                          {h.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100/50">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(h.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {h.description && (
                        <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                          {h.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                      <Link 
                        href={`/hackathons/${h.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a 
                        href={h.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      >
                        Register
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No hackathons found" 
                message={searchQuery ? "We couldn't find any hackathons matching your search." : "No upcoming hackathons are currently available."}
                icon={<Trophy />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
