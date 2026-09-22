"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import { Settings, Bell, MapPin, Hash, Loader2, Save } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function SettingsPage(){
  const [settings, setSettings] = useState<any>({ emailNotifications: true, careerInterestTags: [], defaultLocation: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      try{
        const { data: { session } } = await supabaseBrowser.auth.getSession()
        const token = session?.access_token
        if(!token){ setLoading(false); return }
        const res = await fetch('/api/settings', { headers: { Authorization: `Bearer ${token}` } })
        if(!res.ok){ setLoading(false); return }
        const js = await res.json()
        setSettings(js.data || settings)
      }catch(e:any){ setError(e?.message || 'Failed to load settings') }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async ()=>{
    setSaving(true)
    setError(null)
    setSavedSuccess(false)
    try{
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token
      if(!token) throw new Error('Not authenticated')
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(settings) })
      const js = await res.json()
      if(!res.ok) throw new Error(js?.error || 'Save failed')
      setSettings(js.data)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }catch(e:any){ setError(e?.message || 'Save error') }
    setSaving(false)
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
            <p className="text-slate-500 mt-1">Manage your account preferences and application settings.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || loading} 
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        {savedSuccess && (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100 font-medium flex items-center justify-between">
            Settings saved successfully!
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  General Preferences
                </h2>
              </div>
              <div className="p-6 space-y-8">
                
                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-500">Receive alerts for new opportunities and messages.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={!!settings.emailNotifications} 
                      onChange={e=>setSettings({...settings, emailNotifications: e.target.checked})} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <hr className="border-slate-100" />

                {/* Career Tags */}
                <div>
                  <div className="flex gap-4 items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Hash className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Career Interest Tags</h3>
                      <p className="text-sm text-slate-500">Helps us recommend better jobs and courses (comma separated).</p>
                    </div>
                  </div>
                  <div className="pl-14">
                    <input 
                      type="text"
                      placeholder="e.g. Frontend, React, Data Science"
                      value={(settings.careerInterestTags || []).join(', ')} 
                      onChange={e=>setSettings({...settings, careerInterestTags: e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean) })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Default Location */}
                <div>
                  <div className="flex gap-4 items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Default Location</h3>
                      <p className="text-sm text-slate-500">Your preferred location for job and internship searches.</p>
                    </div>
                  </div>
                  <div className="pl-14">
                    <input 
                      type="text"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={settings.defaultLocation || ''} 
                      onChange={e=>setSettings({...settings, defaultLocation: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
