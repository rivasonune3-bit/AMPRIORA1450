"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { CalendarCheck, MapPin, Search, Filter, ExternalLink, Trophy, Clock, Award } from 'lucide-react'
import { cn } from '../../lib/utils'
import EmptyState from '../components/EmptyState'

export default function ScholarshipsEventsPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/scholarships')
        const js = await r.json()
        setItems(js.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = items.filter(d => {
    const matchesSearch = d.title?.toLowerCase().includes(search.toLowerCase()) || 
                          d.org?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || d.category?.toLowerCase() === categoryFilter.toLowerCase()
    const matchesLocation = !locationFilter || d.location?.toLowerCase().includes(locationFilter.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scholarships & Events</h1>
          <p className="text-slate-500 mt-1">Discover grants, conferences, and student competitions worldwide.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by title or organization..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="">Any Category</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="event">Event / Conference</option>
                  <option value="competition">Competition</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="">Any Location</option>
                  <option value="online">Online / Global</option>
                  <option value="india">India</option>
                  <option value="usa">USA</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => { setCategoryFilter(''); setLocationFilter(''); setSearch(''); }}
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
            {filtered.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-4">
                {filtered.map(item => (
                  <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl shrink-0">
                          {item.org?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{item.title}</h3>
                          <div className="text-sm font-medium text-slate-600 mt-0.5">{item.org}</div>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full", item.category === 'Scholarship' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700')}>
                        {item.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Prize/Amount</div>
                        <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-500" /> {item.amount}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Location</div>
                        <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" /> {item.location}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-rose-500">
                        <Clock className="w-4 h-4" /> Deadline: {item.deadline}
                      </div>
                      <button className="flex items-center justify-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium text-sm transition-all shadow-sm hover:shadow">
                        Apply Now <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No opportunities found" 
                message={search ? "We couldn't find any scholarships or events matching your search." : "No scholarships or events are currently available."}
                icon={<Award />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
