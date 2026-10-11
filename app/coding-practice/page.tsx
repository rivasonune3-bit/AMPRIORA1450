"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { Code, CheckCircle2, Circle, Clock, Loader2, Play } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { cn } from '../../lib/utils'

type ProgressMap = Record<string, string>

export default function CodingPracticePage(){
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [progress, setProgress] = useState<ProgressMap>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const { profile, loading: profileLoading } = useProfileContext()

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      setError(null)
      try{
        const r = await fetch('/api/practice/problems')
        const js = await r.json()
        setProblems(js.data || [])
      }catch(e:any){ setError(e?.message || 'Failed to load') }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!profileLoading && profile) {
      const prog = profile?.onboarding?.practiceProgress || []
      const map: ProgressMap = {}
      prog.forEach((p:any)=> map[p.problemId] = p.status)
      setProgress(map)
    }
  }, [profile, profileLoading])

  const setStatus = async (problemId: string, status: string) =>{
    setSavingId(problemId)
    setError(null)
    try{
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token
      if(!token) throw new Error('Not authenticated')
      const res = await fetch('/api/practice/progress', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ problemId, status }) })
      const js = await res.json()
      if(!res.ok) throw new Error(js?.error || 'Save failed')
      setProgress(prev => ({ ...prev, [problemId]: status }))
    }catch(e:any){ setError(e?.message || 'Save error') }
    setSavingId(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-emerald-600 bg-emerald-50 border-emerald-100'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100'
      case 'hard': return 'text-rose-600 bg-rose-50 border-rose-100'
      default: return 'text-slate-600 bg-slate-50 border-slate-100'
    }
  }

  const getStatusIcon = (status: string, isSaving: boolean) => {
    if (isSaving) return <Loader2 className="w-4 h-4 animate-spin" />
    switch (status) {
      case 'solved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'in-progress': return <Clock className="w-5 h-5 text-orange-500" />
      default: return <Circle className="w-5 h-5 text-slate-300" />
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Coding Practice</h1>
            <p className="text-slate-500 mt-1">Sharpen your algorithmic skills for interviews.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          </div>
        ) : (
          <div>
            {problems.length > 0 ? (
              <div className="grid gap-4">
                {problems.map(p => {
                  const currentStatus = progress[p.id] || 'not-started'
                  const isSaving = savingId === p.id
                  
                  return (
                    <div key={p.id} className={cn(
                      "group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border rounded-2xl transition-all",
                      currentStatus === 'solved' ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 hover:border-orange-300 hover:shadow-sm"
                    )}>
                      <div className="flex-1 flex gap-4">
                        <div className="mt-1 shrink-0">
                          {getStatusIcon(currentStatus, isSaving)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={cn(
                              "font-semibold text-lg transition-colors",
                              currentStatus === 'solved' ? "text-slate-700" : "text-slate-900 group-hover:text-orange-600"
                            )}>
                              {p.title}
                            </h3>
                            <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border", getDifficultyColor(p.difficulty))}>
                              {p.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm line-clamp-2">{p.prompt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 md:pl-4 md:border-l border-slate-100">
                        <button 
                          onClick={()=>setStatus(p.id, 'not-started')} 
                          disabled={savingId === p.id} 
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                            currentStatus === 'not-started' 
                              ? "bg-slate-100 text-slate-800 border-slate-200" 
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          Todo
                        </button>
                        <button 
                          onClick={()=>setStatus(p.id, 'in-progress')} 
                          disabled={savingId === p.id} 
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                            currentStatus === 'in-progress' 
                              ? "bg-orange-100 text-orange-800 border-orange-200" 
                              : "bg-white text-slate-500 border-slate-200 hover:bg-orange-50 hover:text-orange-600"
                          )}
                        >
                          Doing
                        </button>
                        <button 
                          onClick={()=>setStatus(p.id, 'solved')} 
                          disabled={savingId === p.id} 
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                            currentStatus === 'solved' 
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                              : "bg-white text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600"
                          )}
                        >
                          Solved
                        </button>
                        
                        <button className="ml-2 w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-colors shadow-sm">
                          <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState 
                title="No problems found" 
                message="No coding problems are currently available."
                icon={<Code />}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
