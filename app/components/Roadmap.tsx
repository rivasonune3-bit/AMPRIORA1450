import React from 'react'

type Milestone = { id?: string; title:string; date:string; status?: 'not-started'|'in-progress'|'completed' }

export default function Roadmap({items, onToggle}:{items:Milestone[], onToggle?: (id:string)=>void}){
  const colorFor = (s?:string)=> s === 'completed' ? 'bg-sky-500' : s === 'in-progress' ? 'bg-amber-400' : 'bg-slate-200'
  return (
    <div id="roadmap" className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold text-slate-800">Personalized Roadmap</h4>
      <ul className="mt-3 space-y-3">
        {items.map(it => (
          <li key={it.id || it.title} className="flex items-start gap-3">
            <button onClick={()=> onToggle && it.id && onToggle(it.id)} className={`w-3 h-3 mt-1 rounded-full ${colorFor(it.status)} focus:outline-none`} aria-label={`Toggle status for ${it.title}`} />
            <div className="flex-1">
              <div className="font-medium text-slate-800">{it.title}</div>
              <div className="text-sm text-slate-500">{it.date}</div>
            </div>
            <div className="text-sm font-medium text-slate-600 self-start">
              {it.status === 'completed' ? 'Completed' : it.status === 'in-progress' ? 'In progress' : 'Not started'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
