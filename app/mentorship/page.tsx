"use client"

import DashboardShell from '../components/DashboardShell'
import Link from 'next/link'
import { Users, UserPlus, Inbox, Sparkles } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function MentorshipPage(){
  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mentorship</h1>
            <p className="text-slate-500 mt-1">Connect with industry experts, get career guidance, and accelerate your growth.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/mentorship/mentors" 
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-sm"
            >
              <Users className="w-4 h-4" />
              Find Mentors
            </Link>
            <Link 
              href="/mentorship/requests" 
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm text-sm"
            >
              <Inbox className="w-4 h-4" />
              My Requests
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-500" />
                  Your Active Mentorships
                </h2>
              </div>
              <div className="p-8">
                <EmptyState 
                  title="No active mentorships" 
                  message="You haven't connected with any mentors yet. Browse our directory to find industry experts who can help you reach your goals."
                  icon={<Users />}
                  action={
                    <Link href="/mentorship/mentors" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                      Browse Mentors
                    </Link>
                  }
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Why get a mentor?
              </h3>
              
              <ul className="space-y-4 mt-4 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                  <p>Get personalized feedback on your resume and portfolio</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                  <p>Prepare for technical interviews with mock sessions</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                  <p>Navigate career transitions and salary negotiations</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

