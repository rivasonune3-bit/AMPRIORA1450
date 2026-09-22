import React from 'react'

export default function ResumeStatus({score}:{score:number}){
  return (
    <div id="resume" className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold text-slate-800">Resume Status</h4>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-800">{score}%</div>
          <div className="text-sm text-slate-500">Match score vs target roles</div>
        </div>
        <div>
          <button className="px-3 py-1 bg-sky-600 text-white rounded-md">Update Resume</button>
        </div>
      </div>
    </div>
  )
}
