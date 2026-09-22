"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { BookOpen, Search, Filter, PlayCircle, ExternalLink, CheckCircle2, MonitorPlay } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { cn } from '../../lib/utils'

export default function CoursesPage(){
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const { profile, loading: profileLoading, updateProfile } = useProfileContext()

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/courses')
        const js = await r.json()
        setCourses(js.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!profileLoading && profile) {
      const enrolls = profile?.onboarding?.enrollments || []
      setEnrolledIds(new Set(enrolls.map((e:any)=>e.courseId)))
    }
  }, [profile, profileLoading])

  const handleEnroll = async (id: string) =>{
    if(enrolledIds.has(id)) return
    setEnrollingId(id)
    setError(null)
    try{
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token
      if(!token) throw new Error('Not authenticated')
      const res = await fetch('/api/courses/enroll', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ courseId: id }) })
      const js = await res.json()
      if(!res.ok) throw new Error(js?.error || 'Enroll failed')
      setEnrolledIds(prev => new Set(prev).add(id))
    }catch(e:any){ setError(e?.message || 'Enroll error') }
    setEnrollingId(null)
  }

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.provider?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Courses</h1>
            <p className="text-slate-500 mt-1">Level up your skills with curated technical courses.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by course title or provider..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"></div>
          </div>
        ) : (
          <div>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(c => {
                  const isEnrolled = enrolledIds.has(c.id)
                  const isEnrolling = enrollingId === c.id
                  
                  return (
                    <div key={c.id} className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md hover:border-rose-300 transition-all">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-xl font-bold text-rose-600 shrink-0">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">{c.title}</h3>
                              <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                                <MonitorPlay className="w-4 h-4" />
                                {c.provider}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                            <PlayCircle className="w-3.5 h-3.5" />
                            {c.duration}
                          </span>
                        </div>
                        
                        {c.description && (
                          <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                            {c.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <a 
                          href={c.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          View Course Content
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleEnroll(c.id)} 
                          disabled={isEnrolled || isEnrolling} 
                          className={cn(
                            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                            isEnrolled 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          )}
                        >
                          {isEnrolled ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Enrolled
                            </>
                          ) : isEnrolling ? (
                            "Enrolling..."
                          ) : (
                            "Enroll Now"
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState 
                title="No courses found" 
                message={searchQuery ? "We couldn't find any courses matching your search." : "No courses are currently available."}
                icon={<BookOpen />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
