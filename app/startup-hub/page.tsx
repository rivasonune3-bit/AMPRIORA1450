"use client"

import DashboardShell from '../components/DashboardShell'
import { Lightbulb, Users, ArrowRight, MessageCircle, Star } from 'lucide-react'
import { useState } from 'react'

const STARTUPS = [
  { id: 1, title: 'AI Resume Builder for Web3', founder: 'Sarah K.', roleNeeded: 'Frontend Developer', equity: '10-15%', stage: 'Prototype', tags: ['React', 'AI', 'Web3'] },
  { id: 2, title: 'Student Marketplace App', founder: 'Rahul M.', roleNeeded: 'Backend/Supabase Expert', equity: '5-10%', stage: 'Idea', tags: ['Supabase', 'Node.js'] },
  { id: 3, title: 'EdTech AR Platform', founder: 'Jessica W.', roleNeeded: 'UI/UX Designer', equity: '20%', stage: 'MVP', tags: ['Figma', 'AR', 'Design'] },
]

export default function StartupHubPage(){
  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Startup Collaboration Hub</h1>
            <p className="text-slate-500 mt-1">Find co-founders, join early-stage ideas, and build the future.</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Post an Idea
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {STARTUPS.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">{s.stage}</span>
                <span className="text-sm font-medium text-slate-500">by {s.founder}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{s.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {s.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">{t}</span>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Looking for</div>
                <div className="font-semibold text-indigo-600">{s.roleNeeded}</div>
                <div className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500"/> Equity: {s.equity}</div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
