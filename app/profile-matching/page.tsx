"use client"
import DashboardShell from '../components/DashboardShell'
import { User, Target, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ProfileMatchingPage() {
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Profile Matching</h1>
          <p className="text-slate-600 mb-6">Paste a job description to see how well your profile matches and what you need to improve.</p>
          
          <textarea 
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none mb-4"
            placeholder="Paste job description here..."
          ></textarea>
          
          <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Analyze Match
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900">Matching Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">React</span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">TypeScript</span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">Node.js</span>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-slate-900">Missing Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100">AWS</span>
              <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100">GraphQL</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
