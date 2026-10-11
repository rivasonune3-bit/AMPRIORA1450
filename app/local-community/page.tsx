"use client"

import React, { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  Laptop, 
  Compass, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  ExternalLink,
  Flame,
  Bookmark,
  Send,
  Building,
  Radio
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface MeetupEvent {
  id: string
  title: string
  organizer: string
  organizerAvatar: string
  organizerRole: string
  city: string
  venue: string
  date: string
  time: string
  attendeesCount: number
  maxCapacity: number
  tags: string[]
  isRsvped: boolean
  isSaved: boolean
  coverGradient: string
  description: string
  badge?: string
}

interface CommunityChapter {
  id: string
  name: string
  city: string
  lead: string
  membersCount: number
  weeklyActivity: string
  focus: string[]
  icon: string
  isJoined: boolean
}

interface LocalBuilder {
  id: string
  name: string
  avatar: string
  role: string
  companyOrUni: string
  distance: string
  status: 'Looking for Co-founder' | 'Open for Coffee Chat' | 'Hacking on AI' | 'Study Buddy'
  skills: string[]
  isConnected: boolean
}

interface DiscussionPost {
  id: string
  author: string
  avatar: string
  city: string
  timeAgo: string
  title: string
  content: string
  tags: string[]
  upvotes: number
  commentsCount: number
  hasUpvoted: boolean
}

const INITIAL_MEETUPS: MeetupEvent[] = [
  {
    id: 'm-1',
    title: 'SF Generative AI & Agentic Workflows Hack Night',
    organizer: 'Alex Rivera',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organizerRole: 'AI Engineer @ Anthropic Alum',
    city: 'San Francisco, CA',
    venue: 'Frontier Labs, 450 Mission St (Downtown)',
    date: 'Saturday, Aug 22, 2026',
    time: '6:00 PM - 9:30 PM PST',
    attendeesCount: 84,
    maxCapacity: 100,
    tags: ['GenAI', 'Agents', 'PyTorch', 'LLMs'],
    isRsvped: true,
    isSaved: true,
    coverGradient: 'from-violet-600 via-indigo-600 to-sky-600',
    description: 'Bring your laptop and join 100+ local engineers building autonomous agents, multimodal pipelines, and local LLM fine-tunes. Pizza, drinks, and compute credits provided.',
    badge: 'Popular • 16 Spots Left'
  },
  {
    id: 'm-2',
    title: 'Bengaluru Rustaceans & High-Perf Systems Circle',
    organizer: 'Devika Nair',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organizerRole: 'Principal Systems Architect',
    city: 'Bengaluru, India',
    venue: 'WeWork Galaxy, Residency Road',
    date: 'Wednesday, Aug 26, 2026',
    time: '5:30 PM - 8:00 PM IST',
    attendeesCount: 62,
    maxCapacity: 80,
    tags: ['Rust', 'Distributed Systems', 'Wasm', 'Kernel'],
    isRsvped: false,
    isSaved: false,
    coverGradient: 'from-amber-600 via-orange-600 to-rose-600',
    description: 'Deep-dive lightning talks on memory safety, zero-cost abstractions, and building low-latency trading engines in Rust. Networking & open problem teardowns.',
    badge: 'Trending'
  },
  {
    id: 'm-3',
    title: 'NYC Next.js & Full-Stack Architecture Roundtable',
    organizer: 'Marcus Vance',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organizerRole: 'Staff Frontend Lead',
    city: 'New York, NY',
    venue: 'Rise New York, 43 W 23rd St',
    date: 'Tuesday, Sep 1, 2026',
    time: '6:30 PM - 9:00 PM EST',
    attendeesCount: 45,
    maxCapacity: 60,
    tags: ['Next.js', 'React 19', 'Tailwind', 'Edge Computing'],
    isRsvped: false,
    isSaved: false,
    coverGradient: 'from-blue-600 via-cyan-600 to-teal-500',
    description: 'Explore Server Actions at scale, partial prerendering, and real-time multiplayer states. Live code teardowns and Q&A with top NYC startup architects.',
  },
  {
    id: 'm-4',
    title: 'Austin Indie Founders & Builders Coffee Morning',
    organizer: 'Chloe Bennett',
    organizerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    organizerRole: 'Micro-SaaS Founder ($40k MRR)',
    city: 'Austin, TX',
    venue: 'Radio Coffee & Beer, Menchaca Rd',
    date: 'Friday, Sep 4, 2026',
    time: '8:30 AM - 10:30 AM CST',
    attendeesCount: 29,
    maxCapacity: 35,
    tags: ['Micro-SaaS', 'Bootstrapping', 'Growth', 'Product'],
    isRsvped: false,
    isSaved: false,
    coverGradient: 'from-emerald-600 via-teal-600 to-sky-700',
    description: 'Casual morning meet for solo builders and early-stage startup creators. Share revenue milestones, get feedback on pricing, and demo WIP products.',
    badge: 'Almost Full'
  }
]

const INITIAL_CHAPTERS: CommunityChapter[] = [
  {
    id: 'c-1',
    name: 'Bay Area AI / ML Developers Guild',
    city: 'San Francisco, CA',
    lead: 'Alex Rivera & Team',
    membersCount: 1420,
    weeklyActivity: 'Weekly Hackathons + Papers Reading',
    focus: ['LLMs', 'Vision Models', 'CUDA', 'Agents'],
    icon: '⚡',
    isJoined: true
  },
  {
    id: 'c-2',
    name: 'Koramangala Open Source Collaborative',
    city: 'Bengaluru, India',
    lead: 'Rohan Sharma',
    membersCount: 890,
    weeklyActivity: 'Bi-weekly PR Jam & Mentorship',
    focus: ['TypeScript', 'Go', 'DevTools', 'Cloud Native'],
    icon: '🚀',
    isJoined: false
  },
  {
    id: 'c-3',
    name: 'Manhattan Systems & Web3 Collective',
    city: 'New York, NY',
    lead: 'Elena Rostova',
    membersCount: 640,
    weeklyActivity: 'Monthly Demo Days + Shark Tank',
    focus: ['Solidity', 'Zero Knowledge', 'Infra', 'Rust'],
    icon: '🌐',
    isJoined: false
  },
  {
    id: 'c-4',
    name: 'Austin Startup Sandbox',
    city: 'Austin, TX',
    lead: 'Liam Miller',
    membersCount: 530,
    weeklyActivity: 'Weekly Pitch Teardowns & Coffee',
    focus: ['SaaS', 'B2B Tech', 'Product Design', 'Growth'],
    icon: '💡',
    isJoined: false
  }
]

const INITIAL_BUILDERS: LocalBuilder[] = [
  {
    id: 'b-1',
    name: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Full-Stack & Distributed Systems',
    companyOrUni: 'Ex-Stripe • Stanford MS CS',
    distance: '1.2 km away',
    status: 'Looking for Co-founder',
    skills: ['Go', 'PostgreSQL', 'Next.js', 'Redis'],
    isConnected: false
  },
  {
    id: 'b-2',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Computer Vision & Robotics Eng',
    companyOrUni: 'UC Berkeley Alum • Building Drone AI',
    distance: '3.4 km away',
    status: 'Hacking on AI',
    skills: ['PyTorch', 'ROS2', 'C++', 'OpenCV'],
    isConnected: true
  },
  {
    id: 'b-3',
    name: 'Samira Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Product Designer & UI Engineer',
    companyOrUni: 'Freelance • Design Systems Lead',
    distance: '4.8 km away',
    status: 'Open for Coffee Chat',
    skills: ['Figma', 'Tailwind', 'Framer', 'Design Systems'],
    isConnected: false
  },
  {
    id: 'b-4',
    name: 'Lucas Dupont',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Backend & Cloud Infrastructure',
    companyOrUni: 'AWS Certified Solutions Architect',
    distance: '6.1 km away',
    status: 'Study Buddy',
    skills: ['Kubernetes', 'Terraform', 'Kafka', 'Python'],
    isConnected: false
  }
]

const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'd-1',
    author: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    city: 'San Francisco, CA',
    timeAgo: '2 hours ago',
    title: 'Hosting a spontaneous peer-coding session at Capital One Cafe on Post St today @ 3 PM!',
    content: 'Working on fine-tuning an open-source Qwen model for code generation. Anyone in SF who wants to collaborate, co-work, or brainstorm is welcome! Look for the laptop with the Ampriora sticker.',
    tags: ['CoWorking', 'GenAI', 'DowntownSF'],
    upvotes: 19,
    commentsCount: 7,
    hasUpvoted: false
  },
  {
    id: 'd-2',
    author: 'Kavita Reddy',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    city: 'Bengaluru, India',
    timeAgo: '5 hours ago',
    title: 'Looking for 1 Backend/DevOps engineer for the upcoming HackKarnataka 48h Hackathon',
    content: 'We have 1 ML researcher and 1 frontend designer ready. We are building a real-time speech translation engine for emergency dispatchers. We need someone solid in Docker, FastAPI, and low-latency WebSockets.',
    tags: ['Hackathon', 'BengaluruDevs', 'TeamFormation'],
    upvotes: 34,
    commentsCount: 12,
    hasUpvoted: true
  },
  {
    id: 'd-3',
    author: 'Jordan Miles',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    city: 'New York, NY',
    timeAgo: '1 day ago',
    title: 'Best quiet spots with fiber WiFi for deep work in Midtown / Flatiron?',
    content: 'Compiling a verified list of study hubs and quiet cafe corners with reliable sockets and 200Mbps+ speed. Drop your hidden gems below and I will map them into an open Ampriora guide.',
    tags: ['NYCWorkplaces', 'StudySpots', 'Guide'],
    upvotes: 42,
    commentsCount: 21,
    hasUpvoted: false
  }
]

const CITIES = ['All Cities', 'San Francisco, CA', 'Bengaluru, India', 'New York, NY', 'Austin, TX', 'London, UK']
const CATEGORIES = ['All Hubs', 'Meetups & Events', 'Local Chapters', 'Nearby Builders', 'Discussion Board']

export default function LocalCommunityPage() {
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedCategory, setSelectedCategory] = useState('All Hubs')
  const [searchQuery, setSearchQuery] = useState('')
  const [radius, setRadius] = useState('25 km')
  
  const [meetups, setMeetups] = useState<MeetupEvent[]>(INITIAL_MEETUPS)
  const [chapters, setChapters] = useState<CommunityChapter[]>(INITIAL_CHAPTERS)
  const [builders, setBuilders] = useState<LocalBuilder[]>(INITIAL_BUILDERS)
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(INITIAL_DISCUSSIONS)

  // Host Meetup Modal
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [newMeetupTitle, setNewMeetupTitle] = useState('')
  const [newMeetupVenue, setNewMeetupVenue] = useState('')
  const [newMeetupCity, setNewMeetupCity] = useState('San Francisco, CA')
  const [newMeetupDate, setNewMeetupDate] = useState('')
  const [newMeetupTime, setNewMeetupTime] = useState('')
  const [newMeetupTags, setNewMeetupTags] = useState('AI, Next.js, HackNight')
  const [newMeetupDesc, setNewMeetupDesc] = useState('')

  // New Discussion Modal
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false)
  const [newDiscTitle, setNewDiscTitle] = useState('')
  const [newDiscContent, setNewDiscContent] = useState('')
  const [newDiscTags, setNewDiscTags] = useState('LocalMeet, Collab')

  const toggleRsvp = (id: string) => {
    setMeetups(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.isRsvped
        return {
          ...m,
          isRsvped: nextState,
          attendeesCount: nextState ? m.attendeesCount + 1 : m.attendeesCount - 1
        }
      }
      return m
    }))
  }

  const toggleSaveMeetup = (id: string) => {
    setMeetups(prev => prev.map(m => m.id === id ? { ...m, isSaved: !m.isSaved } : m))
  }

  const toggleJoinChapter = (id: string) => {
    setChapters(prev => prev.map(c => {
      if (c.id === id) {
        const nextJoined = !c.isJoined
        return {
          ...c,
          isJoined: nextJoined,
          membersCount: nextJoined ? c.membersCount + 1 : c.membersCount - 1
        }
      }
      return c
    }))
  }

  const toggleConnectBuilder = (id: string) => {
    setBuilders(prev => prev.map(b => b.id === id ? { ...b, isConnected: !b.isConnected } : b))
  }

  const toggleUpvoteDiscussion = (id: string) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === id) {
        const nextUpvoted = !d.hasUpvoted
        return {
          ...d,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? d.upvotes + 1 : d.upvotes - 1
        }
      }
      return d
    }))
  }

  const handleCreateMeetup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMeetupTitle.trim()) return

    const newEvent: MeetupEvent = {
      id: `m-${Date.now()}`,
      title: newMeetupTitle,
      organizer: 'You (Alex Vance)',
      organizerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      organizerRole: 'Community Builder',
      city: newMeetupCity,
      venue: newMeetupVenue || 'TBD Coffee House / Campus Lab',
      date: newMeetupDate || 'Next Weekend',
      time: newMeetupTime || '6:00 PM - 8:30 PM',
      attendeesCount: 1,
      maxCapacity: 40,
      tags: newMeetupTags.split(',').map(t => t.trim()).filter(Boolean),
      isRsvped: true,
      isSaved: true,
      coverGradient: 'from-indigo-600 via-purple-600 to-pink-600',
      description: newMeetupDesc || 'A local meetup organized for peer collaboration and hands-on building.',
      badge: 'Newly Added'
    }

    setMeetups([newEvent, ...meetups])
    setIsHostModalOpen(false)
    setNewMeetupTitle('')
    setNewMeetupVenue('')
    setNewMeetupDesc('')
  }

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDiscTitle.trim()) return

    const newPost: DiscussionPost = {
      id: `d-${Date.now()}`,
      author: 'You (Alex Vance)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      city: selectedCity === 'All Cities' ? 'San Francisco, CA' : selectedCity,
      timeAgo: 'Just now',
      title: newDiscTitle,
      content: newDiscContent,
      tags: newDiscTags.split(',').map(t => t.trim()).filter(Boolean),
      upvotes: 1,
      commentsCount: 0,
      hasUpvoted: true
    }

    setDiscussions([newPost, ...discussions])
    setIsNewDiscussionOpen(false)
    setNewDiscTitle('')
    setNewDiscContent('')
  }

  // Filtered lists
  const filteredMeetups = meetups.filter(m => {
    const matchesCity = selectedCity === 'All Cities' || m.city.toLowerCase().includes(selectedCity.toLowerCase().split(',')[0])
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.venue.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCity && matchesSearch
  })

  const filteredChapters = chapters.filter(c => {
    const matchesCity = selectedCity === 'All Cities' || c.city.toLowerCase().includes(selectedCity.toLowerCase().split(',')[0])
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCity && matchesSearch
  })

  const filteredBuilders = builders.filter(b => {
    const matchesSearch = searchQuery === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const filteredDiscussions = discussions.filter(d => {
    const matchesCity = selectedCity === 'All Cities' || d.city.toLowerCase().includes(selectedCity.toLowerCase().split(',')[0])
    const matchesSearch = searchQuery === '' || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCity && matchesSearch
  })

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Top Hero Banner */}
        <FeatureBanner
          title="Connect With Builders In Your City"
          subtitle="Discover weekly hack nights, campus chapters, study circles, and peer coffee chats near you. Build together and supercharge your local network."
          icon={Radio}
          bgPatternIcon={MapPin}
        >
          <button 
            onClick={() => setIsHostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4" />
            Host a Local Meetup
          </button>
          <button 
            onClick={() => setIsNewDiscussionOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Post to City Board
          </button>
        </FeatureBanner>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">18+</div>
              <div className="text-xs text-slate-500 font-medium">Active City Hubs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">42</div>
              <div className="text-xs text-slate-500 font-medium">Meetups This Month</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">3,850+</div>
              <div className="text-xs text-slate-500 font-medium">Local Engineers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">120+</div>
              <div className="text-xs text-slate-500 font-medium">Peer Study Circles</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search meetups, topics (Rust, AI, Next.js), venues, or chapters..."
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

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select 
                value={selectedCity} 
                onChange={e => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-400 shrink-0" />
              <select 
                value={radius} 
                onChange={e => setRadius(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="10 km">Within 10 km</option>
                <option value="25 km">Within 25 km</option>
                <option value="50 km">Within 50 km</option>
                <option value="Anywhere">All Regions</option>
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

        {/* Section 1: Upcoming Local Meetups & Hack Nights */}
        {(selectedCategory === 'All Hubs' || selectedCategory === 'Meetups & Events') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Upcoming Meetups & Hack Nights
                </h2>
                <p className="text-sm text-slate-500">Physical & hybrid meetups organized by local tech communities.</p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                {filteredMeetups.length} Events found
              </span>
            </div>

            {filteredMeetups.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">No meetups match your filter</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Try switching cities or be the first to host an impromptu hack night in your local area!
                </p>
                <button 
                  onClick={() => setIsHostModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl text-sm"
                >
                  Create Meetup
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMeetups.map(meetup => (
                  <div 
                    key={meetup.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    {/* Event Banner */}
                    <div className={cn("p-5 text-white bg-gradient-to-r relative", meetup.coverGradient)}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                          {meetup.city}
                        </span>
                        {meetup.badge && (
                          <span className="px-2.5 py-1 bg-amber-400/90 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Flame className="w-3.5 h-3.5 text-red-600" />
                            {meetup.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-sm group-hover:underline cursor-pointer">
                        {meetup.title}
                      </h3>
                    </div>

                    {/* Event Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="font-semibold text-slate-800">{meetup.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span>{meetup.time}</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="truncate text-slate-700">{meetup.venue}</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {meetup.description}
                        </p>

                        {/* Tag Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {meetup.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Organizer & Action Strip */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={meetup.organizerAvatar} 
                            alt={meetup.organizer}
                            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{meetup.organizer}</div>
                            <div className="text-[11px] text-slate-500">{meetup.organizerRole}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button 
                            onClick={() => toggleSaveMeetup(meetup.id)}
                            className={cn(
                              "p-2.5 rounded-xl border transition-colors",
                              meetup.isSaved 
                                ? "bg-amber-50 border-amber-200 text-amber-600" 
                                : "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            )}
                            title="Save Event"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          <button 
                            onClick={() => toggleRsvp(meetup.id)}
                            className={cn(
                              "px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm",
                              meetup.isRsvped
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                            )}
                          >
                            {meetup.isRsvped ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                RSVP Confirmed ({meetup.attendeesCount})
                              </>
                            ) : (
                              <>
                                RSVP Now ({meetup.attendeesCount}/{meetup.maxCapacity})
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Local Chapters & Study Hubs */}
        {(selectedCategory === 'All Hubs' || selectedCategory === 'Local Chapters') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  Active City Chapters & Guilds
                </h2>
                <p className="text-sm text-slate-500">Longstanding peer groups with weekly sprints, demo days, and paper readings.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredChapters.map(chapter => (
                <div 
                  key={chapter.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-xs">
                        {chapter.icon}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {chapter.city.split(',')[0]}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">{chapter.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium mb-3">{chapter.weeklyActivity}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {chapter.focus.map(f => (
                        <span key={f} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {chapter.membersCount} members
                    </span>

                    <button 
                      onClick={() => toggleJoinChapter(chapter.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                        chapter.isJoined 
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      )}
                    >
                      {chapter.isJoined ? 'Joined' : 'Join Chapter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Nearby Builders & Founders Radar */}
        {(selectedCategory === 'All Hubs' || selectedCategory === 'Nearby Builders') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  Nearby Builders & Project Partners
                </h2>
                <p className="text-sm text-slate-500">Local developers and designers currently looking to collaborate or grab coffee.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBuilders.map(builder => (
                <div 
                  key={builder.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-center items-center"
                >
                  <div className="relative mb-3">
                    <img 
                      src={builder.avatar} 
                      alt={builder.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Online now"></div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{builder.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-1">{builder.role}</p>
                  <p className="text-[11px] text-indigo-600 font-medium mb-3">{builder.companyOrUni}</p>

                  <div className="w-full py-1 px-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 mb-3 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{builder.distance}</span>
                    <span>•</span>
                    <span className="font-medium text-indigo-600">{builder.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {builder.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => toggleConnectBuilder(builder.id)}
                    className={cn(
                      "w-full py-2 rounded-xl text-xs font-bold transition-all shadow-xs",
                      builder.isConnected
                        ? "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    )}
                  >
                    {builder.isConnected ? 'Request Sent' : 'Say Hi / Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: City Discussion & Noticeboard */}
        {(selectedCategory === 'All Hubs' || selectedCategory === 'Discussion Board') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Local Community Noticeboard
                </h2>
                <p className="text-sm text-slate-500">Ask questions, form hackathon teams, and share local tech announcements.</p>
              </div>

              <button 
                onClick={() => setIsNewDiscussionOpen(true)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Thread
              </button>
            </div>

            <div className="space-y-3">
              {filteredDiscussions.map(post => (
                <div 
                  key={post.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-4 items-start"
                >
                  {/* Upvote column */}
                  <button 
                    onClick={() => toggleUpvoteDiscussion(post.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all shrink-0 w-12",
                      post.hasUpvoted 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold" 
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs mt-1">{post.upvotes}</span>
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                        {post.author}
                      </div>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium">{post.city}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 hover:text-slate-800 cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {post.commentsCount} replies
                        </span>
                        <span className="flex items-center gap-1 hover:text-slate-800 cursor-pointer">
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Host Meetup Modal */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsHostModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Host a Local Tech Meetup</h3>
              <p className="text-sm text-slate-500 mt-1">Publish an event to local builders, students, and engineers in your area.</p>
            </div>

            <form onSubmit={handleCreateMeetup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SF AI Agents & Multimodal Hack Night"
                  value={newMeetupTitle}
                  onChange={e => setNewMeetupTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">City</label>
                  <select 
                    value={newMeetupCity}
                    onChange={e => setNewMeetupCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Next Saturday, Sep 5"
                    value={newMeetupDate}
                    onChange={e => setNewMeetupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6:00 PM - 8:30 PM"
                    value={newMeetupTime}
                    onChange={e => setNewMeetupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Venue / Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. WeWork or Blue Bottle Cafe"
                    value={newMeetupVenue}
                    onChange={e => setNewMeetupVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="AI, Rust, Next.js, OpenSource"
                  value={newMeetupTags}
                  onChange={e => setNewMeetupTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Description & Agenda</label>
                <textarea 
                  rows={3}
                  placeholder="What will happen? Any prerequisites? Food / drinks info?"
                  value={newMeetupDesc}
                  onChange={e => setNewMeetupDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsHostModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all"
                >
                  Publish Meetup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Discussion Modal */}
      {isNewDiscussionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setIsNewDiscussionOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Post to City Noticeboard</h3>
              <p className="text-sm text-slate-500 mt-1">Start a discussion, look for study buddies, or share local opportunities.</p>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Headline / Question</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Looking for a frontend teammate for this weekend hackathon in SF"
                  value={newDiscTitle}
                  onChange={e => setNewDiscTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Details & Contact info</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Share details, what stack you're using, when to meet..."
                  value={newDiscContent}
                  onChange={e => setNewDiscContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Hackathon, TeamUp, Downtown, Study"
                  value={newDiscTags}
                  onChange={e => setNewDiscTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewDiscussionOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
