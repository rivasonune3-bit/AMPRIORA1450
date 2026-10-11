"use client"

import React, { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { 
  FolderOpen, 
  Star, 
  ExternalLink, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Code2, 
  GitFork, 
  Eye, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  Send,
  Layers,
  Heart,
  TrendingUp,
  Bookmark,
  Share2,
  Terminal,
  Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

interface ProjectItem {
  id: string
  title: string
  tagline: string
  description: string
  coverGradient: string
  stage: 'Live Production' | 'MVP' | 'Beta' | 'Open Source'
  starsCount: number
  forksCount: number
  hasStarred: boolean
  isSaved: boolean
  githubUrl: string
  liveDemoUrl: string
  techStack: string[]
  creator: {
    name: string
    avatar: string
    role: string
    universityOrCompany: string
  }
  openRoles?: {
    role: string
    commitment: string
    skills: string[]
  }[]
  featured?: boolean
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'AgentForge - Autonomous Multi-Tool Agentic Engine',
    tagline: 'Orchestrate autonomous LLM agents with tree-of-thought verification & sandboxed execution.',
    description: 'An open-source distributed orchestrator for agentic workflows. Supports dynamic subagent branching, live browser automation via CDP, and self-correcting code generation pipelines.',
    coverGradient: 'from-violet-600 via-indigo-600 to-sky-600',
    stage: 'Open Source',
    starsCount: 842,
    forksCount: 128,
    hasStarred: false,
    isSaved: true,
    githubUrl: 'https://github.com/ampriora/agentforge',
    liveDemoUrl: 'https://agentforge.dev',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Next.js', 'Docker', 'Redis'],
    creator: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Creator & Lead Maintainer',
      universityOrCompany: 'UC Berkeley CS'
    },
    openRoles: [
      { role: 'CUDA / Quantization Specialist', commitment: '5-10 hrs/wk', skills: ['C++', 'CUDA', 'vLLM'] },
      { role: 'Frontend Design Engineer', commitment: '4-8 hrs/wk', skills: ['React 19', 'Tailwind', 'Framer'] }
    ],
    featured: true
  },
  {
    id: 'proj-2',
    title: 'PulseCanvas - Multiplayer Whiteboard for Engineering Teams',
    tagline: 'Real-time collaborative diagramming and code block synchronization over WebSockets.',
    description: 'Built with CRDTs and WebAssembly to support zero-latency vector canvas drawing, interactive architecture charts, and instant GitHub export.',
    coverGradient: 'from-blue-600 via-cyan-600 to-emerald-600',
    stage: 'Live Production',
    starsCount: 520,
    forksCount: 64,
    hasStarred: true,
    isSaved: false,
    githubUrl: 'https://github.com/ampriora/pulsecanvas',
    liveDemoUrl: 'https://pulsecanvas.io',
    techStack: ['TypeScript', 'Rust (Wasm)', 'Next.js', 'WebSockets', 'Tailwind'],
    creator: {
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Product Designer & Eng',
      universityOrCompany: 'Carnegie Mellon University'
    },
    openRoles: [
      { role: 'Wasm Performance Engineer', commitment: '5 hrs/wk', skills: ['Rust', 'WebAssembly'] }
    ]
  },
  {
    id: 'proj-3',
    title: 'ChronosDB - Embedded Time-Series Storage for Edge AI',
    tagline: 'Ultra-lightweight column-oriented TSDB engineered in modern C++20 and Rust.',
    description: 'Processes 2.5 million metrics/sec per core with native downsampling and zstandard block compression. Designed for IoT sensor arrays and robotics telemetry.',
    coverGradient: 'from-amber-600 via-orange-600 to-rose-600',
    stage: 'Beta',
    starsCount: 418,
    forksCount: 42,
    hasStarred: false,
    isSaved: false,
    githubUrl: 'https://github.com/ampriora/chronos-db',
    liveDemoUrl: 'https://chronosdb.org',
    techStack: ['Rust', 'C++20', 'SIMD', 'Linux eBPF'],
    creator: {
      name: 'Devika Nair',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Systems Architect',
      universityOrCompany: 'Bengaluru Tech Guild'
    }
  },
  {
    id: 'proj-4',
    title: 'ZeroVault - Client-Side Encrypted Password & Key Manager',
    tagline: 'End-to-end encrypted credential storage with biometric webauthn and zero-knowledge proofs.',
    description: 'Your secrets never leave your device unencrypted. Audited cryptography using Argon2id, ChaCha20-Poly1305, and decentralized IPFS backup sync.',
    coverGradient: 'from-emerald-600 via-teal-600 to-sky-700',
    stage: 'MVP',
    starsCount: 310,
    forksCount: 31,
    hasStarred: false,
    isSaved: false,
    githubUrl: 'https://github.com/ampriora/zerovault',
    liveDemoUrl: 'https://zerovault.security',
    techStack: ['React', 'Web Cryptography API', 'WebAuthn', 'Supabase'],
    creator: {
      name: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'Security Researcher',
      universityOrCompany: 'UT Austin'
    },
    openRoles: [
      { role: 'Mobile Flutter Engineer', commitment: '6 hrs/wk', skills: ['Flutter', 'Dart', 'Keyring'] }
    ]
  },
  {
    id: 'proj-5',
    title: 'ScribeAI - Medical Charting & Clinical Speech Transcriber',
    tagline: 'Fine-tuned Whisper model for medical jargon with structured EHR export.',
    description: 'Converts doctor-patient voice consults into structured SOAP notes adhering to FHIR HL7 standards. 99.4% accuracy on pharmacology terminology.',
    coverGradient: 'from-fuchsia-600 via-purple-600 to-indigo-700',
    stage: 'MVP',
    starsCount: 275,
    forksCount: 29,
    hasStarred: false,
    isSaved: false,
    githubUrl: 'https://github.com/ampriora/scribe-ai',
    liveDemoUrl: 'https://scribe-ai.health',
    techStack: ['PyTorch', 'Whisper', 'FastAPI', 'Next.js', 'PostgreSQL'],
    creator: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'AI Researcher',
      universityOrCompany: 'Stanford Health Tech Lab'
    }
  },
  {
    id: 'proj-6',
    title: 'EcoRoute - Carbon-Optimized Freight Routing Algorithm',
    tagline: 'Multi-objective graph optimization for reducing logistics fuel burn by 18%.',
    description: 'Built during Stanford TreeHacks 2026. Utilizes real-time traffic topography and elevation gradients to calculate the greenest transit routes.',
    coverGradient: 'from-teal-600 via-emerald-600 to-cyan-600',
    stage: 'Beta',
    starsCount: 194,
    forksCount: 19,
    hasStarred: false,
    isSaved: false,
    githubUrl: 'https://github.com/ampriora/ecoroute',
    liveDemoUrl: 'https://ecoroute.app',
    techStack: ['Python', 'NetworkX', 'OpenStreetMap', 'FastAPI', 'Leaflet'],
    creator: {
      name: 'Julian Alvarez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Full-Stack Developer',
      universityOrCompany: 'Univ. of Washington'
    }
  }
]

const CATEGORIES = ['All Projects', 'AI & Agents', 'Developer Tools', 'Web & SaaS', 'Systems & Low Level', 'Seeking Collaborators']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS)
  const [selectedCategory, setSelectedCategory] = useState('All Projects')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'stars' | 'newest' | 'open_roles'>('stars')

  // Submit Project Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTagline, setNewTagline] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newGithub, setNewGithub] = useState('')
  const [newDemo, setNewDemo] = useState('')
  const [newStack, setNewStack] = useState('Next.js, TypeScript, Tailwind')
  const [newStage, setNewStage] = useState<'MVP' | 'Beta' | 'Live Production' | 'Open Source'>('MVP')
  const [newLookingForRole, setNewLookingForRole] = useState('')

  // Apply to Collaborate Modal
  const [selectedProjectForCollab, setSelectedProjectForCollab] = useState<ProjectItem | null>(null)
  const [selectedRoleToApply, setSelectedRoleToApply] = useState<string>('')
  const [collabPitch, setCollabPitch] = useState('')
  const [collabSuccess, setCollabSuccess] = useState(false)

  // Actions
  const toggleStar = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextStarred = !p.hasStarred
        return {
          ...p,
          hasStarred: nextStarred,
          starsCount: nextStarred ? p.starsCount + 1 : p.starsCount - 1
        }
      }
      return p
    }))
  }

  const toggleSave = (projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isSaved: !p.isSaved } : p))
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      tagline: newTagline || 'An innovative project built on Ampriora.',
      description: newDesc || 'Project created by student community member.',
      coverGradient: 'from-indigo-600 via-purple-600 to-pink-600',
      stage: newStage,
      starsCount: 1,
      forksCount: 0,
      hasStarred: true,
      isSaved: true,
      githubUrl: newGithub || 'https://github.com',
      liveDemoUrl: newDemo || 'https://demo.dev',
      techStack: newStack.split(',').map(s => s.trim()).filter(Boolean),
      creator: {
        name: 'You (Alex Vance)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'Creator & Builder',
        universityOrCompany: 'Ampriora Community'
      },
      openRoles: newLookingForRole.trim() ? [
        { role: newLookingForRole, commitment: '5 hrs/wk', skills: ['Communication', 'Development'] }
      ] : undefined
    }

    setProjects([created, ...projects])
    setIsSubmitModalOpen(false)
    setNewTitle('')
    setNewTagline('')
    setNewDesc('')
    setNewGithub('')
    setNewDemo('')
    setNewLookingForRole('')
  }

  const handleApplyCollab = (e: React.FormEvent) => {
    e.preventDefault()
    setCollabSuccess(true)
    setTimeout(() => {
      setCollabSuccess(false)
      setSelectedProjectForCollab(null)
      setCollabPitch('')
    }, 1800)
  }

  // Filtered and Sorted Projects
  const filteredProjects = projects.filter(p => {
    if (selectedCategory === 'Seeking Collaborators' && (!p.openRoles || p.openRoles.length === 0)) {
      return false
    }
    if (selectedCategory === 'AI & Agents' && !p.techStack.some(t => ['PyTorch', 'Python', 'Whisper', 'Transformers', 'FastAPI'].includes(t))) {
      return false
    }
    if (selectedCategory === 'Developer Tools' && !p.techStack.some(t => ['Rust', 'Docker', 'Redis', 'TypeScript', 'SIMD'].includes(t))) {
      return false
    }
    if (selectedCategory === 'Web & SaaS' && !p.techStack.some(t => ['Next.js', 'React', 'Supabase', 'WebSockets', 'Tailwind'].includes(t))) {
      return false
    }
    if (selectedCategory === 'Systems & Low Level' && !p.techStack.some(t => ['Rust', 'C++20', 'SIMD', 'Linux eBPF', 'Rust (Wasm)'].includes(t))) {
      return false
    }

    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.creator.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'stars') return b.starsCount - a.starsCount
    if (sortBy === 'open_roles') return (b.openRoles?.length || 0) - (a.openRoles?.length || 0)
    return 0
  })

  const spotlightProject = projects.find(p => p.featured) || projects[0]

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Top Hero Banner */}
        <FeatureBanner
          title="Community Project Showcase"
          subtitle="Discover breakthrough open-source tools, star peer innovations, demo your MVP to recruiters, and join active teams looking for co-builders."
          icon={Code2}
          bgPatternIcon={GitFork}
        >
          <button 
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl transition-all text-sm hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4" />
            Submit Your Project
          </button>
          <button 
            onClick={() => setSelectedCategory('Seeking Collaborators')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all text-sm"
          >
            <Users className="w-4 h-4" />
            Find Open Roles
          </button>
        </FeatureBanner>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">140+</div>
                <div className="text-xs text-slate-500 font-medium">Showcase Projects</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">48</div>
                <div className="text-xs text-slate-500 font-medium">Open Collab Roles</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">3.4k</div>
                <div className="text-xs text-slate-500 font-medium">Community Stars</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shrink-0">
                <GithubIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">82%</div>
                <div className="text-xs text-slate-500 font-medium">Open Source Repos</div>
              </div>
            </div>
          </div>

        {/* Featured Project of the Week Spotlight */}
        {spotlightProject && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
              
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Project of the Week
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                    {spotlightProject.stage}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {spotlightProject.title}
                </h2>

                <p className="text-base font-medium text-indigo-700 leading-snug">
                  {spotlightProject.tagline}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {spotlightProject.description}
                </p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {spotlightProject.techStack.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Creator info */}
                <div className="flex items-center gap-3 pt-2">
                  <img 
                    src={spotlightProject.creator.avatar} 
                    alt={spotlightProject.creator.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Created by {spotlightProject.creator.name}</div>
                    <div className="text-[11px] text-slate-500">{spotlightProject.creator.universityOrCompany}</div>
                  </div>
                </div>
              </div>

              {/* Action and Open Roles Box */}
              <div className="w-full lg:w-80 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => toggleStar(spotlightProject.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      spotlightProject.hasStarred
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Star className={cn("w-4 h-4", spotlightProject.hasStarred && "fill-current")} />
                    Star Project ({spotlightProject.starsCount})
                  </button>

                  <button 
                    onClick={() => toggleSave(spotlightProject.id)}
                    className={cn(
                      "p-2 rounded-xl border transition-colors",
                      spotlightProject.isSaved ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "border-slate-200 text-slate-400 hover:text-slate-700"
                    )}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {spotlightProject.openRoles && spotlightProject.openRoles.length > 0 && (
                  <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs space-y-2">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      Seeking Collaborators:
                    </div>
                    {spotlightProject.openRoles.map(r => (
                      <div key={r.role} className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-indigo-100">
                        <span className="font-semibold text-slate-800">{r.role}</span>
                        <span className="text-indigo-600 font-medium">{r.commitment}</span>
                      </div>
                    ))}
                    <button 
                      onClick={() => setSelectedProjectForCollab(spotlightProject)}
                      className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors"
                    >
                      Apply to Join Team
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a 
                    href={spotlightProject.githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" /> Repo
                  </a>
                  <a 
                    href={spotlightProject.liveDemoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search projects by tech (PyTorch, Next.js, Rust), keyword, or creator..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="stars">Most Starred</option>
                <option value="open_roles">Seeking Collaborators</option>
                <option value="newest">Latest Submissions</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Visual Header */}
              <div className={cn("p-5 text-white bg-gradient-to-r relative", project.coverGradient)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                    {project.stage}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => toggleStar(project.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-all",
                        project.hasStarred 
                          ? "bg-amber-400 text-slate-950 shadow-sm" 
                          : "bg-black/30 hover:bg-black/40 text-white"
                      )}
                    >
                      <Star className={cn("w-3.5 h-3.5", project.hasStarred && "fill-current")} />
                      {project.starsCount}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold leading-snug drop-shadow-sm group-hover:underline cursor-pointer">
                  {project.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-indigo-700">
                    {project.tagline}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Open Roles Badge */}
                  {project.openRoles && project.openRoles.length > 0 && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-bold text-emerald-900">Seeking Collaborator</div>
                        <div className="text-[11px] text-emerald-700">{project.openRoles[0].role}</div>
                      </div>
                      <button 
                        onClick={() => setSelectedProjectForCollab(project)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Creator and Links */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={project.creator.avatar} 
                      alt={project.creator.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">{project.creator.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>

                    <a 
                      href={project.liveDemoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <span>Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Submit Project Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Showcase Your Project</h3>
              <p className="text-sm text-slate-500 mt-1">Submit your side project or open source repo to get stars, feedback, and teammates.</p>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. HyperFlow Engine"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">One-line Tagline / Pitch</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Distributed asynchronous message bus for AI inference"
                  value={newTagline}
                  onChange={e => setNewTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Project Stage</label>
                  <select 
                    value={newStage}
                    onChange={e => setNewStage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="MVP">MVP</option>
                    <option value="Beta">Beta</option>
                    <option value="Live Production">Live Production</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Tech Stack</label>
                  <input 
                    type="text" 
                    placeholder="Next.js, PyTorch, Rust"
                    value={newStack}
                    onChange={e => setNewStack(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">GitHub Repo URL</label>
                  <input 
                    type="url" 
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={e => setNewGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Live Demo URL</label>
                  <input 
                    type="url" 
                    placeholder="https://myproject.dev"
                    value={newDemo}
                    onChange={e => setNewDemo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Open Role / Co-builder Needed (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Looking for 1 PyTorch ML Engineer (5 hrs/wk)"
                  value={newLookingForRole}
                  onChange={e => setNewLookingForRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  placeholder="What problem does it solve? Architecture highlights?"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all"
                >
                  Publish to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply to Collaborate Modal */}
      {selectedProjectForCollab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedProjectForCollab(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Join {selectedProjectForCollab.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apply to collaborate with <strong className="text-slate-800">{selectedProjectForCollab.creator.name}</strong>.
              </p>
            </div>

            {collabSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Collaboration Pitch Sent!</h4>
                <p className="text-xs text-emerald-700">
                  The creator has been notified on Ampriora and in their email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyCollab} className="space-y-4">
                {selectedProjectForCollab.openRoles && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Select Role</label>
                    <select 
                      value={selectedRoleToApply}
                      onChange={e => setSelectedRoleToApply(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {selectedProjectForCollab.openRoles.map(r => (
                        <option key={r.role} value={r.role}>{r.role} ({r.commitment})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Intro & Relevant Experience</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Tell the team why you are excited about this project and what relevant skills you bring..."
                    value={collabPitch}
                    onChange={e => setCollabPitch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setSelectedProjectForCollab(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
