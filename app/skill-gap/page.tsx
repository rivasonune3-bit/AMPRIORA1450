"use client"
import { useMemo, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { Target, TrendingUp, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useProfileContext } from '../components/ProfileProvider'
import { calculateCareerState } from '../../lib/careerEngine'
import { cn } from '../../lib/utils'

export default function SkillGapPage() {
  const { profile: contextProfile, loading: profileLoading } = useProfileContext()
  const [analyzing, setAnalyzing] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Derive career state dynamically from Profile SSoT
  const careerState = useMemo(() => calculateCareerState(contextProfile), [contextProfile])

  const runAiExplanation = async () => {
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding: contextProfile?.onboarding })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js.error || 'AI analysis request failed')
      if (js.data?.recommendation) {
        setAiRecommendation(js.data.recommendation)
      }
    } catch (e: any) {
      setError(e?.message || 'AI service error')
    } finally {
      setAnalyzing(false)
    }
  }

  if (profileLoading && !contextProfile) {
    return (
      <DashboardShell>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Skill Gap Analysis...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Header Hero Banner Driven by Profile SSoT */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Target className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Target className="w-6 h-6 text-indigo-200" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analysis SSoT</h1>
            </div>
            <p className="text-indigo-200 max-w-2xl text-sm mb-6">
              Comparing your Profile skills against <strong className="text-white">{careerState.dreamCompany}</strong> required skills for <strong className="text-white">{careerState.targetRole}</strong>.
            </p>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs text-indigo-200 mb-1">Target Skill Coverage</p>
                <p className="font-semibold text-3xl text-white">{careerState.skillCoverage}%</p>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <div className="h-3 bg-indigo-950/50 rounded-full overflow-hidden w-full">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      careerState.skillCoverage >= 75 ? "bg-emerald-400" : careerState.skillCoverage >= 40 ? "bg-amber-400" : "bg-red-400"
                    )} 
                    style={{ width: `${careerState.skillCoverage}%` }}
                  />
                </div>
              </div>
              <button 
                onClick={runAiExplanation}
                disabled={analyzing}
                className="px-5 py-2.5 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Running AI Analysis...</> : <><Sparkles className="w-4 h-4 text-amber-500" /> AI Deep Analysis</>}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Recommendation Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI & Engine Guidance</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
            {aiRecommendation || `Focus on mastering ${careerState.missingSkills.slice(0, 3).join(', ') || 'advanced system design'} to reach 100% skill coverage for ${careerState.dreamCompany} ${careerState.targetRole}.`}
          </p>
        </div>

        {/* Matched vs Missing Skills Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matched Skills Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills ({careerState.matchedSkills.length})</span>
              </h3>
              <span className="text-xs font-extrabold text-emerald-600">{careerState.skillCoverage}%</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {careerState.matchedSkills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                  {s}
                </span>
              ))}
              {careerState.matchedSkills.length === 0 && (
                <p className="text-xs text-slate-500">No required skills matched yet. Add skills in your Profile.</p>
              )}
            </div>
          </div>

          {/* Missing Skills Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Missing Skills ({careerState.missingSkills.length})</span>
              </h3>
              <span className="text-xs font-extrabold text-rose-600">{careerState.missingSkills.length} Needed</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {careerState.missingSkills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200">
                  {s}
                </span>
              ))}
              {careerState.missingSkills.length === 0 && (
                <p className="text-xs text-emerald-700 font-bold">100% Skill Coverage Achieved!</p>
              )}
            </div>
          </div>

        </div>

        {/* CTA to Roadmap */}
        <div className="mt-4 pt-6 border-t border-slate-200 flex justify-center">
          <Link 
            href="/roadmap" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-slate-900/10"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View Personalized Career Roadmap</span>
          </Link>
        </div>

      </div>
    </DashboardShell>
  )
}
