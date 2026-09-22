import React from 'react'

type Skill = {name:string, level:number}

export default function SkillProgress({skills}:{skills:Skill[]}){
  return (
    <div className="grid gap-3">
      {skills.map(s => (
        <div key={s.name} className="bg-white p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-center">
            <div className="font-medium text-slate-800">{s.name}</div>
            <div className="text-sm text-slate-500">{s.level}%</div>
          </div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 bg-sky-500 rounded-full" style={{width: `${s.level}%`}} />
          </div>
        </div>
      ))}
    </div>
  )
}
