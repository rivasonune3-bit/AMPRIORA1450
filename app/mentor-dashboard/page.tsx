"use client"
import DashboardShell from '../components/DashboardShell'
import { Users, Calendar, Video } from 'lucide-react'

export default function MentorDashboard() {
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-slate-900">Mentor Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Users className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900">12</h3>
            <p className="text-slate-500 font-medium">Active Mentees</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Calendar className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900">4</h3>
            <p className="text-slate-500 font-medium">Upcoming Sessions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Video className="w-8 h-8 text-sky-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900">45</h3>
            <p className="text-slate-500 font-medium">Hours Mentored</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
