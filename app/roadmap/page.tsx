"use client"

import { useEffect, useMemo, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { useProfileContext } from '../components/ProfileProvider'
import { calculateCareerState, RoadmapMilestone } from '../../lib/careerEngine'
import { Map as MapIcon, CheckCircle2, Circle, Clock, Loader2, ArrowRight, ExternalLink, Target, AlertCircle, TrendingUp, RefreshCw, Briefcase, ChevronDown, ChevronUp, BookOpen, Star, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import Link from 'next/link'

export default function RoadmapPage() {
  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({})

  // Derive Single Source of Truth Career State
  const careerState = useMemo(() => calculateCareerState(contextProfile), [contextProfile])

  // Local milestones state synced with career state
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([])

  useEffect(() => {
    if (careerState.roadmapMilestones) {
      setMilestones(careerState.roadmapMilestones)
      if (careerState.roadmapMilestones.length > 0) {
        setExpandedPhases(prev => {
          if (Object.keys(prev).length === 0) {
            return { [careerState.roadmapMilestones[0].id]: true }
          }
          return prev
        })
      }
    }
  }, [careerState])

  const toggleSubtask = async (milestoneId: string, subtaskId: string) => {
    if (!contextProfile) return

    const updatedMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        const updatedSubtasks = m.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        const allCompleted = updatedSubtasks.every(st => st.completed)
        const someCompleted = updatedSubtasks.some(st => st.completed)
        const newStatus: 'completed' | 'in_progress' | 'pending' = allCompleted ? 'completed' : someCompleted ? 'in_progress' : 'pending'
        return { ...m, subtasks: updatedSubtasks, status: newStatus }
      }
      return m
    })

    setMilestones(updatedMilestones)

    // Save updated roadmap progress to Profile SSoT
    try {
      const targetKey = `${careerState.dreamCompany}:${careerState.targetRole}`
      const updatedOnboarding = {
        ...(contextProfile.onboarding || {}),
        roadmap: { milestones: updatedMilestones, updatedAt: new Date().toISOString() },
        roadmapTarget: targetKey
      }
      await updateProfile({ onboarding: updatedOnboarding }, false)
    } catch (err) {
      console.error('Failed to save roadmap progress:', err)
    }
  }

  const togglePhaseExpanded = (id: string) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const regenerateAiRoadmap = async () => {
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding: contextProfile?.onboarding })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js.error || 'Roadmap generation failed')

      if (js.data?.phases) {
        // Map AI response to milestones
        const aiMilestones: RoadmapMilestone[] = js.data.phases.map((p: any, i: number) => ({
          id: p.id || `step-${i+1}`,
          title: p.name || `Phase ${i+1}`,
          status: p.status === 'completed' ? 'completed' : p.status === 'in-progress' ? 'in_progress' : 'pending',
          subtasks: (p.topics || []).map((t: string, j: number) => ({
            id: `sub-${i+1}-${j+1}`,
            title: t,
            completed: false
          }))
        }))

        setMilestones(aiMilestones)
        const targetKey = `${careerState.dreamCompany}:${careerState.targetRole}`
        const updatedOnboarding = {
          ...(contextProfile?.onboarding || {}),
          roadmap: { milestones: aiMilestones, updatedAt: new Date().toISOString() },
          roadmapTarget: targetKey
        }
        await updateProfile({ onboarding: updatedOnboarding }, false)
      }
    } catch (e: any) {
      setError(e?.message || 'AI Roadmap generation failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (profileLoading && !contextProfile) {
    return (
      <DashboardShell>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading personalized roadmap...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Banner Driven by Profile SSoT */}
        <FeatureBanner 
          title="AI Career Roadmap SSoT"
          subtitle={`Personalized execution plan targeting ${careerState.targetRole} at ${careerState.dreamCompany}.`}
          icon={MapIcon}
          bgPatternIcon={Target}
        >
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div>
              <span className="text-xs text-indigo-200 block">Target Employer & Role</span>
              <span className="text-sm font-bold text-white">{careerState.dreamCompany} • {careerState.targetRole}</span>
            </div>
            <div className="w-px h-8 bg-white/20 mx-1 hidden sm:block" />
            <Link
              href="/profile"
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition backdrop-blur"
            >
              Change Goal in Profile
            </Link>
            <button
              onClick={regenerateAiRoadmap}
              disabled={analyzing}
              className="px-3.5 py-1.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              <span>{analyzing ? 'Generating...' : 'Re-generate AI Roadmap'}</span>
            </button>
          </div>
        </FeatureBanner>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {careerState.isRoadmapStale && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-2xl flex items-center justify-between">
            <span>Your target goal changed in Profile. Roadmap updated to match {careerState.dreamCompany} {careerState.targetRole}.</span>
            <button
              onClick={regenerateAiRoadmap}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold"
            >
              Sync Roadmap
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Summary Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Career Readiness Score Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Career Readiness SSoT</span>
              <div className="text-4xl font-black text-indigo-600">{careerState.careerReadiness}%</div>
              <p className="text-xs text-slate-500">Skill Coverage: {careerState.skillCoverage}% ({careerState.matchedSkills.length}/{careerState.requiredSkills.length} required skills)</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${careerState.careerReadiness}%` }} />
              </div>
            </div>

            {/* Target Skills Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Target Skills Breakdown</h3>
              
              <div>
                <span className="text-[11px] font-bold text-emerald-700 block mb-1">Matched Skills</span>
                <div className="flex flex-wrap gap-1">
                  {careerState.matchedSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-100">{s}</span>
                  ))}
                  {careerState.matchedSkills.length === 0 && <span className="text-xs text-slate-400">None yet</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-rose-700 block mb-1">Missing Skills</span>
                <div className="flex flex-wrap gap-1">
                  {careerState.missingSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-bold rounded border border-rose-100">{s}</span>
                  ))}
                  {careerState.missingSkills.length === 0 && <span className="text-xs text-emerald-600 font-bold">All skills matched!</span>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Roadmap Phases Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Action Plan for {careerState.dreamCompany}</span>
                <span className="text-xs text-indigo-600 font-medium">{milestones.length} Phases</span>
              </h3>

              <div className="space-y-4">
                {milestones.map((m, index) => {
                  const isExpanded = !!expandedPhases[m.id]
                  return (
                    <div key={m.id} className="border border-slate-200 rounded-2xl overflow-hidden transition">
                      
                      {/* Phase Header */}
                      <div 
                        onClick={() => togglePhaseExpanded(m.id)}
                        className="p-4 bg-slate-50/80 hover:bg-slate-100/60 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                            m.status === 'completed' ? "bg-emerald-500" : m.status === 'in_progress' ? "bg-amber-500" : "bg-slate-400"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">{m.status.replace('_', ' ')}</span>
                          </div>
                        </div>

                        <button className="text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Subtasks */}
                      {isExpanded && (
                        <div className="p-4 bg-white space-y-2 border-t border-slate-100">
                          {m.subtasks.map(st => (
                            <div 
                              key={st.id} 
                              onClick={() => toggleSubtask(m.id, st.id)}
                              className="flex items-center gap-2 p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition text-xs font-medium text-slate-800"
                            >
                              <CheckCircle2 className={cn("w-4 h-4 shrink-0 transition", st.completed ? "text-emerald-500" : "text-slate-300")} />
                              <span className={st.completed ? "line-through text-slate-400" : ""}>{st.title}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardShell>
  )
}
