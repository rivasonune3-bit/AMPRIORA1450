import React from 'react'

export interface FeatureBannerProps {
  title: string
  subtitle: string
  icon: React.ElementType
  bgPatternIcon?: React.ElementType
  children?: React.ReactNode
}

export default function FeatureBanner({
  title,
  subtitle,
  icon: Icon,
  bgPatternIcon: BgPatternIcon,
  children
}: FeatureBannerProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden mb-6">
      {BgPatternIcon && (
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <BgPatternIcon className="w-64 h-64" />
        </div>
      )}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6 text-indigo-200" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-indigo-200 text-lg mb-6">
            {subtitle}
          </p>
          {children && (
            <div className="flex flex-wrap items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 inline-flex">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
