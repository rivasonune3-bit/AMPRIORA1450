import React from 'react'

interface EmptyStateProps {
  title: string
  message: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export default function EmptyState({ title, message, icon, action }: EmptyStateProps){
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">{message}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}
