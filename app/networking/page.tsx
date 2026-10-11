"use client"

import React, { useState, useEffect } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { 
  Users, 
  Network, 
  UserPlus, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  ThumbsUp,
  Bookmark,
  Briefcase,
  Zap,
  Coffee,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Filter
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface ConnectionProfile {
  id: string
  name: string
  avatar: string
  title: string
  company: string
  location: string
  university: string
  matchScore: number
  matchReason: string
  mutualConnections: number
  skills: string[]
  bio: string
  isAvailableForMentorship: boolean
  isAvailableForCoffee: boolean
  status: 'suggested' | 'pending_sent' | 'connected'
}

interface PendingRequest {
  id: string
  name: string
  avatar: string
  title: string
  companyOrSchool: string
  mutualCount: number
  note: string
  receivedTime: string
}

interface NetworkActivity {
  id: string
  authorName: string
  authorAvatar: string
  authorTitle: string
  timeAgo: string
  content: string
  type: 'achievement' | 'collab_call' | 'article' | 'job_update'
  likesCount: number
  commentsCount: number
  hasLiked: boolean
  tag: string
}

const INITIAL_SUGGESTIONS: ConnectionProfile[] = [
  {
    id: 'p-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior AI Research Engineer',
    company: 'Anthropic (Ex-Google Brain)',
    location: 'San Francisco, CA',
    university: 'Stanford MS CS',
    matchScore: 98,
    matchReason: 'Both building agentic pipelines & PyTorch models',
    mutualConnections: 14,
    skills: ['PyTorch', 'Transformers', 'Reinforcement Learning', 'CUDA'],
    bio: 'Focusing on mechanistic interpretability and LLM evaluation benchmarks. Happy to mentor aspiring ML researchers.',
    isAvailableForMentorship: true,
    isAvailableForCoffee: true,
    status: 'suggested'
  },
  {
    id: 'p-2',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Founding Engineer & Tech Lead',
    company: 'Scale AI',
    location: 'Bengaluru, India',
    university: 'IIT Bombay',
    matchScore: 95,
    matchReason: 'Similar career trajectory & Next.js/Rust stack',
    mutualConnections: 22,
    skills: ['Next.js', 'Rust', 'PostgreSQL', 'Distributed Systems'],
    bio: 'Building data labeling infrastructure and high-throughput real-time APIs. Open to discussing startup architecture.',
    isAvailableForMentorship: true,
    isAvailableForCoffee: false,
    status: 'suggested'
  },
  {
    id: 'p-3',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Staff Product Designer',
    company: 'Figma',
    location: 'New York, NY',
    university: 'Carnegie Mellon University',
    matchScore: 91,
    matchReason: 'Design Systems affinity & Hackathon juror',
    mutualConnections: 9,
    skills: ['Design Systems', 'Figma', 'User Research', 'Framer'],
    bio: 'Designing the future of collaborative canvas tools. Looking to connect with passionate frontend developers.',
    isAvailableForMentorship: false,
    isAvailableForCoffee: true,
    status: 'suggested'
  },
  {
    id: 'p-4',
    name: 'Julian Alvarez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Cloud Infrastructure & DevOps Lead',
    company: 'Stripe',
    location: 'Seattle, WA',
    university: 'University of Washington',
    matchScore: 89,
    matchReason: 'Kubernetes & high-reliability financial tech overlap',
    mutualConnections: 18,
    skills: ['Kubernetes', 'Terraform', 'Go', 'AWS', 'Observability'],
    bio: 'Architecting zero-downtime microservices and multi-region failovers. Passionate about developer tooling.',
    isAvailableForMentorship: true,
    isAvailableForCoffee: true,
    status: 'suggested'
  },
  {
    id: 'p-5',
    name: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Cybersecurity Analyst & Whitehat',
    company: 'CrowdStrike',
    location: 'Austin, TX',
    university: 'UT Austin',
    matchScore: 87,
    matchReason: 'Common security assessment certifications',
    mutualConnections: 6,
    skills: ['Threat Intelligence', 'Rust', 'Reverse Engineering', 'SOC2'],
    bio: 'Specializing in kernel-level exploit prevention and zero-trust perimeter defense.',
    isAvailableForMentorship: false,
    isAvailableForCoffee: true,
    status: 'suggested'
  },
  {
    id: 'p-6',
    name: 'Liam O’Connor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Quantitative Developer',
    company: 'Jane Street Capital',
    location: 'London, UK',
    university: 'Oxford University',
    matchScore: 86,
    matchReason: 'Competitive programming & algorithms interest',
    mutualConnections: 11,
    skills: ['OCaml', 'C++', 'Low Latency', 'Algorithmic Trading'],
    bio: 'Building exchange connectivity protocols and low-latency order execution kernels.',
    isAvailableForMentorship: true,
    isAvailableForCoffee: false,
    status: 'suggested'
  }
]

const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: 'req-1',
    name: 'Vikram Joshi',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Full-Stack Developer',
    companyOrSchool: 'Georgia Tech MS CS Student',
    mutualCount: 8,
    note: 'Hey Alex! I saw your recent post about building AI agents on Ampriora. Would love to connect and exchange notes on vector search pipelines!',
    receivedTime: '3 hours ago'
  },
  {
    id: 'req-2',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Software Engineer II',
    companyOrSchool: 'Datadog • NYC',
    mutualCount: 12,
    note: 'Hi Alex! We both participated in the ETH Global Hackathon last month. Let’s keep in touch regarding future projects.',
    receivedTime: '1 day ago'
  },
  {
    id: 'req-3',
    name: 'Tariq Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'Founding ML Engineer',
    companyOrSchool: 'Cognition AI Alum',
    mutualCount: 5,
    note: 'Enjoyed reading your roadmap on full-stack AI dev. Would be great to connect on Ampriora!',
    receivedTime: '2 days ago'
  }
]

const INITIAL_ACTIVITIES: NetworkActivity[] = [
  {
    id: 'act-1',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorTitle: 'Senior AI Research Engineer @ Anthropic',
    timeAgo: '4 hours ago',
    content: '🎉 Super excited to share that our paper on Multimodal Reasoning in Agentic Tool-Use has been accepted for an oral presentation at NeurIPS 2026! Big thanks to the co-authors and open-source benchmark contributors.',
    type: 'achievement',
    likesCount: 142,
    commentsCount: 28,
    hasLiked: false,
    tag: 'Research Publication'
  },
  {
    id: 'act-2',
    authorName: 'Rohan Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorTitle: 'Founding Engineer @ Scale AI',
    timeAgo: '8 hours ago',
    content: '🚀 We just open-sourced our Rust-based token stream parser for ultra-fast structured outputs. It delivers 12x lower latency than standard regex parsers. Check it out on GitHub and let me know your thoughts!',
    type: 'article',
    likesCount: 89,
    commentsCount: 15,
    hasLiked: true,
    tag: 'Open Source'
  },
  {
    id: 'act-3',
    authorName: 'Maya Lin',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorTitle: 'Staff Product Designer @ Figma',
    timeAgo: '1 day ago',
    content: '💡 Looking for 2 junior developers who want feedback on their personal portfolio and design system implementations this weekend. Drop a link below and I will do a 15-minute Loom teardown for free!',
    type: 'collab_call',
    likesCount: 65,
    commentsCount: 34,
    hasLiked: false,
    tag: 'Mentorship & Teardown'
  }
]

const DOMAINS = ['All Domains', 'AI / Machine Learning', 'Full-Stack Web', 'Cloud & DevOps', 'Product & Design', 'Cybersecurity', 'Systems & Low Latency']
const ROLES = ['All Seniority', 'Students & New Grads', 'Junior / Mid-Level', 'Senior Engineers', 'Staff & Leads', 'Founders & Execs']

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'requests' | 'my_network' | 'feed'>('matches')
  const [selectedDomain, setSelectedDomain] = useState('All Domains')
  const [selectedRole, setSelectedRole] = useState('All Seniority')
  const [searchQuery, setSearchQuery] = useState('')

  const [suggestions, setSuggestions] = useState<ConnectionProfile[]>(INITIAL_SUGGESTIONS)
  const [requests, setRequests] = useState<PendingRequest[]>(INITIAL_REQUESTS)
  const [activities, setActivities] = useState<NetworkActivity[]>(INITIAL_ACTIVITIES)

  const { profile: contextProfile, loading: profileLoading } = useProfileContext()

  useEffect(() => {
    if (!profileLoading) {
      const userPosts = contextProfile?.onboarding?.posts || []
      if (userPosts.length > 0) {
        const mapped: NetworkActivity[] = userPosts.map((p: any) => ({
          id: p.id,
          authorName: p.authorName || 'You',
          authorAvatar: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          authorTitle: p.authorRole || 'Verified Engineer @ Ampriora',
          timeAgo: p.createdAt || 'Just now',
          content: p.content,
          type: 'achievement',
          likesCount: p.likesCount || 1,
          commentsCount: (p.comments || []).length,
          hasLiked: !!p.hasLiked,
          tag: p.authorBadge || 'Skill Badge'
        }))
        setActivities([...mapped, ...INITIAL_ACTIVITIES])
      } else {
        setActivities(INITIAL_ACTIVITIES)
      }
    }
  }, [contextProfile, profileLoading])

  // Modals
  const [selectedProfileForNote, setSelectedProfileForNote] = useState<ConnectionProfile | null>(null)
  const [connectionNote, setConnectionNote] = useState('')
  const [selectedProfileForCoffee, setSelectedProfileForCoffee] = useState<ConnectionProfile | null>(null)
  const [coffeeTopic, setCoffeeTopic] = useState('Career Advice & Technical Architecture')
  const [coffeeTimeSlot, setCoffeeTimeSlot] = useState('This Thursday, 5:00 PM EST')
  const [coffeeSuccessMsg, setCoffeeSuccessMsg] = useState(false)

  // Actions
  const handleConnect = (profileId: string) => {
    setSuggestions(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, status: 'pending_sent' }
      }
      return p
    }))
  }

  const handleSendCustomNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProfileForNote) return
    handleConnect(selectedProfileForNote.id)
    setSelectedProfileForNote(null)
    setConnectionNote('')
  }

  const handleAcceptRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId)
    setRequests(prev => prev.filter(r => r.id !== requestId))
    if (req) {
      const newConnection: ConnectionProfile = {
        id: `connected-${req.id}`,
        name: req.name,
        avatar: req.avatar,
        title: req.title,
        company: req.companyOrSchool,
        location: 'United States',
        university: 'Alumni Network',
        matchScore: 92,
        matchReason: 'Direct Connection Request Accepted',
        mutualConnections: req.mutualCount,
        skills: ['Software Engineering', 'Problem Solving'],
        bio: req.note,
        isAvailableForMentorship: false,
        isAvailableForCoffee: true,
        status: 'connected'
      }
      setSuggestions(prev => [newConnection, ...prev])
    }
  }

  const handleDeclineRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const handleToggleLikeActivity = (actId: string) => {
    setActivities(prev => prev.map(a => {
      if (a.id === actId) {
        const nextLiked = !a.hasLiked
        return {
          ...a,
          hasLiked: nextLiked,
          likesCount: nextLiked ? a.likesCount + 1 : a.likesCount - 1
        }
      }
      return a
    }))
  }

  const handleScheduleCoffee = (e: React.FormEvent) => {
    e.preventDefault()
    setCoffeeSuccessMsg(true)
    setTimeout(() => {
      setCoffeeSuccessMsg(false)
      setSelectedProfileForCoffee(null)
    }, 1800)
  }

  // Filtered Suggestions
  const filteredSuggestions = suggestions.filter(p => {
    if (activeTab === 'my_network' && p.status !== 'connected') return false
    if (activeTab === 'matches' && p.status === 'connected') return false

    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDomain = selectedDomain === 'All Domains' ||
      (selectedDomain === 'AI / Machine Learning' && p.skills.some(s => ['PyTorch', 'Transformers', 'CUDA', 'LLMs', 'Reinforcement Learning'].includes(s))) ||
      (selectedDomain === 'Full-Stack Web' && p.skills.some(s => ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'].includes(s))) ||
      (selectedDomain === 'Cloud & DevOps' && p.skills.some(s => ['Kubernetes', 'Terraform', 'AWS', 'Go', 'Docker'].includes(s))) ||
      (selectedDomain === 'Product & Design' && p.skills.some(s => ['Design Systems', 'Figma', 'Framer', 'User Research'].includes(s))) ||
      (selectedDomain === 'Cybersecurity' && p.skills.some(s => ['Threat Intelligence', 'SOC2', 'Reverse Engineering'].includes(s))) ||
      (selectedDomain === 'Systems & Low Latency' && p.skills.some(s => ['Rust', 'OCaml', 'C++', 'Low Latency'].includes(s)))

    return matchesSearch && matchesDomain
  })

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Top Hero Banner */}
        <FeatureBanner
          title="Grow Your High-Signal Network"
          subtitle="Connect with vetted engineers, researchers at top labs, verified alumni, and mentors matched to your precise career roadmap."
          icon={Sparkles}
          bgPatternIcon={Network}
        >
          <button 
            onClick={() => setActiveTab('matches')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl transition-all text-sm hover:bg-indigo-50"
          >
            <Sparkles className="w-4 h-4" />
            Find AI Matches
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all text-sm relative"
          >
            <UserPlus className="w-4 h-4" />
            Pending Requests
            {requests.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full ml-1">
                {requests.length}
              </span>
            )}
          </button>
        </FeatureBanner>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">48</div>
              <div className="text-xs text-slate-500 font-medium">Verified Connections</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">184</div>
              <div className="text-xs text-slate-500 font-medium">Profile Views (+24%)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">96%</div>
              <div className="text-xs text-slate-500 font-medium">Avg Match Affinity</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">6</div>
              <div className="text-xs text-slate-500 font-medium">1:1 Coffee Chats Done</div>
            </div>
          </div>
        </div>

        {/* AI Match Spotlight of the Day */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="w-40 h-40 text-indigo-700" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img 
                  src={suggestions[0].avatar} 
                  alt={suggestions[0].name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-indigo-600 text-white font-black text-xs rounded-lg shadow-sm">
                  {suggestions[0].matchScore}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-indigo-600 text-white rounded-md text-[11px] font-bold uppercase tracking-wider">
                    Today&apos;s Top Match
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{suggestions[0].location}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{suggestions[0].name}</h3>
                <p className="text-sm font-semibold text-indigo-700">{suggestions[0].title} • {suggestions[0].company}</p>
                <p className="text-xs text-slate-600 max-w-xl">
                  🎯 <strong className="text-slate-800">Why matched:</strong> {suggestions[0].matchReason}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 self-end md:self-auto">
              <button 
                onClick={() => setSelectedProfileForCoffee(suggestions[0])}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                <Coffee className="w-4 h-4 text-amber-600" />
                Propose 1:1 Coffee Chat
              </button>

              <button 
                onClick={() => setSelectedProfileForNote(suggestions[0])}
                disabled={suggestions[0].status !== 'suggested'}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all",
                  suggestions[0].status === 'pending_sent'
                    ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                )}
              >
                {suggestions[0].status === 'pending_sent' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Invitation Sent
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Connect with Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('matches')}
            className={cn(
              "pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'matches'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Recommended Matches ({suggestions.filter(s => s.status !== 'connected').length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={cn(
              "pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'requests'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <UserPlus className="w-4 h-4" />
            Pending Invitations
            {requests.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                {requests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my_network')}
            className={cn(
              "pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'my_network'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <Users className="w-4 h-4" />
            My Network ({suggestions.filter(s => s.status === 'connected').length + 48})
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={cn(
              "pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'feed'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Network Activity Feed
          </button>
        </div>

        {/* Tab 1: Recommended Matches & Filter Controls */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search by name, company, university, or skill (e.g. PyTorch, Rust, Anthropic)..."
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

                {/* Domain Selector */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select 
                    value={selectedDomain} 
                    onChange={e => setSelectedDomain(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    {DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.map(profile => (
                <div 
                  key={profile.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top header with score badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Active on Ampriora"></div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-indigo-700">
                          <Zap className="w-3.5 h-3.5 fill-current text-indigo-600" />
                          {profile.matchScore}% Match
                        </span>
                        <div className="text-[11px] text-slate-400 font-medium mt-1">
                          {profile.mutualConnections} mutual connections
                        </div>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{profile.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{profile.title}</p>
                    
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium text-slate-700">{profile.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{profile.university}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{profile.location}</span>
                      </div>
                    </div>

                    {/* Bio & Reason */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <p className="text-slate-700 line-clamp-2 italic">
                        &ldquo;{profile.bio}&rdquo;
                      </p>
                      <p className="text-[11px] text-indigo-700 font-medium">
                        ✨ {profile.matchReason}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {profile.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                    {profile.isAvailableForCoffee && (
                      <button 
                        onClick={() => setSelectedProfileForCoffee(profile)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                        title="Propose Coffee Chat"
                      >
                        <Coffee className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={() => setSelectedProfileForNote(profile)}
                      disabled={profile.status !== 'suggested'}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs",
                        profile.status === 'pending_sent'
                          ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                      )}
                    >
                      {profile.status === 'pending_sent' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Invited
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Connect
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Pending Invitations */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pending Connection Invitations</h2>
                <p className="text-sm text-slate-500">People who want to connect and collaborate with you on Ampriora.</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                {requests.length} Pending
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">All caught up!</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  You have answered all connection invitations. Explore AI matches to discover new peers and mentors.
                </p>
                <button 
                  onClick={() => setActiveTab('matches')}
                  className="mt-4 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm"
                >
                  Explore Recommended Matches
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div 
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={req.avatar} 
                        alt={req.name} 
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{req.name}</h3>
                          <span className="text-xs text-slate-400">• {req.receivedTime}</span>
                        </div>
                        <p className="text-xs font-medium text-indigo-600">{req.title} • {req.companyOrSchool}</p>
                        <p className="text-xs text-slate-500">{req.mutualCount} mutual connections</p>
                        
                        {req.note && (
                          <div className="mt-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-slate-700 italic">
                            &ldquo;{req.note}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <button 
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>

                      <button 
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Accept & Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Network Directory */}
        {activeTab === 'my_network' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Connected Peers & Mentors</h2>
                <p className="text-sm text-slate-500">Directly message, share opportunities, or book 1:1 sessions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.filter(s => s.status === 'connected').concat([
                {
                  id: 'c-mock-1',
                  name: 'Alex Vance',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  title: 'Core Maintainer & AI Architect',
                  company: 'OpenSource Labs',
                  location: 'San Francisco, CA',
                  university: 'UC Berkeley',
                  matchScore: 99,
                  matchReason: 'Co-collaborator on Next.js projects',
                  mutualConnections: 24,
                  skills: ['Next.js', 'PyTorch', 'TypeScript'],
                  bio: 'Building developer toolkits and agentic benchmarks.',
                  isAvailableForMentorship: true,
                  isAvailableForCoffee: true,
                  status: 'connected'
                },
                {
                  id: 'c-mock-2',
                  name: 'Samantha Reed',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                  title: 'VP of Engineering',
                  company: 'Vercel Ecosystem Partner',
                  location: 'Austin, TX',
                  university: 'Stanford University',
                  matchScore: 94,
                  matchReason: 'Alumni mentor connection',
                  mutualConnections: 31,
                  skills: ['Cloud Architecture', 'Leadership', 'Go'],
                  bio: 'Happy to do quarterly career reviews and resume audits.',
                  isAvailableForMentorship: true,
                  isAvailableForCoffee: true,
                  status: 'connected'
                }
              ]).map(c => (
                <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                        <p className="text-xs text-indigo-600 font-medium">{c.title}</p>
                        <p className="text-[11px] text-slate-400">{c.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {c.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setSelectedProfileForCoffee(c)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-600" /> Coffee Chat
                    </button>
                    <button 
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Network Activity Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                A
              </div>
              <input 
                type="text"
                placeholder="Share a project update, question, or collaboration opportunity with your network..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700">
                Post
              </button>
            </div>

            {activities.map(act => (
              <div key={act.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={act.authorAvatar} alt={act.authorName} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{act.authorName}</h4>
                      <p className="text-xs text-slate-500">{act.authorTitle} • {act.timeAgo}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                    {act.tag}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {act.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button 
                    onClick={() => handleToggleLikeActivity(act.id)}
                    className={cn(
                      "flex items-center gap-1.5 font-bold transition-colors",
                      act.hasLiked ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                    )}
                  >
                    <ThumbsUp className="w-4 h-4 fill-current" />
                    {act.likesCount} Helpful
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {act.commentsCount} Comments
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Connect with Custom Note Modal */}
      {selectedProfileForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedProfileForNote(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img src={selectedProfileForNote.avatar} alt={selectedProfileForNote.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Connect with {selectedProfileForNote.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{selectedProfileForNote.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Add a personalized message to increase your acceptance rate by up to 3x.</p>
            </div>

            <form onSubmit={handleSendCustomNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Invitation Note</label>
                <textarea 
                  rows={4}
                  placeholder={`Hi ${selectedProfileForNote.name.split(' ')[0]}, I saw you are working on ${selectedProfileForNote.skills[0]} at ${selectedProfileForNote.company}. Would love to connect and follow your work on Ampriora!`}
                  value={connectionNote}
                  onChange={e => setConnectionNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedProfileForNote(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coffee Chat Propose Modal */}
      {selectedProfileForCoffee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedProfileForCoffee(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Schedule 1:1 Virtual Coffee Chat</h3>
              <p className="text-xs text-slate-500 mt-1">
                Propose a casual 20-minute discussion with <strong className="text-slate-800">{selectedProfileForCoffee.name}</strong>.
              </p>
            </div>

            {coffeeSuccessMsg ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Coffee Chat Requested!</h4>
                <p className="text-xs text-emerald-700">
                  Calendar invitation and Google Meet link sent to both inboxes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleCoffee} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Topic for Discussion</label>
                  <input 
                    type="text" 
                    required
                    value={coffeeTopic}
                    onChange={e => setCoffeeTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Proposed Time Slot</label>
                  <input 
                    type="text" 
                    required
                    value={coffeeTimeSlot}
                    onChange={e => setCoffeeTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setSelectedProfileForCoffee(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-200 transition-all flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Confirm & Send Invite
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
