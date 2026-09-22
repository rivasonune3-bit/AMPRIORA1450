'use client'

import { useState, useEffect } from 'react'
import DashboardShell from '../components/DashboardShell'
import { useProfileContext } from '../components/ProfileProvider'
import { motion } from 'framer-motion'
import { QrCode, Award, Code, Zap, ShieldCheck, GraduationCap, Download, Share2 } from 'lucide-react'

export default function DigitalIDPage() {
  const { profile, loading } = useProfileContext()

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Digital Student ID</h1>
          <p className="text-gray-400 mt-1 text-lg">Your verified AMPRIORA digital credential</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* ID Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-full max-w-sm relative group perspective mx-auto lg:mx-0"
          >
            {/* Card Background & Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gray-900 rounded-[2rem] p-1 ring-1 ring-white/10 overflow-hidden shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-purple-900/40"></div>
              
              <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-[1.75rem] p-8 h-full border border-white/5 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-1">AMPRIORA</div>
                    <div className="text-xs text-gray-400">Verified Student</div>
                  </div>
                  <ShieldCheck className="w-7 h-7 text-indigo-400" />
                </div>

                {/* Profile Info */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-5 shadow-lg shadow-indigo-500/20">
                    <img src={profile?.onboarding?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=random`} alt="Profile" className="w-full h-full rounded-full border-4 border-gray-900 object-cover" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {loading ? 'Loading...' : (profile?.full_name || 'Update Profile')}
                  </h2>
                  <p className="text-indigo-300 text-sm font-medium flex items-center gap-1.5 justify-center">
                    <GraduationCap className="w-4 h-4" /> {profile?.onboarding?.education || profile?.onboarding?.branch || 'Ampriora Member'}
                  </p>
                </div>

                {/* Skills & Badges */}
                <div className="space-y-6 mb-10">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold text-center">Top Skills</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(profile?.onboarding?.skills ? String(profile.onboarding.skills).split(',').slice(0,3) : []).length > 0 ? (
                        (profile?.onboarding?.skills ? String(profile.onboarding.skills).split(',').slice(0,3) : []).map((skill: string, i: number) => (
                          <span key={i} className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/5 font-medium">{skill.trim()}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No skills added yet</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold text-center">Badges</p>
                    <div className="flex justify-center gap-4">
                      {(profile?.onboarding?.badges && profile.onboarding.badges.length > 0) ? (
                        profile.onboarding.badges.map((badge: any, i: number) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20" title={badge.name || 'Badge'}>
                            <Award className="w-5 h-5" />
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No badges earned yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mt-auto bg-white p-4 rounded-2xl mx-auto flex flex-col items-center shadow-inner">
                  <QrCode className="w-28 h-28 text-gray-900" strokeWidth={1.5} />
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-3">Scan to Verify</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions & Details */}
          <div className="flex-1 space-y-6 w-full lg:mt-8">
            <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-4">Manage Your ID</h3>
              <p className="text-gray-400 text-base mb-8 leading-relaxed">
                Your digital ID is your verified credential on the AMPRIORA platform. Use it to quickly share your profile with recruiters at hackathons and networking events.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl transition-colors font-medium text-lg shadow-lg shadow-indigo-500/25">
                  <Download className="w-5 h-5" /> Download PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl transition-colors font-medium text-lg border border-gray-700">
                  <Share2 className="w-5 h-5" /> Share Link
                </button>
              </div>
            </div>

            <div className="bg-indigo-500/10 p-8 rounded-3xl border border-indigo-500/20">
               <div className="flex items-start gap-5">
                  <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 shrink-0">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-2">Pro Tip</h4>
                    <p className="text-base text-indigo-200/80 leading-relaxed">
                      Keep your skills and badges up to date. Recruiters actively scan Digital IDs during our partner events to instantly shortlist candidates.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
