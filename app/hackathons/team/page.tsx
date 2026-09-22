"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../../components/DashboardShell'
import supabaseBrowser from '../../../lib/supabaseClient'
import { useProfileContext } from '../../components/ProfileProvider'
import { Users, Plus, Search, Tag, UserPlus, CheckCircle2, Trophy, Briefcase, ArrowRight } from 'lucide-react'
import EmptyState from '../../components/EmptyState'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  hackathon: string
  role: string
  skillsNeeded: string[]
  description: string
}

const SUGGESTED_TEAMMATES = [
  { id: '1', name: 'Alice Chen', role: 'Frontend Developer', skills: ['React', 'Tailwind', 'Figma'] },
  { id: '2', name: 'Bob Smith', role: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'AWS'] },
  { id: '3', name: 'Charlie Davis', role: 'UI/UX Designer', skills: ['Figma', 'Prototyping', 'User Research'] },
  { id: '4', name: 'Diana Prince', role: 'Data Scientist', skills: ['Python', 'Machine Learning', 'PyTorch'] },
]

export default function TeamBuildingPage() {
  const [profile, setProfile] = useState<any>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [activeTab, setActiveTab] = useState<'my_teams' | 'find_teammates'>('my_teams')
  
  // Create team form
  const [isCreating, setIsCreating] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', hackathon: '', role: '', description: '', skillsNeeded: '' })
  
  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()
  
  useEffect(() => {
    if (!profileLoading) {
      if (contextProfile) {
        setProfile(contextProfile)
        setTeams(contextProfile?.onboarding?.teams || [])
      } else {
        setError('Failed to load profile')
      }
      setLoading(false)
    }
  }, [contextProfile, profileLoading])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!profile) return
    
    const teamData: Team = {
      id: Math.random().toString(36).substring(7),
      name: newTeam.name,
      hackathon: newTeam.hackathon,
      role: newTeam.role,
      description: newTeam.description,
      skillsNeeded: newTeam.skillsNeeded.split(',').map(s => s.trim()).filter(Boolean)
    }
    
    const updatedTeams = [...teams, teamData]
    
    try {
      const updatedOnboarding = { ...profile.onboarding, teams: updatedTeams }
      
      const ok = await updateProfile({ onboarding: updatedOnboarding }, false)
      if(!ok) throw new Error('Failed to save team')
      
      setTeams(updatedTeams)
      setProfile({ ...profile, onboarding: updatedOnboarding })
      setIsCreating(false)
      setNewTeam({ name: '', hackathon: '', role: '', description: '', skillsNeeded: '' })
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Building</h1>
            <p className="text-slate-500 mt-1">Create a team or find teammates for your next hackathon.</p>
          </div>
          <button 
            onClick={() => { setActiveTab('my_teams'); setIsCreating(true); }}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => { setActiveTab('my_teams'); setIsCreating(false); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'my_teams' && !isCreating
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            My Teams
          </button>
          <button
            onClick={() => { setActiveTab('find_teammates'); setIsCreating(false); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'find_teammates' && !isCreating
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Find Teammates
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : (
          <div className="mt-6">
            {isCreating ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Create a New Team</h2>
                <form onSubmit={handleCreateTeam} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Team Name</label>
                    <input 
                      required
                      type="text" 
                      value={newTeam.name}
                      onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="E.g. The Innovators"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hackathon</label>
                    <input 
                      required
                      type="text" 
                      value={newTeam.hackathon}
                      onChange={e => setNewTeam({...newTeam, hackathon: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Which hackathon are you entering?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Role</label>
                    <input 
                      required
                      type="text" 
                      value={newTeam.role}
                      onChange={e => setNewTeam({...newTeam, role: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="E.g. Team Lead, Frontend, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description / Project Idea</label>
                    <textarea 
                      required
                      value={newTeam.description}
                      onChange={e => setNewTeam({...newTeam, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
                      placeholder="Describe what you plan to build..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Skills Needed (Comma separated)</label>
                    <input 
                      type="text" 
                      value={newTeam.skillsNeeded}
                      onChange={e => setNewTeam({...newTeam, skillsNeeded: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="E.g. UI/UX, Python, React"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Create Team
                    </button>
                  </div>
                </form>
              </div>
            ) : activeTab === 'my_teams' ? (
              <div>
                {teams.length === 0 ? (
                  <EmptyState 
                    title="No teams yet" 
                    message="You haven't created or joined any teams. Create a team to get started."
                    icon={<Users />}
                    action={
                      <button 
                        onClick={() => setIsCreating(true)}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create a Team
                      </button>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                      <div key={team.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                              <Users className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                              {team.role}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{team.name}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 mb-4">
                            <Trophy className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{team.hackathon}</span>
                          </div>
                          
                          <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                            {team.description}
                          </p>
                          
                          {team.skillsNeeded.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-slate-500 mb-2">Looking for:</div>
                              <div className="flex flex-wrap gap-1.5">
                                {team.skillsNeeded.slice(0, 3).map((skill, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                                {team.skillsNeeded.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium">
                                    +{team.skillsNeeded.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 pt-5 border-t border-slate-100">
                          <Link 
                            href={`/hackathons/team/${team.id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            Go to Workspace
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by role or skills..." 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SUGGESTED_TEAMMATES.map(user => (
                    <div key={user.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start justify-between hover:shadow-sm transition-all">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{user.name}</h4>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {user.role}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {user.skills.map((skill, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs border border-slate-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors shrink-0" title="Send Request">
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
