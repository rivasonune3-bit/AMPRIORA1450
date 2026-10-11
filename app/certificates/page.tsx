"use client"
import DashboardShell from '../components/DashboardShell'
import { Award, Download } from 'lucide-react'

export default function CertificatesPage() {
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Frontend Developer</h3>
            <p className="text-sm text-slate-500 mb-6">Issued: Aug 2026</p>
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
