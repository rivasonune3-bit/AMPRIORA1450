import React from 'react'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: { value: string; positive?: boolean }
  className?: string
}

export default function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-3xl bg-white p-6 shadow-sm border border-slate-200", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600 shrink-0">
            {icon}
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              trend.positive !== false ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
