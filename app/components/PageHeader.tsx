"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileContext } from './ProfileProvider'
import { Bell, Search, Menu } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  onMenuToggle?: () => void
}

export default function PageHeader({ onMenuToggle }: PageHeaderProps){
  const router = useRouter()
  const { profile } = useProfileContext()
  const [name, setName] = useState('')

  useEffect(() => {
    if (profile) {
      const full_name = profile.full_name || 'User'
      setName(full_name.includes('@') ? full_name.split('@')[0] : full_name)
    }
  }, [profile])

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-3.5 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-2xs h-16 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Menu"
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Brand logo for mobile screens */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-2xs">
            A
          </div>
          <span className="text-slate-900 font-extrabold tracking-tight text-base">AMPRIORA</span>
        </Link>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search jobs, internships, courses, skills..." 
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button 
          aria-label="Notifications" 
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors relative group"
        >
          <Bell className="w-4 h-4 group-hover:scale-105 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* Clickable Profile Avatar */}
        <Link href="/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            {(name || 'S').charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block text-xs font-semibold text-slate-700 truncate max-w-[120px]">
            {name || 'Student'}
          </span>
        </Link>
      </div>
    </header>
  )
}
