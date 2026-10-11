import React from 'react'

export default function SectionHeader({ title, subtitle, action }:{ title:string, subtitle?:string, action?: React.ReactNode }){
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
