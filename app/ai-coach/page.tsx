"use client"
import DashboardShell from '../components/DashboardShell'
import { MessageSquare, Bot } from 'lucide-react'

export default function AICoachPage() {
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Interview Coach</h2>
            <p className="text-xs text-slate-500">Always online</p>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          <div className="flex gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm max-w-lg">
              <p className="text-slate-700">Hello! I'm your AI career coach. Let's practice for your upcoming behavioral interview. Tell me about a time you overcame a difficult technical challenge.</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input type="text" placeholder="Type your response..." className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Send</button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
