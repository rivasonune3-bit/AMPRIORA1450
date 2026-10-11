"use client"

import { useEffect, useState, useMemo } from 'react'
import DashboardShell from '../components/DashboardShell'
import { useProfileContext } from '../components/ProfileProvider'
import supabaseBrowser from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Sparkles, 
  Loader2, 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  LayoutTemplate, 
  FileSearch,
  Target,
  Building,
  Copy,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Eye,
  Edit3,
  Layers,
  Globe,
  ShieldCheck,
  X,
  Code,
  Terminal
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { ResumeData, ResumeProject, ResumeExperience } from '../components/resume/types'
import { ALL_TEMPLATES, TemplateDefinition } from '../components/resume/TemplateRegistry'

export default function ResumePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Profile Context SSoT
  const { 
    user, 
    authLoading, 
    profile: contextProfile, 
    loading: profileLoading, 
    updateProfile, 
    refreshProfile 
  } = useProfileContext()

  // Multiple Resumes Version Control State
  const [resumeVersions, setResumeVersions] = useState<ResumeData[]>([])
  const [activeVersionId, setActiveVersionId] = useState<string>('default')

  // Active Resume Form State
  const [versionName, setVersionName] = useState('Default Resume')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [portfolio, setPortfolio] = useState('')

  const [targetRole, setTargetRole] = useState('')
  const [summary, setSummary] = useState('')
  const [education, setEducation] = useState('')
  const [skills, setSkills] = useState('')
  const [projects, setProjects] = useState<ResumeProject[]>([])
  const [experience, setExperience] = useState<ResumeExperience[]>([])
  const [achievements, setAchievements] = useState('')

  const [selectedTemplateId, setSelectedTemplateId] = useState(ALL_TEMPLATES[0].id)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Targeted Optimization Drawer State
  const [targetCompanyInput, setTargetCompanyInput] = useState('')
  const [targetRoleInput, setTargetRoleInput] = useState('')
  const [jobDescriptionInput, setJobDescriptionInput] = useState('')
  const [analyzingTarget, setAnalyzingTarget] = useState(false)
  const [targetAnalysis, setTargetAnalysis] = useState<any | null>(null)
  const [targetError, setTargetError] = useState<string | null>(null)

  // Modals & UI Toggles
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | undefined>()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)

  // Sync Profile SSoT on Initial Load
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (profileLoading && !contextProfile) return

    const activeProfile: any = contextProfile || {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member',
      onboarding: {}
    }

    const onboard: Record<string, any> = activeProfile.onboarding || {}

    // Auto-fill from Profile SSoT
    const fullName = activeProfile.full_name || user.user_metadata?.full_name || ''
    setName(fullName.includes('@') ? fullName.split('@')[0] : fullName)

    const savedResumes = Array.isArray(onboard.resumes) ? onboard.resumes : []
    setResumeVersions(savedResumes)

    // Initial active resume data
    const activeData = onboard.resumeData || onboard.resume || (savedResumes.length > 0 ? savedResumes[0] : null)

    if (activeData && typeof activeData === 'object') {
      if (activeData.name) setName(activeData.name)
      if (activeData.email) setEmail(activeData.email)
      else if (user.email) setEmail(user.email)
      if (activeData.phone) setPhone(activeData.phone)
      if (activeData.location) setLocation(activeData.location)
      if (activeData.linkedin) setLinkedin(activeData.linkedin)
      if (activeData.github) setGithub(activeData.github)
      if (activeData.portfolio) setPortfolio(activeData.portfolio)
      if (activeData.targetRole) {
        setTargetRole(activeData.targetRole)
        setTargetRoleInput(activeData.targetRole)
      }
      if (activeData.summary) setSummary(activeData.summary)
      if (activeData.education) setEducation(activeData.education)
      if (activeData.skills) setSkills(activeData.skills)
      if (Array.isArray(activeData.projects)) setProjects(activeData.projects)
      if (Array.isArray(activeData.experience)) setExperience(activeData.experience)
      if (activeData.achievements) setAchievements(activeData.achievements)
      if (activeData.templateId) setSelectedTemplateId(activeData.templateId)
      if (activeData.versionName) setVersionName(activeData.versionName)
    } else {
      // Fallback auto-fill directly from Profile SSoT
      if (user.email) setEmail(user.email)
      if (onboard.email) setEmail(onboard.email)
      if (onboard.phone) setPhone(onboard.phone)
      if (onboard.education) setEducation(onboard.education)
      if (onboard.branch && onboard.education) setEducation(`${onboard.education} in ${onboard.branch}`)
      if (onboard.skills) {
        setSkills(typeof onboard.skills === 'string' ? onboard.skills : Array.isArray(onboard.skills) ? (onboard.skills as string[]).join(', ') : '')
      }
      if (onboard.targetRole) {
        setTargetRole(onboard.targetRole)
        setTargetRoleInput(onboard.targetRole)
      }
      if (onboard.dreamCompany) setTargetCompanyInput(onboard.dreamCompany)
      if (onboard.linkedin) setLinkedin(onboard.linkedin)
      if (onboard.github) setGithub(onboard.github)
      if (onboard.about || onboard.experience) setSummary(onboard.about || onboard.experience || '')
    }

    setLoading(false)
  }, [user, authLoading, contextProfile, profileLoading, router])

  // Project & Experience Form Mutators
  function addProject() { setProjects(p => [...p, { title: '', description: '', technologies: '', link: '' }]) }
  function removeProject(i: number) { setProjects(p => p.filter((_, idx) => idx !== i)) }
  function updateProject(i: number, key: string, value: string) { setProjects(p => p.map((proj, idx) => idx === i ? { ...proj, [key]: value } : proj)) }

  function addExperience() { setExperience(e => [...e, { company: '', role: '', details: '', startDate: '', endDate: '' }]) }
  function removeExperience(i: number) { setExperience(e => e.filter((_, idx) => idx !== i)) }
  function updateExperience(i: number, key: string, value: string) { setExperience(e => e.map((ex, idx) => idx === i ? { ...ex, [key]: value } : ex)) }

  // Save Current Resume Version (Does NOT overwrite Profile SSoT)
  async function saveResumeVersion() {
    setSaving(true)
    setSaveError(undefined)
    setSaveSuccess(false)

    const activeResumeData: ResumeData = {
      id: activeVersionId,
      versionName,
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      targetRole,
      summary,
      education,
      skills,
      experience,
      projects,
      achievements,
      templateId: selectedTemplateId,
      updatedAt: new Date().toISOString()
    }

    try {
      const existingOnboarding = contextProfile?.onboarding || {}
      const existingVersions = Array.isArray(existingOnboarding.resumes) ? existingOnboarding.resumes : []
      
      const filteredVersions = existingVersions.filter((v: any) => v.id !== activeVersionId)
      const updatedVersions = [...filteredVersions, activeResumeData]

      const updatedOnboarding = {
        ...existingOnboarding,
        resumeData: activeResumeData,
        resumes: updatedVersions
      }

      const success = await updateProfile({ onboarding: updatedOnboarding }, true)
      if (!success) throw new Error('Save failed')

      setResumeVersions(updatedVersions)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err?.message || 'Unable to save resume version')
    } finally {
      setSaving(false)
    }
  }

  // Explicit Write-Back: Update Main Profile SSoT
  async function handleUpdateMainProfile() {
    setSaving(true)
    setSaveError(undefined)
    try {
      const existingOnboarding = contextProfile?.onboarding || {}
      const updatedOnboarding = {
        ...existingOnboarding,
        targetRole: targetRole || existingOnboarding.targetRole,
        education: education || existingOnboarding.education,
        skills: skills || existingOnboarding.skills,
        about: summary || existingOnboarding.about,
        experience: summary || existingOnboarding.experience,
        linkedin: linkedin || existingOnboarding.linkedin,
        github: github || existingOnboarding.github,
      }

      const success = await updateProfile({
        full_name: name || contextProfile?.full_name,
        onboarding: updatedOnboarding
      }, true)

      if (!success) throw new Error('Failed to update main profile SSoT')
      await refreshProfile()
      setProfileUpdated(true)
      setTimeout(() => setProfileUpdated(false), 3000)
    } catch (err: any) {
      setSaveError(err?.message || 'Unable to write back to main profile')
    } finally {
      setSaving(false)
    }
  }

  // Create New Empty Resume Version
  function handleCreateNewVersion() {
    const newId = `resume-${Date.now()}`
    const newVersionName = `Resume Version ${resumeVersions.length + 1}`
    setActiveVersionId(newId)
    setVersionName(newVersionName)
    showToast(`Created ${newVersionName}`)
  }

  // Switch Active Resume Version
  function handleSwitchVersion(version: ResumeData) {
    if (!version) return
    setActiveVersionId(version.id || 'default')
    setVersionName(version.versionName || 'Saved Version')
    if (version.name) setName(version.name)
    if (version.email) setEmail(version.email)
    if (version.phone) setPhone(version.phone)
    if (version.linkedin) setLinkedin(version.linkedin)
    if (version.github) setGithub(version.github)
    if (version.targetRole) setTargetRole(version.targetRole)
    if (version.summary) setSummary(version.summary)
    if (version.education) setEducation(version.education)
    if (version.skills) setSkills(version.skills)
    if (Array.isArray(version.projects)) setProjects(version.projects)
    if (Array.isArray(version.experience)) setExperience(version.experience)
    if (version.achievements) setAchievements(version.achievements)
    if (version.templateId) setSelectedTemplateId(version.templateId)
  }

  // Run Targeted Resume Optimization API (/api/resume/target)
  async function handleRunTargetedOptimization() {
    if (!targetRoleInput.trim()) {
      setTargetError('Target Role is required.')
      return
    }

    setAnalyzingTarget(true)
    setTargetError(null)

    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token

      const activeResumeData: ResumeData = {
        name, email, phone, location, linkedin, github, portfolio, targetRole: targetRoleInput, summary, education, skills, experience, projects, achievements
      }

      const res = await fetch('/api/resume/target', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetRole: targetRoleInput,
          targetCompany: targetCompanyInput,
          jobDescription: jobDescriptionInput,
          resumeData: activeResumeData
        })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to analyze target job')

      setTargetAnalysis(json.data)
    } catch (err: any) {
      setTargetError(err?.message || 'Error analyzing target job')
    } finally {
      setAnalyzingTarget(false)
    }
  }

  // Apply AI Suggestion to Active Form
  function handleApplySuggestedSummary(newSummary: string) {
    if (!newSummary) return
    setSummary(newSummary)
  }

  // Toast Helper
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // PDF Print Handler
  function handlePrintPDF() {
    window.print()
  }

  // Filter templates by category
  const categories = ['All', 'ATS Friendly', 'Minimal', 'Modern', 'Professional', 'Corporate', 'Software Engineering', 'AI / ML', 'Fresher / Student', 'Academic / Research', 'Creative', 'Dark Theme']
  
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return ALL_TEMPLATES
    return ALL_TEMPLATES.filter(t => t.category === selectedCategory)
  }, [selectedCategory])

  const activeTemplateDef = ALL_TEMPLATES.find(t => t.id === selectedTemplateId) || ALL_TEMPLATES[0]
  const ActiveTemplateComponent = activeTemplateDef.component

  const resumePreviewData: ResumeData = {
    name, email, phone, location, linkedin, github, portfolio, targetRole, summary, education, skills, experience, projects, achievements
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AMPRIORA Resume Builder</h1>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Profile Sync Enabled
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Build, customize, and export professional ATS-ready resumes tailored for your target role.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsTargetModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Target Role & JD</span>
            </button>

            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutTemplate className="w-4 h-4 text-slate-600" />
              <span>Templates ({ALL_TEMPLATES.length})</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Version Control & SSoT Write-Back Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Resume Version:
            </span>
            <input
              type="text"
              value={versionName}
              onChange={e => setVersionName(e.target.value)}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-semibold focus:outline-none focus:border-indigo-400"
            />
            {resumeVersions.length > 0 && (
              <select
                onChange={e => {
                  const found = resumeVersions.find(v => v.id === e.target.value)
                  if (found) handleSwitchVersion(found)
                }}
                className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg"
              >
                <option value="">Switch Saved Version ({resumeVersions.length})</option>
                {resumeVersions.map((v, i) => (
                  <option key={i} value={v.id}>{v.versionName || `Version ${i + 1}`}</option>
                ))}
              </select>
            )}
            <button
              onClick={handleCreateNewVersion}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Version
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveResumeVersion}
              disabled={saving}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Version</span>
            </button>

            <button
              onClick={handleUpdateMainProfile}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1"
              title="Save changes to your main AMPRIORA profile"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume version saved successfully!
          </div>
        )}

        {profileUpdated && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Main Profile SSoT updated with latest resume values!
          </div>
        )}

        {saveError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" /> {saveError}
          </div>
        )}

        {/* Main Editor & Live Preview Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Editor Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Template Card Info */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Template</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  {activeTemplateDef.name}
                  {activeTemplateDef.badge && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded">
                      {activeTemplateDef.badge}
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Change
              </button>
            </div>

            {/* Personal Details */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-indigo-600" /> Personal Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555-0192" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role</label>
                  <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn</label>
                    <input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub</label>
                    <input type="text" value={github} onChange={e => setGithub(e.target.value)} placeholder="github.com/username" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Professional Summary
              </h3>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Write a concise overview of your technical background..."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 resize-none"
              />
            </div>

            {/* Skills & Education */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Code className="w-4 h-4 text-indigo-600" /> Skills & Education
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Technical Skills (comma-separated)</label>
                  <textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, React, TypeScript, Node.js, SQL" rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Education</label>
                  <input type="text" value={education} onChange={e => setEducation(e.target.value)} placeholder="Bachelor of Science in Computer Science, 2026" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900" />
                </div>
              </div>
            </div>

            {/* Work Experience Items */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Experience ({experience.length})
                </h3>
                <button onClick={addExperience} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {experience.map((ex, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <input type="text" value={ex.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="Role Title" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold" />
                    <input type="text" value={ex.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={ex.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} placeholder="Start Date" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px]" />
                    <input type="text" value={ex.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} placeholder="End Date / Present" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px]" />
                  </div>
                  <textarea value={ex.details} onChange={e => updateExperience(i, 'details', e.target.value)} placeholder="Action-oriented bullet points describing your work..." rows={3} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs resize-none" />
                </div>
              ))}
            </div>

            {/* Projects Items */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" /> Projects ({projects.length})
                </h3>
                <button onClick={addProject} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {projects.map((p, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button onClick={() => removeProject(i)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <input type="text" value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} placeholder="Project Title" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold" />
                    <input type="text" value={p.technologies} onChange={e => updateProject(i, 'technologies', e.target.value)} placeholder="Tech Stack (e.g. React, Python)" className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <input type="text" value={p.link} onChange={e => updateProject(i, 'link', e.target.value)} placeholder="GitHub / Demo Link" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px]" />
                  <textarea value={p.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="Project description and key features..." rows={3} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs resize-none" />
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Award className="w-4 h-4 text-indigo-600" /> Honors & Achievements
              </h3>
              <textarea value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="Hackathon wins, certifications, awards..." rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 resize-none" />
            </div>

          </div>

          {/* Right Column: Live Printable Preview (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-6 space-y-4">
              <div className="bg-slate-800 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" /> Live Resume Preview ({activeTemplateDef.name})
                </span>
                <span className="text-[10px] text-slate-400">A4 Standard Printable Layout</span>
              </div>

              {/* Printable Resume Container */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden min-h-[842px] print:shadow-none print:border-none">
                <ActiveTemplateComponent data={resumePreviewData} />
              </div>
            </div>
          </div>
        </div>

        {/* Template Selector Modal */}
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                    <span>Choose Professional Resume Template</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select from 15+ production-ready ATS & modern designs</p>
                </div>
                <button onClick={() => setIsTemplateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 grow">
                {filteredTemplates.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplateId(t.id)
                      setIsTemplateModalOpen(false)
                    }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      selectedTemplateId === t.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                        {t.badge && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">{t.badge}</span>}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t.category}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600">Select Template</span>
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Targeted Optimization Modal */}
        {isTargetModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span>Targeted Resume Optimization (AMPRIORA USP)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Optimize your resume specifically for your target role & Job Description without inventing unperformed work.</p>
                </div>
                <button onClick={() => setIsTargetModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto pr-1 grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Role * (Required)</label>
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={e => setTargetRoleInput(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Company (Optional)</label>
                    <input
                      type="text"
                      value={targetCompanyInput}
                      onChange={e => setTargetCompanyInput(e.target.value)}
                      placeholder="e.g. Google, Stripe"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Description (Optional but Recommended)</label>
                  <textarea
                    value={jobDescriptionInput}
                    onChange={e => setJobDescriptionInput(e.target.value)}
                    placeholder="Paste the target job description here..."
                    rows={4}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleRunTargetedOptimization}
                  disabled={analyzingTarget || !targetRoleInput.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {analyzingTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{analyzingTarget ? 'Analyzing Match & Generating Optimization...' : 'Run Targeted Optimization'}</span>
                </button>

                {targetError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                    {targetError}
                  </div>
                )}

                {/* Analysis Results Display */}
                {targetAnalysis && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in">
                    
                    {/* Match Score */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AMPRIORA Job Match</span>
                        <span className="text-lg font-bold text-indigo-300">{targetRoleInput} {targetCompanyInput ? `@ ${targetCompanyInput}` : ''}</span>
                      </div>
                      <div className="w-14 h-14 rounded-full border-4 border-indigo-400 bg-slate-800 flex items-center justify-center font-black text-xl text-emerald-400">
                        {targetAnalysis.matchPercentage || 85}%
                      </div>
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <h5 className="font-bold text-emerald-900 text-xs mb-2">Matched Skills</h5>
                        <div className="flex flex-wrap gap-1">
                          {(targetAnalysis.matchedSkills || []).map((s: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-emerald-800 text-[10px] font-semibold rounded border border-emerald-200">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                        <h5 className="font-bold text-rose-900 text-xs mb-2">Missing Skills (Truth-First Advice)</h5>
                        <div className="flex flex-wrap gap-1">
                          {(targetAnalysis.missingSkills || []).map((s: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-rose-800 text-[10px] font-semibold rounded border border-rose-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Suggested Truth-First Summary */}
                    {targetAnalysis.suggestedSummary && (
                      <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-indigo-950 text-xs">Targeted Summary Proposal</h5>
                          <button
                            onClick={() => handleApplySuggestedSummary(targetAnalysis.suggestedSummary)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg shadow-sm"
                          >
                            Apply to Resume Summary
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{targetAnalysis.suggestedSummary}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  )
}
