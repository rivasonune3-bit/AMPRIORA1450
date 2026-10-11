"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import supabase from '../../lib/supabaseClient'
import DashboardShell from '../components/DashboardShell'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  XCircle,
  Building2,
  GraduationCap,
  Target,
  Briefcase,
  Code,
  FolderGit2,
  Award,
  Globe,
  Mail,
  Clock,
  ShieldCheck
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface AdminUser {
  id: string
  email: string
  fullName: string
  college: string
  year: string
  education: string
  careerGoal: string
  dreamCompany: string
  profileCompletion: number
  isCompleted: boolean
  signupDate: string
  createdAtTime: number
  emailVerified: boolean
  accountStatus: string
  avatar: string
  skills: string[]
  projects: any[]
  certifications: any[]
  experiences: any[]
  badges: string[]
  github: string
  linkedin: string
  otherLinks: string[]
  skillGap: string[]
  readinessScore: number | null
  roadmapProgress: number | null
}

interface AdminStats {
  totalUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  profilesCompleted: number
  profilesIncomplete: number
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  
  // Selected user for details modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  // Filtering, Searching, Sorting & Pagination State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete' | 'verified'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'completion'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const fetchAdminData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        setError('Authentication required. Please log in with an administrator account.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to load administrator data')
        setStats(null)
        setUsers([])
      } else {
        setStats(data.stats || null)
        setUsers(data.users || [])
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching admin dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  // Filtered & Sorted Users
  const processedUsers = useMemo(() => {
    let list = [...users]

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.college.toLowerCase().includes(q) ||
        u.careerGoal.toLowerCase().includes(q) ||
        u.dreamCompany.toLowerCase().includes(q)
      )
    }

    // 2. Status Filter
    if (statusFilter === 'completed') {
      list = list.filter(u => u.isCompleted)
    } else if (statusFilter === 'incomplete') {
      list = list.filter(u => !u.isCompleted)
    } else if (statusFilter === 'verified') {
      list = list.filter(u => u.emailVerified)
    }

    // 3. Sort
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAtTime - a.createdAtTime
      if (sortBy === 'oldest') return a.createdAtTime - b.createdAtTime
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName)
      if (sortBy === 'completion') return b.profileCompletion - a.profileCompletion
      return 0
    })

    return list
  }, [users, searchQuery, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / pageSize) || 1
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedUsers.slice(start, start + pageSize)
  }, [processedUsers, currentPage, pageSize])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortBy])

  if (loading) {
    return (
      <DashboardShell>
        <div className="max-w-7xl mx-auto py-16 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <h3 className="font-bold text-slate-900 text-base">Loading Admin Dashboard...</h3>
          <p className="text-xs text-slate-500 mt-1">Connecting to Supabase Auth & Profile records.</p>
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Admin Access Restricted</h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">{error}</p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                Log In as Admin
              </Link>
              <button
                onClick={fetchAdminData}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Administrator Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AMPRIORA Admin Dashboard</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Real-time telemetry and user profile details from Supabase Auth & Profile single source of truth.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* OVERVIEW STATS (Requirement 2) */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Users
                </span>
                <span className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  New Today
                </span>
                <span className="text-3xl font-extrabold text-slate-900">{stats.newUsersToday}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  New This Week
                </span>
                <span className="text-3xl font-extrabold text-slate-900">{stats.newUsersThisWeek}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Profiles Completed
                </span>
                <span className="text-3xl font-extrabold text-slate-900">{stats.profilesCompleted}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Profiles Incomplete
                </span>
                <span className="text-3xl font-extrabold text-slate-900">{stats.profilesIncomplete}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <UserX className="w-6 h-6" />
              </div>
            </div>

          </div>
        )}

        {/* USERS TABLE SECTION (Requirement 3) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registered Users Directory</h2>
              <p className="text-xs text-slate-500">
                Real users authenticated via Supabase Auth ({processedUsers.length} matching result{processedUsers.length === 1 ? '' : 's'}).
              </p>
            </div>

            {/* Controls: Search, Filter, Sort */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, college..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-bold text-xs px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Profiles</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="verified">Verified Email</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-bold text-xs px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="completion">Completion %</option>
                </select>
              </div>

            </div>
          </div>

          {/* Table */}
          {paginatedUsers.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">User / Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">College / Education</th>
                    <th className="px-4 py-3">Career Goal</th>
                    <th className="px-4 py-3">Dream Company</th>
                    <th className="px-4 py-3">Profile Completion</th>
                    <th className="px-4 py-3">Signup Date</th>
                    <th className="px-4 py-3">Email Verified</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {paginatedUsers.map(user => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            user.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="truncate max-w-[140px] sm:max-w-none">{user.fullName}</span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px] truncate max-w-[160px]">
                        {user.email}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 truncate max-w-[150px]">
                        {user.college}
                      </td>

                      <td className="px-4 py-3.5 text-slate-900 font-semibold truncate max-w-[140px]">
                        {user.careerGoal}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {user.dreamCompany !== 'Not provided' ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px]">
                            {user.dreamCompany}
                          </span>
                        ) : (
                          <span className="text-slate-400">Not provided</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                user.profileCompletion >= 75 ? "bg-emerald-500" : user.profileCompletion >= 40 ? "bg-indigo-500" : "bg-amber-500"
                              )}
                              style={{ width: `${user.profileCompletion}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-700">{user.profileCompletion}%</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {new Date(user.signupDate).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3.5">
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-medium">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedUser(user)
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* EMPTY STATES (Requirement 10) */
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {users.length === 0 ? 'No users registered yet.' : 'No users found.'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {users.length === 0
                  ? 'When users sign up for AMPRIORA, their real profile records will appear here.'
                  : 'Try adjusting your search or filter parameters to find user records.'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs font-medium text-slate-600 border-t border-slate-100">
              <span>
                Showing Page {currentPage} of {totalPages} ({processedUsers.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>

        {/* USER DETAILS MODAL (Requirement 4) */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedUser.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SECTION: ACCOUNT DATA */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Account Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">User ID</span>
                    <span className="font-mono text-slate-900 font-bold break-all">{selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Signup Date</span>
                    <span className="text-slate-900 font-bold">{new Date(selectedUser.signupDate).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Email Verification</span>
                    <span className="font-bold text-slate-900">
                      {selectedUser.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Account Status</span>
                    <span className="font-bold text-emerald-600">{selectedUser.accountStatus}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: PROFILE DATA */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Profile Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">College / Education</span>
                    <span className="font-bold text-slate-900">{selectedUser.college}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Year</span>
                    <span className="font-bold text-slate-900">{selectedUser.year}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Target Role / Career Goal</span>
                    <span className="font-bold text-slate-900">{selectedUser.careerGoal}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">Dream Company</span>
                    <span className="font-bold text-slate-900">{selectedUser.dreamCompany}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <span className="text-slate-400 font-medium block text-[11px]">Verified Skills</span>
                  {selectedUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* SECTION: CAREER DATA */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Career Telemetry & Projects
                </h4>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-3">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] mb-1">Featured Projects</span>
                    {selectedUser.projects.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.projects.map((proj: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200">
                            <span className="font-bold text-slate-900 text-xs block">{proj.title || 'Untitled Project'}</span>
                            <p className="text-slate-600 text-[11px] mt-0.5">{proj.description || 'No description provided.'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] mb-1">Certifications & Badges</span>
                    {selectedUser.certifications.length > 0 || selectedUser.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.certifications.map((cert: any, idx: number) => (
                          <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-md">
                            🎖️ {cert.name || cert.title}
                          </span>
                        ))}
                        {selectedUser.badges.map((badge: string, idx: number) => (
                          <span key={`b-${idx}`} className="bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold px-2 py-0.5 rounded-md">
                            🏆 {badge}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: LINKS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Connected Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">GitHub URL</span>
                    {selectedUser.github !== 'Not provided' ? (
                      <a href={selectedUser.github.startsWith('http') ? selectedUser.github : `https://${selectedUser.github}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                        {selectedUser.github} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[11px]">LinkedIn URL</span>
                    {selectedUser.linkedin !== 'Not provided' ? (
                      <a href={selectedUser.linkedin.startsWith('http') ? selectedUser.linkedin : `https://${selectedUser.linkedin}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                        {selectedUser.linkedin} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  )
}
