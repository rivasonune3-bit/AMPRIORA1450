"use client"

import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Compass,
  Building2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  CheckCircle2,
  Radio,
  Briefcase,
  Trophy,
  GraduationCap,
  Laptop,
  Flame,
  Route,
  Bus,
  Car,
  Footprints,
  Info,
  X,
  ArrowUpRight
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  organization: string
  category: 'internship' | 'hackathon' | 'meetup' | 'research' | 'campus-job'
  location: string
  address: string
  distanceMiles: number
  transitMins: number
  walkMins: number
  compensation: string
  badgeText: string
  dates: string
  deadline: string
  spotsTotal: number
  spotsFilled: number
  coordinates: { x: number; y: number } // percentages on map mockup
  tags: string[]
  description: string
  hostImage: string
  verified: boolean
  featured?: boolean
}

const mockOpportunities: Opportunity[] = []

export default function NearbyOpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRadius, setSelectedRadius] = useState<number>(10)
  const [selectedCity, setSelectedCity] = useState('San Francisco Bay Area')
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(mockOpportunities[0])
  const [detailModalOpportunity, setDetailModalOpportunity] = useState<Opportunity | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>(['opp-1', 'opp-4'])
  const [mapLayer, setMapLayer] = useState<'standard' | 'transit' | 'hubs'>('standard')
  const [appliedSuccessId, setAppliedSuccessId] = useState<string | null>(null)

  const toggleSave = (id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredOpportunities = mockOpportunities.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory

    const matchesRadius = item.distanceMiles <= selectedRadius

    return matchesSearch && matchesCategory && matchesRadius
  })

  const getCategoryColor = (cat: Opportunity['category']) => {
    switch (cat) {
      case 'internship':
        return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', pin: 'bg-sky-500' }
      case 'hackathon':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', pin: 'bg-indigo-500' }
      case 'research':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', pin: 'bg-emerald-500' }
      case 'meetup':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', pin: 'bg-amber-500' }
      case 'campus-job':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', pin: 'bg-purple-500' }
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', pin: 'bg-slate-500' }
    }
  }

  const getCategoryIcon = (cat: Opportunity['category']) => {
    switch (cat) {
      case 'internship':
        return <Briefcase className="w-4 h-4" />
      case 'hackathon':
        return <Trophy className="w-4 h-4" />
      case 'research':
        return <GraduationCap className="w-4 h-4" />
      case 'meetup':
        return <Users className="w-4 h-4" />
      case 'campus-job':
        return <Laptop className="w-4 h-4" />
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Top Header */}
        <FeatureBanner
          title="Nearby Opportunities"
          subtitle={`Showing internships, labs, hackathons, and meetups around ${selectedCity}`}
          icon={Compass}
          bgPatternIcon={MapPin}
        >
          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md shadow-sm flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-sky-200 font-medium uppercase">Active Radar</p>
                <p className="text-sm font-bold">{filteredOpportunities.length} Listings</p>
              </div>
            </div>

            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md shadow-sm flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-200 font-medium uppercase">Avg. Commute</p>
                <p className="text-sm font-bold">&lt; 18 mins</p>
              </div>
            </div>

            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md shadow-sm flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-purple-200 font-medium uppercase">Closing This Week</p>
                <p className="text-sm font-bold">4 Deadlines</p>
              </div>
            </div>
          </div>
        </FeatureBanner>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills, companies, roles, or venues..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
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
              <div className="relative min-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer appearance-none"
                >
                  <option value="San Francisco Bay Area">San Francisco Bay Area</option>
                  <option value="Seattle, WA">Seattle, WA</option>
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="Boston / Cambridge">Boston / Cambridge</option>
                  <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
                </select>
              </div>

              {/* Radius Selectors */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[5, 10, 25, 50].map(rad => (
                  <button
                    key={rad}
                    onClick={() => setSelectedRadius(rad)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedRadius === rad
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {rad} mi
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Opportunities', count: mockOpportunities.length },
              { id: 'internship', label: 'Internships & Co-ops', count: 2 },
              { id: 'hackathon', label: 'Hackathons & Sprints', count: 1 },
              { id: 'research', label: 'Research & Labs', count: 1 },
              { id: 'meetup', label: 'Tech Talks & Meetups', count: 1 },
              { id: 'campus-job', label: 'Campus & Student Jobs', count: 1 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === tab.id
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Interactive Map + Opportunity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Map Interface Mockup (5 Cols on large screens) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
            <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-xl border border-slate-800 overflow-hidden relative">
              {/* Map Controls Header */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Geographic Canvas
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
                  <button
                    onClick={() => setMapLayer('standard')}
                    className={`px-2 py-0.5 rounded ${mapLayer === 'standard' ? 'bg-sky-600 text-white font-medium' : 'hover:text-white'}`}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setMapLayer('transit')}
                    className={`px-2 py-0.5 rounded ${mapLayer === 'transit' ? 'bg-sky-600 text-white font-medium' : 'hover:text-white'}`}
                  >
                    Transit
                  </button>
                  <button
                    onClick={() => setMapLayer('hubs')}
                    className={`px-2 py-0.5 rounded ${mapLayer === 'hubs' ? 'bg-sky-600 text-white font-medium' : 'hover:text-white'}`}
                  >
                    Hubs
                  </button>
                </div>
              </div>

              {/* Map Canvas Mockup */}
              <div className="relative w-full h-[360px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center select-none group">
                {/* SVG Cartography & Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#map-grid)" />
                  {/* Stylized Bay / River Curves */}
                  <path d="M 0 180 Q 120 120 200 220 T 400 150" fill="none" stroke="#0284c7" strokeWidth="24" strokeOpacity="0.3" />
                  <path d="M 0 180 Q 120 120 200 220 T 400 150" fill="none" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.6" strokeDasharray="4,4" />
                  {/* Transit Routes */}
                  <path d="M 40 340 L 150 200 L 280 180 L 380 60" fill="none" stroke="#eab308" strokeWidth="3" strokeOpacity="0.5" strokeDasharray="6,4" />
                  <path d="M 300 340 L 240 220 L 160 120 L 110 40" fill="none" stroke="#a855f7" strokeWidth="3" strokeOpacity="0.4" />
                </svg>

                {/* Radar Pulse around User Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-48 h-48 rounded-full border border-sky-500/20 animate-ping"></div>
                  <div className="w-80 h-80 rounded-full border border-sky-500/10 absolute -inset-16"></div>
                  <div className="w-4 h-4 bg-sky-500 rounded-full shadow-[0_0_20px_#38bdf8] flex items-center justify-center ring-4 ring-sky-500/30">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                    You (San Francisco)
                  </div>
                </div>

                {/* Map Interactive Pins */}
                {filteredOpportunities.map((opp, idx) => {
                  const isSelected = selectedOpportunity?.id === opp.id
                  const col = getCategoryColor(opp.category)

                  return (
                    <button
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      style={{
                        left: `${opp.coordinates.x}%`,
                        top: `${opp.coordinates.y}%`
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all transform hover:scale-125 z-20 group/pin cursor-pointer ${
                        isSelected ? 'scale-125 z-30' : ''
                      }`}
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg font-bold text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 scale-110'
                              : `${col.pin} ring-2 ring-white/30 hover:ring-white`
                          }`}
                        >
                          {getCategoryIcon(opp.category)}
                        </div>
                        {/* Pin tooltip */}
                        <div
                          className={`absolute top-9 whitespace-nowrap bg-slate-950/95 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl transition-all pointer-events-none ${
                            isSelected
                              ? 'opacity-100 visible scale-100'
                              : 'opacity-0 invisible group-hover/pin:opacity-100 group-hover/pin:visible'
                          }`}
                        >
                          <p className="font-semibold text-slate-100 truncate max-w-[150px]">{opp.organization}</p>
                          <p className="text-[10px] text-sky-400">{opp.distanceMiles} mi · {opp.badgeText}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}

                {/* Map Floating Actions */}
                <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-20">
                  <button
                    className="w-8 h-8 bg-slate-800/90 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 border border-slate-700 transition"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 bg-slate-800/90 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 border border-slate-700 transition"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 bg-sky-600 text-white rounded-lg flex items-center justify-center hover:bg-sky-500 shadow-md transition"
                    title="Center on me"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>

                {/* Map Legend */}
                <div className="absolute left-3 bottom-3 bg-slate-950/80 backdrop-blur px-2.5 py-1.5 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span> Internship
                    <span className="w-2 h-2 rounded-full bg-indigo-500 ml-1"></span> Hackathon
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span> Lab
                  </div>
                </div>
              </div>

              {/* Selected Pin Mini Preview */}
              {selectedOpportunity && (
                <div className="mt-3 p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={selectedOpportunity.hostImage}
                      alt={selectedOpportunity.organization}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-600 shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white truncate">
                        {selectedOpportunity.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{selectedOpportunity.organization}</span>
                        <span>•</span>
                        <span className="text-sky-400 font-medium">
                          {selectedOpportunity.distanceMiles} mi away
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDetailModalOpportunity(selectedOpportunity)}
                    className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap transition-all shadow-sm"
                  >
                    Quick View
                  </button>
                </div>
              )}
            </div>

            {/* Commute & Transit Guide Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Student Transit Pass Linked</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    BART, Muni & CalTrain student discounts apply automatically to all on-campus and Bay Area venues listed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Opportunities List (7 Cols on large screens) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Opportunities in Range</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  {filteredOpportunities.length} Available
                </span>
              </h2>
              <span className="text-xs text-slate-500">Sorted by closest distance</span>
            </div>

            {filteredOpportunities.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No opportunities in this radius</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try expanding your search radius to 25 or 50 miles, or change your category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedRadius(50)
                    setSelectedCategory('all')
                    setSearchQuery('')
                  }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition"
                >
                  Expand to 50 miles
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map(opp => {
                  const col = getCategoryColor(opp.category)
                  const isSaved = savedIds.includes(opp.id)
                  const isHighlighted = selectedOpportunity?.id === opp.id

                  return (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className={`group bg-white rounded-2xl p-5 border transition-all cursor-pointer relative ${
                        isHighlighted
                          ? 'border-sky-500 shadow-md ring-2 ring-sky-500/10'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Row: Organization, Category Badge & Distance */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={opp.hostImage}
                            alt={opp.organization}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 text-sm">
                                {opp.organization}
                              </span>
                              {opp.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{opp.location}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border uppercase tracking-wider ${col.bg} ${col.text} ${col.border}`}
                          >
                            {opp.badgeText}
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              toggleSave(opp.id)
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isSaved
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                            title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="mb-3">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {opp.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {opp.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-medium rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Commute Info & Compensation Footer */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Navigation className="w-3.5 h-3.5 text-sky-500" />
                            {opp.distanceMiles} miles
                          </span>
                          <span className="flex items-center gap-1">
                            <Bus className="w-3.5 h-3.5 text-slate-400" />
                            {opp.transitMins}m transit
                          </span>
                          <span className="flex items-center gap-1">
                            <Footprints className="w-3.5 h-3.5 text-slate-400" />
                            {opp.walkMins}m walk
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            {opp.compensation}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setDetailModalOpportunity(opp)
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                          >
                            <span>Apply / RSVP</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Opportunity Detail & Application Modal */}
        {detailModalOpportunity && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              {/* Modal Header Banner */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-3xl relative">
                <button
                  onClick={() => {
                    setDetailModalOpportunity(null)
                    setAppliedSuccessId(null)
                  }}
                  className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold rounded-full uppercase tracking-wider">
                    {detailModalOpportunity.badgeText}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-sky-400" />
                    {detailModalOpportunity.distanceMiles} miles from current location
                  </span>
                </div>

                <h2 className="text-2xl font-bold">{detailModalOpportunity.title}</h2>
                <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
                  <span className="font-semibold">{detailModalOpportunity.organization}</span>
                  <span>•</span>
                  <span>{detailModalOpportunity.location}</span>
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {appliedSuccessId === detailModalOpportunity.id ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Application / RSVP Confirmed!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Your AMPRIORA Student Profile and resume have been shared with {detailModalOpportunity.organization}. A calendar reminder has been sent to your student email.
                    </p>
                    <button
                      onClick={() => setDetailModalOpportunity(null)}
                      className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-slate-800"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Venue & Commute Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Exact Address</p>
                        <p className="font-medium text-slate-800 mt-0.5">{detailModalOpportunity.address}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Dates / Timeline</p>
                        <p className="font-medium text-slate-800 mt-0.5">{detailModalOpportunity.dates}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Compensation</p>
                        <p className="font-bold text-emerald-600 mt-0.5">{detailModalOpportunity.compensation}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">Overview & Scope</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {detailModalOpportunity.description}
                      </p>
                    </div>

                    {/* Requirements / Tags */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">Required Skills & Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailModalOpportunity.tags.map(t => (
                          <span
                            key={t}
                            className="px-3 py-1 bg-sky-50 border border-sky-100 text-sky-800 text-xs font-semibold rounded-lg"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Spots progress */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                        <span>Candidate Cohort Fill</span>
                        <span>
                          {detailModalOpportunity.spotsFilled} / {detailModalOpportunity.spotsTotal} spots taken
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{
                            width: `${(detailModalOpportunity.spotsFilled / detailModalOpportunity.spotsTotal) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <button
                        onClick={() => toggleSave(detailModalOpportunity.id)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>{savedIds.includes(detailModalOpportunity.id) ? 'Saved' : 'Save for Later'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAppliedSuccessId(detailModalOpportunity.id)}
                          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center gap-2"
                        >
                          <span>Confirm Application / RSVP</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
