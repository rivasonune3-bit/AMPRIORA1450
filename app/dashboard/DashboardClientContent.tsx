"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProfileContext } from '../components/ProfileProvider'
import { calculateCareerState, calculateOpportunityMatch } from '../../lib/careerEngine'
import { cn } from '../../lib/utils'
import FeatureBanner from '../components/FeatureBanner'
import { 
  Target, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  ChevronRight,
  BookOpen,
  Code,
  FileText,
  Map as MapIcon,
  Circle,
  Building2,
  ArrowRight,
  Lightbulb,
  Zap,
  Activity,
  CheckCircle,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function DashboardClientContent() {
  const router = useRouter()
  const { profile: contextProfile, loading: profileLoading } = useProfileContext()
  
  // Local state for opportunities
  const [jobs, setJobs] = useState<any[]>([])
  const [internships, setInternships] = useState<any[]>([])
  const [hackathons, setHackathons] = useState<any[]>([])
  const [oppsLoading, setOppsLoading] = useState(true)

  // Derive Single Source of Truth Career State
  const careerState = useMemo(() => calculateCareerState(contextProfile), [contextProfile])

  // Fetch opportunities in background
  useEffect(() => {
    let mounted = true
    async function loadOpportunities() {
      try {
        const [jobsRes, internsRes, hacksRes] = await Promise.allSettled([
          fetch('/api/jobs').then(r => r.json()),
          fetch('/api/internships').then(r => r.json()),
          fetch('/api/hackathons').then(r => r.json())
        ])

        if (!mounted) return

        if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) {
          setJobs(jobsRes.value.data.slice(0, 3))
        }
        if (internsRes.status === 'fulfilled' && internsRes.value?.data) {
          setInternships(internsRes.value.data.slice(0, 3))
        }
        if (hacksRes.status === 'fulfilled' && hacksRes.value?.data) {
          setHackathons(hacksRes.value.data.slice(0, 2))
        }
      } catch (err) {
        console.error('Error fetching opportunities for dashboard:', err)
      } finally {
        if (mounted) setOppsLoading(false)
      }
    }

    loadOpportunities()
    return () => { mounted = false }
  }, [])

  // Redirect un-onboarded users to /onboarding
  useEffect(() => {
    if (!profileLoading && contextProfile) {
      if (!contextProfile.onboarding || !contextProfile.onboarding.completed) {
        router.push('/onboarding')
      }
    }
  }, [contextProfile, profileLoading, router])

  // Profile attributes driven strictly by SSoT
  const profile = contextProfile
  const onboarding = profile?.onboarding || {}
  const hasOnboarding = Boolean(profile?.onboarding && Object.keys(profile.onboarding).length > 0)
  const hasResume = Boolean(onboarding?.resumeData || onboarding?.resumeSections || onboarding?.resume)

  const rawFullName = profile?.full_name || 'Student'
  const fullName = rawFullName.includes('@') ? rawFullName.split('@')[0] : rawFullName
  const education = onboarding.education || onboarding.branch || 'Engineering / Technology'

  // Activity Metrics
  const coursesCompleted = onboarding.coursesCompleted || 0
  const problemsSolved = onboarding.problemsSolved || 0
  const jobsApplied = onboarding.jobsApplied || 0
  const jobsSaved = (onboarding.savedOpportunities || []).length
  const hacksJoined = onboarding.hackathonsJoined || 0
  const badgesEarned = (onboarding.badges || []).length

  // Build Next Recommended Actions list based on SSoT
  const nextActions = []

  if (!hasOnboarding) {
    nextActions.push({ 
      title: 'Complete Your Career Profile', 
      desc: 'Set your career target, dream company, and skills', 
      link: '/profile', 
      icon: <Target className="w-5 h-5" />, 
      color: 'text-sky-600', 
      bg: 'bg-sky-50' 
    })
  }

  if (!hasResume) {
    nextActions.push({ 
      title: 'Build your Professional Resume', 
      desc: 'Create an ATS-friendly resume in Resume Studio', 
      link: '/resume', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    })
  }

  nextActions.push({ 
    title: careerState.nextAction.title, 
    desc: careerState.nextAction.desc, 
    link: careerState.nextAction.link, 
    icon: <Zap className="w-5 h-5" />, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50' 
  })

  nextActions.push({ 
    title: 'Explore Recommended Jobs & Internships', 
    desc: `Discover active postings for ${careerState.targetRole}`, 
    link: '/jobs', 
    icon: <Briefcase className="w-5 h-5" />, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50' 
  })

  // Skeleton UI while loading profile context
  if (profileLoading && !contextProfile) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-slate-200/80 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-slate-200/80 rounded-3xl" />
          <div className="h-24 bg-slate-200/80 rounded-3xl" />
          <div className="h-24 bg-slate-200/80 rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Welcome Banner Driven by Profile SSoT */}
      <FeatureBanner 
        title={`Welcome back, ${fullName} 👋`}
        subtitle={`Targeting ${careerState.targetRole} at ${careerState.dreamCompany}. Keep building your skills.`}
        icon={Sparkles}
        bgPatternIcon={Target}
      >
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <Link 
            href="/profile" 
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur"
          >
            <span>Edit Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link 
            href="/dream-company" 
            className="px-4 py-2 bg-white text-sky-900 hover:bg-sky-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-700" />
            <span>{careerState.dreamCompany} Track</span>
          </Link>
        </div>
      </FeatureBanner>

      {/* Top 3 Core Career Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Career Readiness Score */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Career Readiness</span>
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Trophy className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{careerState.careerReadiness}%</span>
            <span className="text-xs text-slate-500">overall complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-700",
                careerState.careerReadiness >= 75 ? "bg-emerald-500" : careerState.careerReadiness >= 50 ? "bg-sky-500" : "bg-amber-500"
              )} 
              style={{ width: `${careerState.careerReadiness}%` }}
            />
          </div>
        </div>

        {/* Skill Coverage */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Coverage</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Target className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{careerState.skillCoverage}%</span>
            <span className="text-xs text-slate-500">{careerState.matchedSkills.length}/{careerState.requiredSkills.length} required skills</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${careerState.skillCoverage}%` }} />
          </div>
        </div>

        {/* Target Goal Track */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Goal Track</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Building2 className="w-4 h-4" /></span>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 truncate">{careerState.targetRole}</div>
            <div className="text-xs text-slate-500 truncate">at {careerState.dreamCompany}</div>
          </div>
          <Link href="/skill-gap" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 pt-1">
            <span>View Skill Gap Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Main Grid: Left Column (Next Actions & Roadmap) | Right Column (Current Skills & Opportunities) */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Priority Next Action Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Priority Action
              </span>
              <span className="text-xs text-slate-400">Tailored for {careerState.dreamCompany}</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{careerState.nextAction.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{careerState.nextAction.desc}</p>
            </div>
            <Link 
              href={careerState.nextAction.link} 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              <span>Take Action Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Recommended Actions List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                <span>Recommended Next Actions</span>
              </span>
            </h2>

            <div className="space-y-3">
              {nextActions.map((act, i) => (
                <Link
                  key={i}
                  href={act.link}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50/60 rounded-2xl border border-slate-100 hover:border-sky-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl border border-slate-200/60", act.bg, act.color)}>
                      {act.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition">{act.title}</h4>
                      <p className="text-[11px] text-slate-500">{act.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* Action Roadmap Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-indigo-600" />
                <span>Career Roadmap Preview</span>
              </h2>
              <Link href="/roadmap" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                View Full Roadmap →
              </Link>
            </div>

            <div className="space-y-3">
              {careerState.roadmapMilestones.map((m, idx) => (
                <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{m.title}</span>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded",
                      m.status === 'completed' ? "bg-emerald-100 text-emerald-800" : m.status === 'in_progress' ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                    )}>
                      {m.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {m.subtasks.map(st => (
                      <div key={st.id} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", st.completed ? "text-emerald-500" : "text-slate-300")} />
                        <span className={st.completed ? "line-through text-slate-400" : ""}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Current Skills & Missing Skills Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Code className="w-5 h-5 text-sky-600" />
              <span>Skill Profile SSoT</span>
            </h2>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Current Skills ({careerState.currentSkills.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {careerState.currentSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-lg border border-sky-100">
                    {s}
                  </span>
                ))}
                {careerState.currentSkills.length === 0 && (
                  <span className="text-xs text-slate-400">No skills added yet. Add skills in Profile.</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">Missing Skills for {careerState.dreamCompany}</span>
              <div className="flex flex-wrap gap-1.5">
                {careerState.missingSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100">
                    {s}
                  </span>
                ))}
                {careerState.missingSkills.length === 0 && (
                  <span className="text-xs text-emerald-600 font-bold">100% Skills Matched!</span>
                )}
              </div>
            </div>

            <Link href="/profile" className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl block border border-slate-200 transition">
              Manage Profile Skills →
            </Link>
          </div>

          {/* Recommended Opportunities with Match Scores */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Matched Jobs</span>
              </h2>
              <Link href="/jobs" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map(job => {
                const matchScore = calculateOpportunityMatch(careerState.currentSkills, job.skills || [careerState.targetRole])
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition block space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate">{job.title}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        {matchScore}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{job.company} • {job.location || 'Remote'}</div>
                  </Link>
                )
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
