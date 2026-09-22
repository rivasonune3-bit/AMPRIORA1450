"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { Bookmark, ExternalLink, Trash2, Loader2, MapPin, Building, Briefcase } from 'lucide-react'
import Link from 'next/link'
import EmptyState from '../components/EmptyState'

export default function SavedOpportunitiesPage() {
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
  
  const { profile: contextProfile, loading: profileLoading, updateProfile } = useProfileContext()

  useEffect(() => {
    if (!profileLoading && contextProfile) {
      const saved = contextProfile?.onboarding?.savedOpportunities || []
      setSavedOpportunities(saved)
    }
  }, [contextProfile, profileLoading])

  const handleRemove = async (id: string) => {
    try {
      const updatedSaved = savedOpportunities.filter(opp => opp.id !== id)
      setSavedOpportunities(updatedSaved)
      
      const updatedOnboarding = { ...(contextProfile?.onboarding || {}), savedOpportunities: updatedSaved }
      
      await updateProfile({ onboarding: updatedOnboarding }, false)
      
    } catch(e) {
      console.error('Failed to remove saved opportunity', e)
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-500" />
            Saved Opportunities
          </h1>
          <p className="text-slate-500 mt-1">Keep track of the jobs, internships, and hackathons you're interested in.</p>
        </div>

        {profileLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : savedOpportunities.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedOpportunities.map((opp, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                <button 
                  onClick={() => handleRemove(opp.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white/80 p-1.5 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {opp.logo ? (
                      <img src={opp.logo} alt={opp.company} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 pr-6 line-clamp-1">{opp.title}</h3>
                    <p className="text-sm font-medium text-slate-600">{opp.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {opp.location && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </div>
                  )}
                  {opp.type && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      <Briefcase className="w-3.5 h-3.5" />
                      {opp.type}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a 
                    href={opp.sourceUrl || '#'} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Apply Now
                  </a>
                  <Link 
                    href={opp.type?.toLowerCase() === 'hackathon' ? `/hackathons/${opp.id}` : opp.type?.toLowerCase() === 'internship' ? `/internships/${opp.id}` : `/jobs/${opp.id}`}
                    className="flex-1 text-center py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No saved opportunities"
            message="You haven't saved any jobs, internships, or hackathons yet. Start exploring to build your list!"
            icon={<Bookmark />}
            action={<Link href="/jobs" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Explore Opportunities</Link>}
          />
        )}
        
      </div>
    </DashboardShell>
  )
}
