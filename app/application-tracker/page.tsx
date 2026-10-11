'use client'

import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { motion } from 'framer-motion'
import { Briefcase, Building2, MapPin, Clock, MoreHorizontal, ChevronRight, CheckSquare } from 'lucide-react'

// Mock Data
const initialApplications = [
  { id: '1', role: 'Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$90k - $120k', type: 'Full-time', status: 'Interview', appliedDate: '2 days ago', logo: 'T' },
  { id: '2', role: 'UX Designer', company: 'DesignStudio', location: 'New York, NY', salary: '$80k - $100k', type: 'Contract', status: 'Applied', appliedDate: '1 week ago', logo: 'D' },
  { id: '3', role: 'Software Engineer Intern', company: 'InnovateInc', location: 'San Francisco, CA', salary: '$40/hr', type: 'Internship', status: 'Shortlisted', appliedDate: '3 days ago', logo: 'I' },
  { id: '4', role: 'Product Manager', company: 'GlobalSystems', location: 'London, UK', salary: '£70k - £90k', type: 'Full-time', status: 'Offer', appliedDate: '2 weeks ago', logo: 'G' },
  { id: '5', role: 'Data Analyst', company: 'DataTech', location: 'Remote', salary: '$75k - $95k', type: 'Full-time', status: 'Rejected', appliedDate: '1 month ago', logo: 'D' },
]

const columns = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected']

export default function ApplicationTracker() {
  const [applications] = useState(initialApplications)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <FeatureBanner
          title="Application Tracker"
          subtitle="Manage and track your job and internship applications"
          icon={CheckSquare}
          bgPatternIcon={Briefcase}
        />

        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {columns.map((column) => (
            <div key={column} className="flex-shrink-0 w-80 bg-gray-900/50 rounded-2xl border border-gray-800 p-4 flex flex-col h-[calc(100vh-12rem)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  {column}
                  <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {applications.filter(app => app.status === column).length}
                  </span>
                </h2>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {applications.filter(app => app.status === column).map((app, idx) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                        {app.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{app.role}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" /> {app.company}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-300 gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {app.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-300 gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                        {app.type}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {app.appliedDate}
                      </span>
                      <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center gap-1">
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
