"use client"

import DashboardShell from '../components/DashboardShell'
import { Bell, Briefcase, Trophy, Users, CheckCircle2 } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, type: 'job', title: 'Application Viewed', message: 'Your application for Amazon SDE 1 was viewed by the recruiter.', time: '2 hours ago', icon: Briefcase, color: 'text-sky-500 bg-sky-50' },
  { id: 2, type: 'hackathon', title: 'Hackathon Reminder', message: 'HACKNOVA 2026 starts tomorrow. Get your team ready!', time: '1 day ago', icon: Trophy, color: 'text-amber-500 bg-amber-50' },
  { id: 3, type: 'mentor', title: 'Mentorship Accepted', message: 'Priya Sharma accepted your mentorship request.', time: '2 days ago', icon: Users, color: 'text-emerald-500 bg-emerald-50' },
]

export default function NotificationsPage(){
  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
            <p className="text-slate-500 mt-1">Stay updated on your applications, teams, and opportunities.</p>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {NOTIFICATIONS.map((n, i) => {
            const Icon = n.icon
            return (
              <div key={n.id} className={`p-6 flex gap-4 ${i !== NOTIFICATIONS.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors cursor-pointer`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">{n.title}</h3>
                    <span className="text-xs font-medium text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{n.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
