"use client"

import DashboardShell from '../components/DashboardShell'
import { useEffect, useMemo, useState } from 'react'
import supabase from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { useRouter } from 'next/navigation'
import { calculateCareerState } from '../../lib/careerEngine'
import { Building2, Search, Target, CheckCircle2, AlertCircle, ChevronRight, Briefcase, Zap, Loader2, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'NVIDIA', 'Meta', 'Apple', 'TCS', 'Infosys', 'Custom']
const ROLES = ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer']

export default function DreamCompany() {
  const router = useRouter()
  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()

  const [company, setCompany] = useState('Google')
  const [role, setRole] = useState('AI Engineer')
  const [customCompany, setCustomCompany] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Derive career state dynamically from Profile SSoT
  const careerState = useMemo(() => calculateCareerState(contextProfile), [contextProfile])

  useEffect(() => {
    if (!profileLoading) {
      if (!contextProfile) {
        router.push('/auth/login')
        return
      }
      const dCompany = contextProfile?.onboarding?.dreamCompany
      const dRole = contextProfile?.onboarding?.targetRole
      if (dCompany && COMPANIES.includes(dCompany)) {
        setCompany(dCompany)
      } else if (dCompany) {
        setCompany('Custom')
        setCustomCompany(dCompany)
      }
      if (dRole) setRole(dRole)
    }
  }, [contextProfile, profileLoading, router])

  const targetCompany = company === 'Custom' ? customCompany : company

  async function saveSelection() {
    if (!contextProfile) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updatedOnboarding = {
        ...(contextProfile.onboarding || {}),
        dreamCompany: targetCompany,
        targetRole: role
      }

      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if (!ok) throw new Error('Save failed')

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err?.message || 'Unable to save selection')
    } finally {
      setSaving(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-200'
    if (score >= 50) return 'text-amber-500 bg-amber-50 border-amber-200'
    return 'text-rose-500 bg-rose-50 border-rose-200'
  }

  if (profileLoading && !contextProfile) {
    return (
      <DashboardShell>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Dream Company Track...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 text-white border border-white/30 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur">
                ⭐ AMPRIORA Core Track
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Dream Company Track</h1>
            <p className="text-amber-100 max-w-xl text-sm mt-1">
              Select your target employer and role. Profile SSoT automatically calculates required skills and career readiness.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Target goal updated! Profile SSoT updated across Dashboard, Skill Gap & Roadmap.</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Target Selection Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                <span>Select Target Employer & Role</span>
              </h2>

              {/* Company Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Company</label>
                <select
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 transition"
                >
                  {COMPANIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {company === 'Custom' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Enter Custom Company</label>
                  <input
                    type="text"
                    value={customCompany}
                    onChange={e => setCustomCompany(e.target.value)}
                    placeholder="e.g. OpenAI, Stripe, Tesla"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              )}

              {/* Role Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 transition"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={saveSelection}
                disabled={saving || !targetCompany}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{saving ? 'Updating Profile SSoT...' : 'Save Target to Profile SSoT'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Dashboard (7 Cols) Driven by Profile SSoT */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Target Skill Coverage Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{careerState.dreamCompany} Track Analysis</h3>
                  <p className="text-xs text-slate-500">Target Role: {careerState.targetRole}</p>
                </div>
                <div className={cn("px-3 py-1.5 rounded-2xl border text-center font-extrabold text-sm", getScoreColor(careerState.skillCoverage))}>
                  {careerState.skillCoverage}% Skill Coverage
                </div>
              </div>

              {/* Matched vs Missing Skills breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Matched Skills */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills ({careerState.matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {careerState.matchedSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
                        {s}
                      </span>
                    ))}
                    {careerState.matchedSkills.length === 0 && (
                      <span className="text-xs text-slate-500">No required skills matched yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Missing Skills ({careerState.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {careerState.missingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-rose-800 border border-rose-200 text-[10px] font-bold rounded">
                        {s}
                      </span>
                    ))}
                    {careerState.missingSkills.length === 0 && (
                      <span className="text-xs text-emerald-700 font-bold">100% Skills Matched!</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Plan Milestones */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Recommended Preparation Steps for {careerState.dreamCompany}</span>
                <div className="space-y-1.5">
                  {careerState.roadmapMilestones.map((m, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardShell>
  )
}
