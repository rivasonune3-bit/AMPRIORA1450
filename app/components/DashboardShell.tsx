"use client"

import React, { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import PageHeader from './PageHeader'
import { X } from 'lucide-react'

export default function DashboardShell({ children }:{ children: ReactNode }){
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex">
            <Sidebar onClose={() => setMobileOpen(false)} />
            <button 
              onClick={() => setMobileOpen(false)}
              className="m-3 p-2 bg-white rounded-full text-slate-700 hover:bg-slate-100 h-fit shadow-md"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 min-h-screen h-screen">
        <PageHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
