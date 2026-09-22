"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProfileContext } from './ProfileProvider'
import LogoutButton from './LogoutButton'
import { cn } from '../../lib/utils'
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  FileText, 
  Sparkles, 
  Building2, 
  MessageSquare, 
  BookOpen, 
  Code, 
  CheckSquare, 
  Users, 
  FolderGit2, 
  CreditCard,
  ChevronRight
} from 'lucide-react'

interface NavItemProps {
  href: string
  icon: any
  children: React.ReactNode
}

function NavItem({ href, icon: Icon, children }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative",
        isActive 
          ? "bg-sky-50 text-sky-700 shadow-2xs font-bold" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-sky-600 rounded-r-full" />
      )}
      <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="truncate flex-1">{children}</span>
      {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-sky-600 ml-auto" />}
    </Link>
  )
}

function NavSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">
        {title}
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  )
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { profile } = useProfileContext()

  const rawName = profile?.full_name || 'Student'
  const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 h-screen sticky top-0 flex flex-col shrink-0 select-none">
      {/* Logo Area */}
      <div className="p-5 pb-4 shrink-0 flex items-center justify-between">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <h1 className="text-slate-900 font-extrabold text-lg tracking-tight leading-none">AMPRIORA</h1>
          </div>
        </Link>
      </div>

      {/* Navigation Links - Locked MVP Sections Only */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        
        {/* MAIN */}
        <NavSection title="Main">
          <NavItem href="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
          <NavItem href="/profile" icon={User}>My Profile</NavItem>
        </NavSection>

        {/* OPPORTUNITIES */}
        <NavSection title="Opportunities">
          <NavItem href="/jobs" icon={Briefcase}>Jobs</NavItem>
          <NavItem href="/internships" icon={GraduationCap}>Internships</NavItem>
          <NavItem href="/hackathons" icon={Trophy}>Hackathons & Competitions</NavItem>
        </NavSection>

        {/* CAREER */}
        <NavSection title="Career">
          <NavItem href="/resume" icon={FileText}>Resume</NavItem>
          <NavItem href="/roadmap" icon={Sparkles}>AI Career</NavItem>
          <NavItem href="/dream-company" icon={Building2}>Dream Company ⭐</NavItem>
          <NavItem href="/mock-interviews" icon={MessageSquare}>Mock Interview</NavItem>
        </NavSection>

        {/* LEARNING */}
        <NavSection title="Learning">
          <NavItem href="/courses" icon={BookOpen}>Courses</NavItem>
          <NavItem href="/skill-assessment" icon={CheckSquare}>Skill Assessment</NavItem>
        </NavSection>

        {/* COMMUNITY */}
        <NavSection title="Community">
          <NavItem href="/feed" icon={Users}>Social Feed</NavItem>
          <NavItem href="/messages" icon={MessageSquare}>Messages</NavItem>
        </NavSection>

        {/* TOOLS */}
        <NavSection title="Tools">
          <NavItem href="/smart-portfolio" icon={FolderGit2}>Smart Portfolio</NavItem>
          <NavItem href="/digital-id" icon={CreditCard}>Digital Student ID</NavItem>
        </NavSection>

      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <Link href="/profile" onClick={onClose} className="flex items-center gap-2.5 overflow-hidden flex-1 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {(displayName || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <div className="truncate text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                View Profile
              </div>
            </div>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}
