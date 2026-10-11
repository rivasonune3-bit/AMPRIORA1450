"use client"
import DashboardShell from '../components/DashboardShell'
import { Briefcase, Zap, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useProfileContext } from '../components/ProfileProvider'
import { calculateCareerState, calculateOpportunityMatch } from '../../lib/careerEngine'
import { useMemo } from 'react'

export default function JobRecommendationsPage() {
  const { profile, loading } = useProfileContext()
  const careerState = useMemo(() => calculateCareerState(profile), [profile])

  const recommendations = [
    {
      id: 'job-1',
      title: `${careerState.targetRole} Intern`,
      company: careerState.dreamCompany,
      location: 'Remote',
      description: `Join our team to work with ${careerState.currentSkills.slice(0, 3).join(', ') || 'modern technology stack'}.`,
      skills: careerState.requiredSkills.slice(0, 4)
    },
    {
      id: 'job-2',
      title: `Junior ${careerState.targetRole}`,
      company: 'TechCorp Solutions',
      location: 'Hybrid',
      description: `Build scalable applications and master ${careerState.missingSkills[0] || 'System Design'}.`,
      skills: [...careerState.currentSkills.slice(0, 2), ...careerState.missingSkills.slice(0, 2)]
    },
    {
      id: 'job-3',
      title: `${careerState.targetRole} Associate`,
      company: 'Innovate AI',
      location: 'On-site',
      description: `Hands-on role developing products using ${careerState.currentSkills[0] || 'Python'}.`,
      skills: careerState.requiredSkills.slice(1, 5)
    }
  ]

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-3xl p-8 text-white shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-2xl font-bold">AI Job Recommendations SSoT</h1>
          </div>
          <p className="text-indigo-100 max-w-2xl text-sm">
            Curated opportunities dynamically matched against your current skills ({careerState.currentSkills.length}) and target goal: <strong className="text-white">{careerState.targetRole} at {careerState.dreamCompany}</strong>.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const matchScore = calculateOpportunityMatch(careerState.currentSkills, rec.skills)
              return (
                <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{rec.title}</h3>
                        <p className="text-xs text-slate-500">{rec.company} • {rec.location}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                      {matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {rec.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Link href="/jobs" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                      <span>View Jobs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
