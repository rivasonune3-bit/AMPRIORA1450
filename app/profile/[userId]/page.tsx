"use client"

import React, { useEffect, useState, use } from 'react'
import DashboardShell from '../../components/DashboardShell'
import Link from 'next/link'
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ExternalLink, 
  FileText, 
  Award, 
  Sparkles, 
  Cpu, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  Code,
  Calendar,
  CheckCircle2,
  Building2,
  Target
} from 'lucide-react'
import { cn } from '../../../lib/utils'

export default function PublicProfilePage({
  params
}: {
  params: Promise<{ userId: string }>
}) {
  const resolvedParams = use(params)
  const userId = resolvedParams.userId

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPublicProfile() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/profile/${userId}`)
        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || 'User profile not found')
        } else {
          setProfile(data.profile)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPublicProfile()
    }
  }, [userId])

  if (loading) {
    return (
      <DashboardShell>
        <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading member profile...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !profile) {
    return (
      <DashboardShell>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Member Profile Not Found</h2>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            {error || 'The profile you are looking for does not exist or is private.'}
          </p>
          <Link 
            href="/feed" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Community Feed
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const avatarInitial = (profile.fullName || 'M').charAt(0).toUpperCase()

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto pb-16 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/feed" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </Link>
        </div>

        {/* HERO BANNER CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
          <div className="h-44 bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 relative">
            {profile.banner && (
              <img src={profile.banner} alt="Profile banner" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-16 mb-6">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center font-bold text-3xl shadow-xl overflow-hidden shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarInitial}</span>
                  )}
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{profile.fullName}</h1>
                    <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-indigo-100">
                      AMPRIORA Member
                    </span>
                  </div>
                  <p className="text-indigo-600 font-semibold text-sm mt-0.5 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-500" />
                    Target Role: {profile.targetRole || profile.careerGoal || 'Software Engineer'}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 self-stretch md:self-auto">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors">
                    <Code className="w-4 h-4" />
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
              {profile.education && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  {profile.education} {profile.branch ? `(${profile.branch})` : ''}
                </span>
              )}
              {profile.dreamCompany && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  Dream Target: {profile.dreamCompany}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="md:col-span-8 space-y-6">
            
            {/* ABOUT */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> About
              </h2>
              {profile.about ? (
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{profile.about}</p>
              ) : (
                <p className="text-slate-400 text-sm italic">No professional summary added yet.</p>
              )}
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" /> Technical Skills
              </h2>
              {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: any, idx: number) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name
                    const prof = typeof skill === 'object' ? skill.proficiency : null
                    return (
                      <span key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {skillName}
                        {prof && <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{prof}</span>}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No skills listed.</p>
              )}
            </div>

            {/* PROJECTS */}
            {Array.isArray(profile.projects) && profile.projects.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-500" /> Featured Projects
                </h2>
                <div className="space-y-4">
                  {profile.projects.map((proj: any, idx: number) => (
                    <div key={proj.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                            GitHub <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                            Live Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PUBLIC POSTS BY THIS USER */}
            {Array.isArray(profile.posts) && profile.posts.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Recent Posts
                </h2>
                <div className="space-y-4">
                  {profile.posts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1.5">{post.createdAt || 'Recent'}</p>
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-4 space-y-6">
            
            {/* EDUCATION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> Education
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{profile.education || 'Institution Not Specified'}</p>
                  <p className="text-slate-500">{profile.branch || 'General Studies'} {profile.year ? `• ${profile.year}` : ''}</p>
                </div>
              </div>
            </div>

            {/* BADGES & ACHIEVEMENTS */}
            {Array.isArray(profile.badges) && profile.badges.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" /> Badges & Milestones
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge: string, idx: number) => (
                    <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
