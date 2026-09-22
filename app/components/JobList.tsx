import Link from 'next/link'
import { Bookmark, Building, MapPin, Clock, ExternalLink, BadgeCheck } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Opportunity } from '../../lib/opportunities/types'

export default function JobList({jobs, onSave, savedIds = []}: {jobs:Opportunity[], onSave?: (job:Opportunity)=>void, savedIds?: string[]}){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(j => {
        const isSaved = savedIds.includes(j.id)
        
        return (
          <div key={j.id} className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md hover:border-sky-300 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 shrink-0">
                    {j.organization.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">{j.title}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                      <Building className="w-4 h-4" />
                      {j.organization}
                      {j.verified && <BadgeCheck className="w-4 h-4 text-sky-500" />}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onSave && onSave(j)}
                  disabled={isSaved}
                  className={cn(
                    "p-2 rounded-full transition-colors shrink-0 z-10 relative",
                    isSaved ? "text-sky-600 bg-sky-50" : "text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                  )}
                  title={isSaved ? "Saved" : "Save Job"}
                >
                  <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                  <MapPin className="w-3.5 h-3.5" />
                  {j.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium border border-sky-100/50">
                  <Clock className="w-3.5 h-3.5" />
                  {j.mode}
                </span>
                {j.deadline && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100/50">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {j.deadline}
                  </span>
                )}
              </div>
              
              {j.description && (
                <p className="mt-4 text-sm text-slate-600 line-clamp-2">
                  {j.description}
                </p>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
              <Link
                href={`/jobs/${j.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-sm font-semibold transition-colors"
              >
                View Details
              </Link>
              <a 
                href={j.sourceUrl || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Apply
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

