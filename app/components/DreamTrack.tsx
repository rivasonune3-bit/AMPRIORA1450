import React from 'react'

export default function DreamTrack({company}:{company:string}){
  return (
    <div className="bg-gradient-to-r from-sky-50 to-white p-4 rounded-lg border border-sky-100">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-800">Dream Company Track</h4>
          <p className="text-sm text-slate-500">Target: {company}</p>
        </div>
        <div className="text-2xl">⭐️⭐️⭐️⭐️</div>
      </div>
      <p className="mt-3 text-sm text-slate-500">Follow the curated track to increase your chances.</p>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 bg-sky-600 text-white rounded-md text-sm">View track</button>
        <button className="px-3 py-1 border border-slate-200 rounded-md text-sm">Customize</button>
      </div>
    </div>
  )
}
