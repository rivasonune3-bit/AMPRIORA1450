"use client"

import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { Building2, MessageSquare, BookOpen, Star, Search, Filter, ChevronRight, User } from 'lucide-react'

const MOCK_EXPERIENCES: any[] = []

export default function InterviewExperiencesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('All')

  const companies = ['All', ...Array.from(new Set(MOCK_EXPERIENCES.map(e => e.company)))]

  const filteredExperiences = MOCK_EXPERIENCES.filter(exp => {
    const matchesSearch = exp.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompany = selectedCompany === 'All' || exp.company === selectedCompany
    return matchesSearch && matchesCompany
  })

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Top Header */}
        <FeatureBanner
          title="Interview Experiences"
          subtitle="Learn from past interviews to prepare for your next big opportunity."
          icon={MessageSquare}
          bgPatternIcon={Star}
        />

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500 text-sm outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {companies.map(company => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCompany === company 
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExperiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all duration-300 flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{exp.role}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                      <Building2 className="w-4 h-4 text-violet-500" />
                      <span className="font-medium text-slate-700">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.date}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exp.offer === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                  }`}>
                    {exp.offer}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{exp.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-600">Difficulty: <span className="font-medium">{exp.difficulty}</span></span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                      <MessageSquare className="w-4 h-4 text-violet-500" />
                      Questions Asked
                    </h4>
                    <ul className="space-y-2">
                      {exp.questions.map((q: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="font-bold text-violet-300 mt-0.5">{i+1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                      <BookOpen className="w-4 h-4 text-violet-500" />
                      Preparation Tips
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-violet-50/50 p-4 rounded-xl border border-violet-100/50">
                      {exp.prepTips}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No experiences found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
