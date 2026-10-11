"use client"

import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { Briefcase, DollarSign, Calendar, Sparkles, Clock, MapPin, ExternalLink, Search, Filter } from 'lucide-react'

// Mock Data
const MOCK_GIGS: any[] = []

export default function FreelancePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGigs = MOCK_GIGS.filter(gig => 
    gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    gig.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Top Header */}
        <FeatureBanner
          title="Freelance Gigs"
          subtitle="Discover short-term projects and freelance opportunities."
          icon={Briefcase}
          bgPatternIcon={Sparkles}
        />

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col group">
              <div className="p-6 flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{gig.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{gig.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-500">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="font-medium text-slate-700">{gig.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-2 text-amber-500" />
                    <span>{gig.timeline}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {gig.skills.map((skill: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto flex gap-3">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-200">
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGigs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No gigs found</h3>
            <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
