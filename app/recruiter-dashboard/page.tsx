'use client'

import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { motion } from 'framer-motion'
import { Search, Filter, Check, X, MapPin, GraduationCap, Briefcase, ChevronRight, Users, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

// Start with empty applicants, in reality this would fetch from an API
const initialApplicants: any[] = []

export default function RecruiterDashboard() {
  const [applicants, setApplicants] = useState(initialApplicants)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')

  const handleAction = (id: string, action: 'Shortlisted' | 'Rejected') => {
    setApplicants(apps => apps.map(app => app.id === id ? { ...app, status: action } : app))
  }

  const allSkills = Array.from(new Set(applicants.flatMap(a => a.skills)))

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkill = selectedSkill ? app.skills.includes(selectedSkill) : true
    return matchesSearch && matchesSkill
  })

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        <FeatureBanner
          title="Recruiter Dashboard"
          subtitle="Review and manage candidates for your open roles"
          icon={Users}
          bgPatternIcon={Briefcase}
        >
          <div className="flex items-center gap-4 mt-4">
             <div className="text-center px-6 py-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                <p className="text-sm text-indigo-200 font-medium">Total Applicants</p>
                <p className="text-2xl font-bold text-white mt-1">{applicants.length}</p>
             </div>
          </div>
        </FeatureBanner>

        <div className="flex flex-col sm:flex-row gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or role..."
              className="w-full bg-gray-800/80 text-white rounded-xl pl-12 pr-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-72">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full bg-gray-800/80 text-white rounded-xl pl-12 pr-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 appearance-none"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplicants.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-900/40 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4">
                    <img src={app.avatar} alt={app.name} className="w-16 h-16 rounded-full border-2 border-indigo-500/30 object-cover" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{app.name}</h3>
                      <p className="text-indigo-400 font-medium text-sm mt-1">{app.role}</p>
                    </div>
                  </div>
                  {app.status !== 'Pending' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'Shortlisted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {app.status}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500" /> {app.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <GraduationCap className="w-4 h-4 text-gray-500" /> {app.university}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 col-span-2">
                    <Briefcase className="w-4 h-4 text-gray-500" /> {app.experience}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {app.skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="bg-gray-800/80 text-gray-300 px-3 py-1.5 rounded-lg text-xs border border-gray-700 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {app.status === 'Pending' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800/60">
                    <button
                      onClick={() => handleAction(app.id, 'Shortlisted')}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-colors font-medium text-sm"
                    >
                      <Check className="w-4 h-4" /> Shortlist
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-xl transition-colors font-medium text-sm border border-gray-700"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {app.status !== 'Pending' && (
                  <div className="mt-6 pt-6 border-t border-gray-800/60 flex justify-end">
                    <button className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                      View Full Profile <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredApplicants.length === 0 && (
          <div className="text-center py-16 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No applicants found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
