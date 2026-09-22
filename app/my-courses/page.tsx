"use client"
import DashboardShell from '../components/DashboardShell'
import { BookOpen, PlayCircle } from 'lucide-react'

export default function MyCoursesPage() {
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Advanced React Patterns</h3>
            <div className="mt-4 mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="font-bold text-indigo-600">65%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-indigo-600 w-[65%] rounded-full"></div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
              <PlayCircle className="w-4 h-4" /> Continue Learning
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
