"use client"

import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { Users, Target, Plus, Search, BookOpen, Code, Terminal, Brain, ChevronRight, Users2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const groups = [
    {
      id: 1,
      name: "Google SWE Prep",
      members: 142,
      goal: "Crack Google interviews",
      icon: <Terminal className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 border-blue-100",
      tags: ["Algorithms", "System Design"],
    },
    {
      id: 2,
      name: "Web3 Builders",
      members: 89,
      goal: "Build dApps and smart contracts",
      icon: <Code className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50 border-purple-100",
      tags: ["Solidity", "Ethereum", "React"],
    },
    {
      id: 3,
      name: "Data Science Masters",
      members: 215,
      goal: "Master ML and data engineering",
      icon: <Brain className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 border-emerald-100",
      tags: ["Python", "TensorFlow", "SQL"],
    },
    {
      id: 4,
      name: "Open Source Contributors",
      members: 310,
      goal: "Make first OSS contribution",
      icon: <BookOpen className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50 border-orange-100",
      tags: ["Git", "React", "Node.js"],
    }
  ]

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.goal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeatureBanner
          title="Study Groups"
          subtitle="Join peers with similar goals, share resources, and learn together."
          icon={Users2}
          bgPatternIcon={BookOpen}
        >
          <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm shrink-0 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </FeatureBanner>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search groups by name or goal..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredGroups.map(group => (
            <div key={group.id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", group.color)}>
                  {group.icon}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {group.members}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                {group.name}
              </h3>
              
              <div className="flex items-center gap-2 text-slate-600 mb-6 flex-1">
                <Target className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="text-sm">{group.goal}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {group.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-900 font-medium rounded-xl border border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors">
                Join Group
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
