"use client"

import React, { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Share2, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Zap, 
  Flame, 
  Code, 
  GitBranch, 
  Users, 
  Star, 
  Check, 
  Copy, 
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  Terminal
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface BadgeItem {
  id: string
  name: string
  tagline: string
  description: string
  category: 'Core Engineering' | 'Hackathons' | 'AI & Data' | 'Community & Open Source' | 'Algorithms'
  rarity: 'Legendary' | 'Epic' | 'Rare' | 'Verified'
  icon: string
  rarityColor: {
    bg: string
    border: string
    text: string
    glow: string
    badgeBg: string
  }
  status: 'earned' | 'in_progress' | 'locked'
  progressPercentage?: number
  currentMetric?: string
  earnedDate?: string
  verificationHash?: string
  issuer: string
  skillsVerified: string[]
  criteria: string
}

const BADGES_DATA: BadgeItem[] = [
  {
    id: 'badge-1',
    name: 'Full-Stack Titan',
    tagline: 'Mastery over end-to-end distributed web applications & high-concurrency systems.',
    description: 'Demonstrated mastery across Next.js 19, Server Actions, distributed PostgreSQL architectures, and production edge caching.',
    category: 'Core Engineering',
    rarity: 'Legendary',
    icon: '⚡',
    rarityColor: {
      bg: 'from-amber-500/20 via-orange-500/10 to-amber-900/20',
      border: 'border-amber-400/40',
      text: 'text-amber-600',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    status: 'earned',
    earnedDate: 'Aug 04, 2026',
    verificationHash: '0x94F2A7D81C5399E2B017DA048892EF',
    issuer: 'AMPRIORA Proof-of-Skill Protocol',
    skillsVerified: ['Next.js', 'React 19', 'PostgreSQL', 'Distributed Caching', 'Edge Runtimes'],
    criteria: 'Build and deploy 3 production apps with 99.9% uptime and pass the Staff Full-Stack Assessment with >95% score.'
  },
  {
    id: 'badge-2',
    name: 'Hackathon Champion',
    tagline: 'Top 1% Winner across global Tier-1 collegiate and industry hackathons.',
    description: 'Awarded for securing 1st place in ETH Global and Stanford TreeHacks 2026 for building autonomous multi-agent tool executors.',
    category: 'Hackathons',
    rarity: 'Legendary',
    icon: '🏆',
    rarityColor: {
      bg: 'from-yellow-500/20 via-amber-500/10 to-rose-900/20',
      border: 'border-yellow-400/50',
      text: 'text-yellow-600',
      glow: 'shadow-yellow-500/20',
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300'
    },
    status: 'earned',
    earnedDate: 'Jul 19, 2026',
    verificationHash: '0x3E71BC4A99F01235D9824AA610E982',
    issuer: 'Major League Hacking & Ampriora',
    skillsVerified: ['Rapid Prototyping', 'System Design', 'AI Tool Calling', 'Public Pitching'],
    criteria: 'Secure Podium (Top 3) in a verified Tier-1 hackathon with over 500 competing developer teams.'
  },
  {
    id: 'badge-3',
    name: 'AI Agent Architect Level III',
    tagline: 'Deep-dive expertise in multimodal reasoning, tool orchestration, and fine-tuning.',
    description: 'Successfully engineered self-correcting agent chains with RAG vector indices and function calling on quantized LLMs.',
    category: 'AI & Data',
    rarity: 'Epic',
    icon: '🧠',
    rarityColor: {
      bg: 'from-purple-500/20 via-indigo-500/10 to-violet-900/20',
      border: 'border-purple-400/40',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/20',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    status: 'earned',
    earnedDate: 'Jul 28, 2026',
    verificationHash: '0x882AC51F670298B3219488EFAC1902',
    issuer: 'Anthropic / Ampriora AI Benchmark',
    skillsVerified: ['PyTorch', 'Function Calling', 'RAG', 'Prompt Engineering', 'LangChain/LlamaIndex'],
    criteria: 'Score above 90th percentile on the Multimodal LLM Agent Benchmarks and submit a verified public agent framework.'
  },
  {
    id: 'badge-4',
    name: 'Open Source Dynamo',
    tagline: '50+ merged PRs to globally recognized open-source repositories.',
    description: 'Recognized for impactful core contributions to developer tools, CLI utilities, and runtime compiler optimizations.',
    category: 'Community & Open Source',
    rarity: 'Epic',
    icon: '🐙',
    rarityColor: {
      bg: 'from-sky-500/20 via-blue-500/10 to-indigo-900/20',
      border: 'border-sky-400/40',
      text: 'text-sky-600',
      glow: 'shadow-sky-500/20',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    status: 'earned',
    earnedDate: 'Jun 12, 2026',
    verificationHash: '0x1109FA2980CBA5519349887A88B391',
    issuer: 'GitHub Verified Developer Program',
    skillsVerified: ['Git Workflows', 'Code Review', 'CI/CD Pipelines', 'Community Leadership'],
    criteria: 'Submit 50+ accepted pull requests to verified tier repositories with over 1,000 GitHub stars.'
  },
  {
    id: 'badge-5',
    name: 'Algorithm Ace (1800+ LeetCode)',
    tagline: 'Top 5% competitive coder in dynamic programming, graphs, and tree algorithms.',
    description: 'Demonstrated speed and accuracy in algorithmic complexity analysis, memory optimization, and graph heuristics.',
    category: 'Algorithms',
    rarity: 'Rare',
    icon: '🎯',
    rarityColor: {
      bg: 'from-emerald-500/20 via-teal-500/10 to-green-900/20',
      border: 'border-emerald-400/40',
      text: 'text-emerald-600',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    status: 'earned',
    earnedDate: 'May 30, 2026',
    verificationHash: '0x773349BA092841DEAB112839958100',
    issuer: 'Ampriora Competitive Coding Engine',
    skillsVerified: ['Dynamic Programming', 'Graph Theory', 'Data Structures', 'Time Complexity Analysis'],
    criteria: 'Solve 250+ Hard & Medium problems with >85% runtime percentile benchmark.'
  },
  {
    id: 'badge-6',
    name: 'Cloud & Kubernetes Maestro',
    tagline: 'Designing resilient microservices with automated Helm & Terraform IaC.',
    description: 'Demonstrated zero-downtime rolling updates, ingress routing, and multi-region failover cluster orchestration.',
    category: 'Core Engineering',
    rarity: 'Rare',
    icon: '☁️',
    rarityColor: {
      bg: 'from-blue-500/20 via-cyan-500/10 to-sky-900/20',
      border: 'border-blue-400/40',
      text: 'text-blue-600',
      glow: 'shadow-blue-500/20',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    status: 'earned',
    earnedDate: 'Jun 22, 2026',
    verificationHash: '0x992BBDC84712034988771239845183',
    issuer: 'Cloud Native Computing Foundation (CNCF)',
    skillsVerified: ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'CI/CD'],
    criteria: 'Complete 10 hands-on live cluster deployment challenges with zero service degradation.'
  },
  {
    id: 'badge-7',
    name: 'Rust Kernel & Systems Craftsman',
    tagline: 'Zero-cost abstractions, memory safety, and low-latency concurrency.',
    description: 'Currently advancing through bare-metal systems programming, async Tokio runtimes, and low-level memory allocators.',
    category: 'Core Engineering',
    rarity: 'Legendary',
    icon: '🦀',
    rarityColor: {
      bg: 'from-orange-500/20 via-amber-500/10 to-rose-900/20',
      border: 'border-orange-400/40',
      text: 'text-orange-600',
      glow: 'shadow-orange-500/20',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300'
    },
    status: 'in_progress',
    progressPercentage: 80,
    currentMetric: '4 of 5 Projects Verified',
    issuer: 'Rust Foundation & Ampriora Guild',
    skillsVerified: ['Rust', 'Unsafe Code Auditing', 'Async Tokio', 'Memory Allocators'],
    criteria: 'Build an embedded column storage engine and pass the comprehensive memory safety benchmark test.'
  },
  {
    id: 'badge-8',
    name: 'AI Safety & Alignment Specialist',
    tagline: 'Red-teaming LLMs, prompt injection prevention, and guardrail enforcement.',
    description: 'Mastering adversarial evaluations, constitutional AI frameworks, and latency-budgeted content safety filters.',
    category: 'AI & Data',
    rarity: 'Epic',
    icon: '🛡️',
    rarityColor: {
      bg: 'from-indigo-500/20 via-purple-500/10 to-slate-900/20',
      border: 'border-indigo-400/40',
      text: 'text-indigo-600',
      glow: 'shadow-indigo-500/20',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    status: 'in_progress',
    progressPercentage: 65,
    currentMetric: '13 of 20 Challenges Passed',
    issuer: 'Ampriora AI Safety Initiative',
    skillsVerified: ['Red Teaming', 'Guardrails', 'RLHF Evaluation', 'Constitutional AI'],
    criteria: 'Successfully stress-test 20 adversarial LLM sandbox environments and achieve 100% jailbreak defense.'
  },
  {
    id: 'badge-9',
    name: 'Community Peer Mentor Gold',
    tagline: 'Guided 25+ junior developers through technical mock interviews & roadmap reviews.',
    description: 'Awarded to top community members providing constructive feedback, code reviews, and mentorship on Ampriora.',
    category: 'Community & Open Source',
    rarity: 'Rare',
    icon: '🌟',
    rarityColor: {
      bg: 'from-amber-500/20 via-yellow-500/10 to-amber-900/20',
      border: 'border-amber-400/40',
      text: 'text-amber-600',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    status: 'in_progress',
    progressPercentage: 88,
    currentMetric: '22 of 25 Sessions Completed',
    issuer: 'Ampriora Mentorship Council',
    skillsVerified: ['Technical Interviewing', 'Career Guidance', 'Code Mentorship'],
    criteria: 'Complete 25 verified peer mentorship sessions with a 4.9+ out of 5 satisfaction rating.'
  },
  {
    id: 'badge-10',
    name: 'Web3 & Zero Knowledge Innovator',
    tagline: 'ZK-SNARK proof generation, smart contract verification, and decentralized state.',
    description: 'Engineered verified smart contracts with zero vulnerability audits and integrated zk-Rollup state verification.',
    category: 'Core Engineering',
    rarity: 'Legendary',
    icon: '🔐',
    rarityColor: {
      bg: 'from-violet-500/20 via-fuchsia-500/10 to-purple-900/20',
      border: 'border-violet-400/40',
      text: 'text-violet-600',
      glow: 'shadow-violet-500/20',
      badgeBg: 'bg-violet-100 text-violet-900 border-violet-300'
    },
    status: 'locked',
    issuer: 'Ethereum Foundation Ecosystem',
    skillsVerified: ['Circom', 'Solidity', 'Zero Knowledge', 'Cryptography'],
    criteria: 'Complete the advanced ZK-SNARK circuit synthesis lab and pass formal smart contract verification.'
  },
  {
    id: 'badge-11',
    name: 'GPU CUDA Optimization Master',
    tagline: 'Custom kernel fusion, tensor core tiling, and FP8 quantization.',
    description: 'Writing high-throughput CUDA C++ kernels optimizing matrix multiplication and flash attention implementations.',
    category: 'AI & Data',
    rarity: 'Legendary',
    icon: '⚡',
    rarityColor: {
      bg: 'from-emerald-500/20 via-teal-500/10 to-sky-900/20',
      border: 'border-emerald-400/40',
      text: 'text-emerald-600',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    status: 'locked',
    issuer: 'Ampriora Hardware Acceleration Benchmarks',
    skillsVerified: ['CUDA C++', 'Triton', 'TensorRT', 'FlashAttention'],
    criteria: 'Implement a custom CUDA attention kernel achieving >85% of peak hardware theoretical TFLOPS.'
  },
  {
    id: 'badge-12',
    name: 'Cybersecurity Threat Hunter',
    tagline: 'Reverse engineering binaries, memory forensics, and zero-day threat analysis.',
    description: 'Specialized in reverse engineering ELF/PE binaries, identifying buffer overflows, and constructing heap exploits in CTFs.',
    category: 'Core Engineering',
    rarity: 'Epic',
    icon: '🛡️',
    rarityColor: {
      bg: 'from-rose-500/20 via-red-500/10 to-slate-900/20',
      border: 'border-rose-400/40',
      text: 'text-rose-600',
      glow: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    status: 'locked',
    issuer: 'Ampriora Security Labs',
    skillsVerified: ['Ghidra', 'Binary Exploitation', 'Forensics', 'Assembly'],
    criteria: 'Solve all 15 Advanced Reverse Engineering CTF challenges on the Ampriora Cyber Arena.'
  }
]

const CATEGORIES = ['All Categories', 'Core Engineering', 'Hackathons', 'AI & Data', 'Community & Open Source', 'Algorithms']
const STATUSES = ['All Badges', 'Earned', 'In Progress', 'Locked']

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Badges')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Verification Modal
  const [selectedBadgeForVerification, setSelectedBadgeForVerification] = useState<BadgeItem | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const filteredBadges = BADGES_DATA.filter(b => {
    if (selectedCategory !== 'All Categories' && b.category !== selectedCategory) return false
    if (selectedStatus === 'Earned' && b.status !== 'earned') return false
    if (selectedStatus === 'In Progress' && b.status !== 'in_progress') return false
    if (selectedStatus === 'Locked' && b.status !== 'locked') return false

    const matchesSearch = searchQuery === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.skillsVerified.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  const earnedCount = BADGES_DATA.filter(b => b.status === 'earned').length
  const inProgressCount = BADGES_DATA.filter(b => b.status === 'in_progress').length
  const legendaryCount = BADGES_DATA.filter(b => b.rarity === 'Legendary' && b.status === 'earned').length

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Top Hero Banner */}
        <FeatureBanner
          title="Verified Skills & Badges"
          subtitle="Prove your coding benchmarks, hackathon victories, and systems mastery to top tech employers with tamper-proof blockchain-grade credentials."
          icon={ShieldCheck}
          bgPatternIcon={Award}
        >
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl transition-all text-sm hover:bg-indigo-50"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copiedLink ? 'Portfolio Link Copied!' : 'Share Public Badge Portfolio'}
          </button>
        </FeatureBanner>

        {/* User Rank Progress Strip */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md shadow-amber-500/30">
                💎
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Diamond Tier Developer • Level 18
                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] rounded-full uppercase tracking-wider font-extrabold">
                    Top 3% Globally
                  </span>
                </div>
                <div className="text-xs text-slate-500">4,850 XP / 5,000 XP (150 XP to Grandmaster Tier)</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium sm:text-right">
              Verified ID: <span className="font-mono text-amber-600">#AMP-88219-TITAN</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-rose-400 h-full rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: '97%' }}
            ></div>
          </div>
        </div>

        {/* 3 Key Stats Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{earnedCount}</div>
              <div className="text-xs text-slate-500 font-medium">Earned Badges</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{legendaryCount}</div>
              <div className="text-xs text-slate-500 font-medium">Legendary Tiers</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{inProgressCount}</div>
              <div className="text-xs text-slate-500 font-medium">In Progress</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Verified On-Chain</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search badges, skills (e.g. Next.js, PyTorch, Hackathons, Rust, LeetCode)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
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

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
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
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map(badge => (
            <div 
              key={badge.id}
              className={cn(
                "rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md",
                badge.status === 'earned' 
                  ? "bg-white border-slate-200 hover:border-amber-300" 
                  : badge.status === 'in_progress'
                  ? "bg-white border-slate-200 hover:border-purple-300"
                  : "bg-slate-50/70 border-slate-200/80 opacity-75"
              )}
            >
              <div>
                {/* Header with Emblem & Rarity */}
                <div className="flex items-start justify-between mb-5">
                  {/* Glowing Emblem */}
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border transition-transform group-hover:scale-105",
                    badge.status === 'earned'
                      ? cn("bg-gradient-to-br", badge.rarityColor.bg, badge.rarityColor.border, badge.rarityColor.glow)
                      : badge.status === 'in_progress'
                      ? "bg-purple-50 border-purple-200 shadow-purple-100"
                      : "bg-slate-200 border-slate-300 text-slate-400 grayscale"
                  )}>
                    {badge.status === 'locked' ? <Lock className="w-7 h-7 text-slate-400" /> : badge.icon}
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                      badge.rarityColor.badgeBg
                    )}>
                      {badge.rarity}
                    </span>

                    {badge.status === 'earned' && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}

                    {badge.status === 'in_progress' && (
                      <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        In Progress
                      </span>
                    )}

                    {badge.status === 'locked' && (
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Titles */}
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{badge.name}</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">{badge.tagline}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{badge.description}</p>

                {/* In-Progress Bar */}
                {badge.status === 'in_progress' && badge.progressPercentage && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Progress</span>
                      <span>{badge.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all"
                        style={{ width: `${badge.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] text-purple-700 font-medium">{badge.currentMetric}</div>
                  </div>
                )}

                {/* Locked criteria */}
                {badge.status === 'locked' && (
                  <div className="mt-4 p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-600 space-y-1">
                    <div className="font-bold text-slate-700">How to unlock:</div>
                    <p>{badge.criteria}</p>
                  </div>
                )}

                {/* Verified Skills chips */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {badge.skillsVerified.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                {badge.status === 'earned' ? (
                  <>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Earned {badge.earnedDate}
                    </div>
                    <button 
                      onClick={() => setSelectedBadgeForVerification(badge)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Verify Credential
                    </button>
                  </>
                ) : badge.status === 'in_progress' ? (
                  <div className="w-full flex items-center justify-between text-xs text-purple-700 font-bold">
                    <span>Active Quest</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Prerequisites Required</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Verification Details Modal */}
      {selectedBadgeForVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedBadgeForVerification(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black text-4xl flex items-center justify-center shadow-lg shadow-amber-400/30 mb-3 border-2 border-white">
                {selectedBadgeForVerification.icon}
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                {selectedBadgeForVerification.rarity} Credential
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedBadgeForVerification.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedBadgeForVerification.tagline}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Issued To:</span>
                  <span className="font-bold text-slate-900">Alex Vance (You)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Issuing Authority:</span>
                  <span className="font-bold text-indigo-600">{selectedBadgeForVerification.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Issue Date:</span>
                  <span className="font-bold text-slate-900">{selectedBadgeForVerification.earnedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Validity:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lifetime Valid & Revocation-Proof
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">Cryptographic Proof Hash</label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800 border border-slate-200">
                  <span className="truncate flex-1">{selectedBadgeForVerification.verificationHash}</span>
                  <button 
                    onClick={() => handleCopyHash(selectedBadgeForVerification.verificationHash || '')}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Copy Hash"
                  >
                    {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">Verified Skill Competencies</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBadgeForVerification.skillsVerified.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-semibold">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">Verification Criteria Fulfilled</label>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedBadgeForVerification.criteria}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button 
                onClick={handleCopyLink}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Link Copied!' : 'Copy Verification URL'}
              </button>

              <button 
                onClick={() => setSelectedBadgeForVerification(null)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
