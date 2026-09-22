"use client"

import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import { Search, MapPin, Building2, GraduationCap, Briefcase, Mail, MessageSquare, ExternalLink, Users } from 'lucide-react'
import { useState } from 'react'

export default function AlumniConnectPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const alumni: any[] = []

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.college.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeatureBanner
          title="Alumni Connect"
          subtitle="Network with verified alumni across top companies and universities."
          icon={Users}
          bgPatternIcon={GraduationCap}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, company, role, or college..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm text-slate-700 font-medium">
              <option value="">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Meta">Meta</option>
            </select>
            <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm text-slate-700 font-medium">
              <option value="">All Roles</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlumni.map(person => (
            <div key={person.id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {person.role}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{person.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>{person.college}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{person.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {person.skills.map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  Connect
                </button>
                <button className="inline-flex items-center justify-center w-11 h-11 bg-slate-50 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
