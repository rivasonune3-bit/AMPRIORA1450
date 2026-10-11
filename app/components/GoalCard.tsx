import React from 'react'

export default function GoalCard({goal}:{goal:string}){
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm text-slate-500">Career Goal</h3>
      <p className="mt-2 font-semibold text-slate-800">{goal}</p>
      <div className="mt-3 text-sm text-slate-500">Target date: <span className="text-slate-700 font-medium">Dec 2026</span></div>
    </div>
  )
}
