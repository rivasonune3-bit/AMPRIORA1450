"use client"

import { useState, useEffect, useMemo } from 'react'
import { useProfileContext } from '../components/ProfileProvider'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import {
  FolderGit2,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Code,
  Sparkles,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Plus,
  Globe,
  ShieldCheck,
  Trophy,
  Award,
  Search,
  ArrowUpRight,
  Cpu,
  FileCode,
  QrCode,
  X,
  User,
  GraduationCap,
  Briefcase,
  Loader2,
  MapPin,
  Building2,
  Target,
  Edit2
} from 'lucide-react'
import { cn } from '../../lib/utils'

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string
  githubUrl: string
  liveUrl: string
  topics: string[]
}

interface GitHubLanguage {
  name: string
  percentage: number
}

export default function SmartPortfolioPage() {
  const { profile, loading: profileLoading } = useProfileContext()

  const [copiedLink, setCopiedLink] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'all' | 'projects' | 'github'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // GitHub Real Data State
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubUser, setGithubUser] = useState<any | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubLanguages, setGithubLanguages] = useState<GitHubLanguage[]>([])
  const [githubError, setGithubError] = useState<string | null>(null)

  const onboarding = profile?.onboarding || {}
  const fullName = profile?.full_name || onboarding?.fullName || 'AMPRIORA Member'
  const targetRole = onboarding?.targetRole || onboarding?.careerGoal || 'Software Engineer'
  const education = onboarding?.education || onboarding?.branch || 'Student Developer'
  const location = onboarding?.location || 'India'
  const githubInput = onboarding?.github || ''
  const avatar = onboarding?.avatar || ''
  const projects = Array.isArray(onboarding?.projects) ? onboarding.projects : (onboarding?.resume?.projects || [])
  const skills = Array.isArray(onboarding?.skills) ? onboarding.skills : []
  const experiences = Array.isArray(onboarding?.experiences) ? onboarding.experiences : []
  const certifications = Array.isArray(onboarding?.certifications) ? onboarding.certifications : []
  const badges = Array.isArray(onboarding?.badges) ? onboarding.badges : []

  // Fetch real GitHub data if user has connected a GitHub username
  useEffect(() => {
    async function fetchGitHubData() {
      if (!githubInput) {
        setGithubUser(null)
        setGithubRepos([])
        setGithubLanguages([])
        return
      }

      setGithubLoading(true)
      setGithubError(null)

      try {
        const res = await fetch(`/api/github?username=${encodeURIComponent(githubInput)}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          setGithubError(data.error || 'Failed to fetch GitHub data')
          setGithubUser(null)
          setGithubRepos([])
          setGithubLanguages([])
        } else {
          setGithubUser(data.user)
          setGithubRepos(data.repos || [])
          setGithubLanguages(data.languages || [])
        }
      } catch (err: any) {
        setGithubError(err.message || 'Error fetching GitHub data')
      } finally {
        setGithubLoading(false)
      }
    }

    fetchGitHubData()
  }, [githubInput])

  // Deterministic Transparent Portfolio Readiness Score
  const scoreBreakdown = useMemo(() => {
    const checks = [
      { name: 'Profile Summary & Details', points: 15, met: Boolean(onboarding?.about || onboarding?.bio) },
      { name: 'Target Role & Education Set', points: 15, met: Boolean(targetRole && education) },
      { name: 'Verified Skills (3+ listed)', points: 20, met: skills.length >= 3 },
      { name: 'Featured Projects (1+ added)', points: 20, met: projects.length >= 1 },
      { name: 'Experience or Certifications', points: 15, met: experiences.length >= 1 || certifications.length >= 1 },
      { name: 'GitHub Connected & Verified', points: 15, met: Boolean(githubUser) }
    ]

    const totalScore = checks.reduce((acc, curr) => acc + (curr.met ? curr.points : 0), 0)
    return { checks, totalScore }
  }, [onboarding, targetRole, education, skills, projects, experiences, certifications, githubUser])

  // Extract dynamic categories strictly from real user projects tech stack and repo languages
  const dynamicTechCategories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((proj: any) => {
      if (Array.isArray(proj.techStack)) {
        proj.techStack.forEach((t: string) => {
          if (t && typeof t === 'string') set.add(t.trim())
        })
      }
    })
    githubRepos.forEach((repo) => {
      if (repo.language) set.add(repo.language.trim())
    })
    return Array.from(set)
  }, [projects, githubRepos])

  const handleCopyLink = () => {
    const handle = fullName.toLowerCase().replace(/\s+/g, '')
    const url = typeof window !== 'undefined' ? `${window.location.origin}/profile/${profile?.id || ''}` : `https://ampriora.com/@${handle}`
    navigator.clipboard?.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Filter combined projects & repos
  const filteredItems = useMemo(() => {
    let list: any[] = []

    // 1. Add Profile Projects
    if (selectedTab === 'all' || selectedTab === 'projects') {
      projects.forEach((proj: any) => {
        list.push({
          id: `proj-${proj.id || proj.title}`,
          type: 'project',
          title: proj.title,
          description: proj.description || 'Profile showcase project.',
          githubUrl: proj.githubUrl,
          demoUrl: proj.demoUrl,
          techStack: proj.techStack || []
        })
      })
    }

    // 2. Add GitHub Repos
    if (selectedTab === 'all' || selectedTab === 'github') {
      githubRepos.forEach(repo => {
        list.push({
          id: `gh-${repo.id}`,
          type: 'github',
          title: repo.name,
          description: repo.description,
          githubUrl: repo.githubUrl,
          demoUrl: repo.liveUrl,
          stars: repo.stars,
          forks: repo.forks,
          language: repo.language,
          topics: repo.topics
        })
      })
    }

    // Filter by category if selected
    if (selectedCategory !== 'all') {
      list = list.filter(item => {
        if (item.language && item.language.toLowerCase() === selectedCategory.toLowerCase()) return true
        if (Array.isArray(item.techStack) && item.techStack.some((t: string) => t.toLowerCase() === selectedCategory.toLowerCase())) return true
        return false
      })
    }

    // Filter by search query
    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.language && item.language.toLowerCase().includes(q))
    )
  }, [projects, githubRepos, selectedTab, selectedCategory, searchQuery])

  if (profileLoading) {
    return (
      <DashboardShell>
        <div className="max-w-7xl mx-auto py-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs font-medium">Loading Smart Portfolio...</p>
        </div>
      </DashboardShell>
    )
  }

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${profile?.id || ''}` : ''

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        <FeatureBanner
          title="Smart Portfolio"
          subtitle="Your verified single-source-of-truth showcase of projects, real GitHub activity, and skills."
          icon={FolderGit2}
          bgPatternIcon={Code}
        />

        {/* HEADER PROFILE BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            
            {/* User Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-bold text-3xl text-white bg-slate-800 border-2 border-indigo-400/40 shadow-lg overflow-hidden shrink-0">
                {avatar ? (
                  <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{fullName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    AMPRIORA Member
                  </span>
                </div>

                <p className="text-slate-300 text-sm font-medium">
                  {targetRole} · {education}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                  {githubInput && (
                    <a href={`https://github.com/${githubInput.replace(/https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-200 hover:text-white transition">
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>github.com/{githubInput.replace(/https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '')}</span>
                    </a>
                  )}
                  {location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center bg-slate-800/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 mr-2 font-mono truncate max-w-[160px] sm:max-w-none">
                  {profileUrl || `ampriora.com/@${fullName.toLowerCase().replace(/\s+/g, '')}`}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-1 text-slate-300 hover:text-white transition"
                  title="Copy Profile URL"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                  title="QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <Link
                  href="/profile"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* PORTFOLIO SCORE & GITHUB INTEGRATION HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* REAL TRANSPARENT PORTFOLIO SCORE CARD (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Portfolio Readiness Score
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 border text-xs font-bold rounded-full",
                  scoreBreakdown.totalScore >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  {scoreBreakdown.totalScore >= 70 ? 'Strong Readiness' : 'In Progress'}
                </span>
              </div>

              {scoreBreakdown.totalScore > 0 ? (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold text-slate-900">{scoreBreakdown.totalScore}</span>
                    <span className="text-slate-400 font-semibold text-sm">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    Calculated deterministically from your verified profile sections, skills, and connected GitHub data.
                  </p>
                </>
              ) : (
                <div className="my-4 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="font-bold text-slate-900 text-sm mb-1">Portfolio score incomplete</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Add your skills, projects, and target role in your profile to generate your readiness insights.
                  </p>
                </div>
              )}

              {/* Transparent Breakdown Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Score Composition
                </span>
                {scoreBreakdown.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-slate-700">
                      {check.met ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0 inline-block" />
                      )}
                      <span>{check.name}</span>
                    </span>
                    <span className={cn("font-bold text-[11px]", check.met ? "text-emerald-600" : "text-slate-400")}>
                      +{check.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link
                href="/profile"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
              >
                Complete Profile Sections →
              </Link>
            </div>
          </div>

          {/* REAL GITHUB INTEGRATION HUB (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-slate-900" />
                  <h3 className="font-bold text-slate-900 text-base">GitHub Activity & Repositories</h3>
                </div>

                {githubUser && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    ● Connected
                  </span>
                )}
              </div>

              {/* GitHub Connected State */}
              {githubUser ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={githubUser.avatarUrl} alt={githubUser.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{githubUser.name}</h4>
                        <p className="text-xs text-slate-500">@{githubUser.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{githubUser.publicRepos}</span>
                        <span className="text-slate-500 text-[11px]">Public Repos</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{githubUser.followers}</span>
                        <span className="text-slate-500 text-[11px]">Followers</span>
                      </div>
                      <a
                        href={githubUser.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Real GitHub Top Languages */}
                  {githubLanguages.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Core Languages (Real Repository Breakdown)</span>
                      </div>

                      <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
                        {githubLanguages.map((lang, idx) => {
                          const colors = ['bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500']
                          return (
                            <div
                              key={lang.name}
                              className={cn(colors[idx % colors.length], "h-full")}
                              style={{ width: `${lang.percentage}%` }}
                              title={`${lang.name} ${lang.percentage}%`}
                            />
                          )
                        })}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1 font-medium">
                        {githubLanguages.map((lang, idx) => {
                          const dotColors = ['bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500']
                          return (
                            <span key={lang.name} className="flex items-center gap-1.5">
                              <span className={cn("w-2.5 h-2.5 rounded-full", dotColors[idx % dotColors.length])} />
                              {lang.name} ({lang.percentage}%)
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* GitHub Unconnected Clean State (Requirement 3 & 7) */
                <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-6">
                  <GithubIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-base mb-1">Connect your GitHub</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                    Add your GitHub username to your AMPRIORA profile to import and display your real repositories and language activity.
                  </p>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add GitHub in Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROJECTS & REPOSITORIES SECTION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Portfolio Projects & Code</h3>
              <p className="text-xs text-slate-500">Real projects from your profile and connected GitHub repositories.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'All Work' },
                { id: 'projects', label: `Profile Projects (${projects.length})` },
                { id: 'github', label: `GitHub Repos (${githubRepos.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    selectedTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Tech Category Pills (Derived strictly from real project & GitHub data) */}
            {dynamicTechCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Tech Filter:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                    selectedCategory === 'all'
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  All Tech
                </button>
                {dynamicTechCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory.toLowerCase() === cat.toLowerCase() ? 'all' : cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects / Repos Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-indigo-600 shrink-0" />
                        <h4 className="font-bold text-slate-900 text-base truncate">{item.title}</h4>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        item.type === 'project' ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-sky-50 text-sky-700 border-sky-200"
                      )}>
                        {item.type === 'project' ? 'Featured Project' : 'GitHub Repo'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal">
                      {item.description}
                    </p>

                    {item.techStack && item.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.techStack.map((tech: string, idx: number) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      {item.language && (
                        <span className="flex items-center gap-1 text-slate-700 font-bold">
                          <Code className="w-3.5 h-3.5 text-indigo-500" /> {item.language}
                        </span>
                      )}
                      {typeof item.stars === 'number' && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" /> {item.stars}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        >
                          Code <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      )}
                      {item.demoUrl && (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          Demo <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY PROJECTS STATE (Requirement 10) */
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
              <Code className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-base mb-1">No projects added yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Add your featured projects in your profile to showcase your engineering work here.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Projects in Profile
              </Link>
            </div>
          )}
        </div>

        {/* VERIFIED HONORS & BADGES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Verified Honors & Certifications</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Profile Single Source</span>
          </div>

          {certifications.length > 0 || badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certifications.map((cert: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
                    🎖️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cert.name || cert.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuer || 'Verified Issuer'}</p>
                    {cert.date && <span className="text-[10px] text-indigo-600 font-semibold">{cert.date}</span>}
                  </div>
                </div>
              ))}

              {badges.map((badge: string, idx: number) => (
                <div key={`badge-${idx}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{badge}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">AMPRIORA Verified Milestone</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-xs font-medium">No certifications added yet.</p>
              <Link href="/profile" className="text-indigo-600 font-bold text-xs hover:underline mt-1 inline-block">
                Add Certifications in Profile
              </Link>
            </div>
          )}
        </div>

        {/* QR Code Share Modal */}
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Public Profile QR</h3>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
                <QRCode value={profileUrl || `https://ampriora.com/@${fullName.toLowerCase().replace(/\s+/g, '')}`} size={160} />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Scan to open {fullName}&apos;s verified public AMPRIORA profile and portfolio projects.
              </p>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  )
}
