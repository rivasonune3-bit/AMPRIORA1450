"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DashboardShell from '../../../components/DashboardShell'
import supabaseBrowser from '../../../../lib/supabaseClient'
import { ArrowLeft, CheckCircle2, Circle, Users, Link as LinkIcon, Code, Globe, Plus, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { useProfileContext } from '../../../components/ProfileProvider'

interface Team {
  id: string
  name: string
  hackathon: string
  role: string
  skillsNeeded: string[]
  description: string
  links?: { repo?: string; demo?: string; other?: string }
  milestones?: { id: string; title: string; completed: boolean }[]
}

const DEFAULT_MILESTONES = [
  { id: '1', title: 'Idea & Brainstorming', completed: true },
  { id: '2', title: 'Prototype / Wireframes', completed: false },
  { id: '3', title: 'Development & Implementation', completed: false },
  { id: '4', title: 'Final Testing', completed: false },
  { id: '5', title: 'Submission', completed: false },
]

export default function TeamWorkspacePage() {
  const params = useParams()
  const id = params.id as string
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { profile: contextProfile, loading: profileLoading } = useProfileContext()

  useEffect(() => {
    if (!profileLoading) {
      if (contextProfile) {
        const teams = contextProfile?.onboarding?.teams || []
        const found = teams.find((t: Team) => t.id === id)
        
        if(found) {
          // Initialize default milestones if missing
          if(!found.milestones) found.milestones = DEFAULT_MILESTONES
          if(!found.links) found.links = { repo: '', demo: '', other: '' }
          setTeam(found)
        } else {
          setError('Team not found')
        }
      } else {
        setError('Team not found')
      }
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [id, contextProfile, profileLoading])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !team) {
    return (
      <DashboardShell>
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
          {error || 'Team not found'}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/hackathons/team" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md">
                Workspace
              </span>
              <span className="text-sm font-medium text-slate-500">{team.hackathon}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{team.name}</h1>
          </div>
          
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Members
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Project Milestones</h2>
              <div className="space-y-4">
                {team.milestones?.map((milestone, idx) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <button className="text-slate-400 hover:text-purple-600 transition-colors">
                      {milestone.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 group-hover:text-purple-500 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`font-medium ${milestone.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-slate-500 border-2 border-dashed border-slate-200 rounded-xl hover:text-slate-900 hover:border-slate-300 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Project Idea</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{team.description}</p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Project Links
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Repository
                  </label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
                    <input 
                      type="text" 
                      placeholder="https://github.com/..." 
                      className="w-full px-3 py-2 text-sm bg-transparent border-none focus:ring-0"
                      defaultValue={team.links?.repo}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Demo URL
                  </label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full px-3 py-2 text-sm bg-transparent border-none focus:ring-0"
                      defaultValue={team.links?.demo}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Other Link
                  </label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full px-3 py-2 text-sm bg-transparent border-none focus:ring-0"
                      defaultValue={team.links?.other}
                    />
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors mt-2 text-sm">
                  Save Links
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
              <h2 className="text-lg font-bold text-purple-900 mb-2">Team Skills Needed</h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {team.skillsNeeded.map((skill, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 bg-white text-purple-700 rounded-lg text-xs font-medium border border-purple-100 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
