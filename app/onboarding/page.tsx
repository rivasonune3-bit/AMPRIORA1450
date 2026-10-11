"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useProfileContext } from '../components/ProfileProvider'
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Building, 
  CheckCircle2, 
  Loader2, 
  Target,
  FileText,
  Upload,
  AlertCircle,
  Edit3,
  User,
  Globe,
  ArrowRight
} from 'lucide-react'
import { cn } from '../../lib/utils'

const EDUCATION_LEVELS = ['High School', 'Diploma', "Bachelor's", "Master's", 'PhD']
const STUDY_YEARS = ['1', '2', '3', '4', '5+']
const EXPERIENCE_LEVELS = ['Fresher', '0-1 years', '1-2 years', '2+ years']
const POPULAR_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Custom']
const COMMON_ROLES = ['Software Engineer', 'AI Engineer', 'ML Engineer', 'Data Scientist', 'Full Stack Developer', 'Cloud Engineer']

export default function Onboarding() {
  // Step 0: Initial Question (Yes/No Resume)
  // Step 10: Resume Upload & Scan
  // Step 11: Review & Edit Extracted Profile Data
  // Step 1..4: Manual Guided Steps
  // Step 5: Completion Screen
  const [step, setStep] = useState(0)

  // Profile Provider Context
  const { profile: contextProfile, updateProfile, loading: profileLoading, refreshProfile } = useProfileContext()

  // Manual Flow State (No fake hardcoded defaults)
  const [name, setName] = useState('')
  const [education, setEducation] = useState(EDUCATION_LEVELS[2])
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState(STUDY_YEARS[2])
  const [skills, setSkills] = useState('')
  const [targetCareer, setTargetCareer] = useState('')
  const [dreamCompany, setDreamCompany] = useState('')
  const [customCompany, setCustomCompany] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[0])
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')

  // Smart Resume Flow State
  const [resumeText, setResumeText] = useState('')
  const [fileBase64, setFileBase64] = useState('')
  const [fileMimeType, setFileMimeType] = useState('application/pdf')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [parsingResume, setParsingResume] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  
  // Extracted Data State for Review
  const [extractedData, setExtractedData] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '',
    education: '',
    targetCareer: '',
    targetRole: '',
    dreamCompany: '',
    skills: [],
    about: '',
    linkedin: '',
    github: '',
    portfolio: '',
    projects: [],
    experience: [],
    certifications: [],
    achievements: ''
  })

  const [loadingSave, setLoadingSave] = useState(false)
  const [saveError, setSaveError] = useState<string | undefined>()
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) {
        router.push('/auth/login')
      } else {
        setLoadingAuth(false)
      }
    })()
  }, [router])

  // Sync profile data when loaded & check if already completed
  useEffect(() => {
    if (!profileLoading && contextProfile) {
      if (contextProfile.full_name && contextProfile.full_name !== 'Student') {
        setName(contextProfile.full_name)
      }
      
      // Existing User Check: Redirect if onboarding is already complete
      if (contextProfile.onboarding?.completed) {
        router.push('/dashboard')
      }
    }
  }, [contextProfile, profileLoading, router])

  function next() {
    if (step === 1) {
      if (!name.trim()) {
        setSaveError('Full Name is required.')
        return
      }
      setSaveError(undefined)
    }
    if (step === 3) {
      if (!targetRole.trim()) {
        setSaveError('Target Role is required.')
        return
      }
      setSaveError(undefined)
    }
    if (step < 4) setStep(step + 1)
  }

  function back() { 
    if (step === 10 || step === 1) setStep(0)
    else if (step > 1 && step < 5) setStep(step - 1) 
    else if (step === 11) setStep(10)
  }

  // File Select & Conversion Handler (PDF, DOCX, TXT)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFileName(file.name)
    setParseError(null)

    const mime = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain')
    setFileMimeType(mime)

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text) setResumeText(text)
      }
      reader.readAsText(file)
    } else {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Str = event.target?.result as string
        if (base64Str) setFileBase64(base64Str)
      }
      reader.readAsDataURL(file)
    }
  }

  // Parse Resume via API
  const handleScanResume = async () => {
    if (!resumeText.trim() && !fileBase64) {
      setParseError('Please select a resume file or paste text content.')
      return
    }

    setParsingResume(true)
    setParseError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          resumeText,
          fileBase64,
          mimeType: fileMimeType
        })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to analyze resume')

      const parsed = json.data || {}
      setExtractedData({
        fullName: parsed.fullName || contextProfile?.full_name || name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        college: parsed.college || '',
        branch: parsed.branch || '',
        year: parsed.year || '3',
        education: parsed.education || "Bachelor's",
        targetCareer: parsed.targetCareer || '',
        targetRole: parsed.targetRole || '',
        dreamCompany: parsed.dreamCompany || '',
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        about: parsed.about || '',
        linkedin: parsed.linkedin || '',
        github: parsed.github || '',
        portfolio: parsed.portfolio || '',
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        achievements: parsed.achievements || ''
      })

      setStep(11) // Move to Review & Confirm screen
    } catch (err: any) {
      setParseError(err.message || 'Error processing resume file. You can switch to manual profile creation below.')
    } finally {
      setParsingResume(false)
    }
  }

  // Confirm Resume Flow & Save to Profile SSoT
  const handleConfirmResumeProfile = async () => {
    setLoadingSave(true)
    setSaveError(undefined)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      router.push('/auth/login')
      setLoadingSave(false)
      return
    }

    try {
      const existingOnboarding = (contextProfile?.onboarding) || {}

      // Skill formatting
      const skillsString = Array.isArray(extractedData.skills)
        ? extractedData.skills.join(', ')
        : String(extractedData.skills || '')

      const skillSetList = skillsString
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((s: string) => ({ name: s, proficiency: 'Intermediate' }))

      const mergedOnboarding = {
        ...existingOnboarding,
        completed: true,
        onboardingCompletedAt: new Date().toISOString(),
        education: extractedData.education || existingOnboarding.education || "Bachelor's",
        branch: extractedData.branch || existingOnboarding.branch || '',
        year: extractedData.year || existingOnboarding.year || '3',
        skills: skillsString,
        skillSet: skillSetList,
        targetCareer: extractedData.targetCareer || existingOnboarding.targetCareer || '',
        dreamCompany: extractedData.dreamCompany || existingOnboarding.dreamCompany || '',
        targetRole: extractedData.targetRole || existingOnboarding.targetRole || '',
        linkedin: extractedData.linkedin || existingOnboarding.linkedin || '',
        github: extractedData.github || existingOnboarding.github || '',
        portfolio: extractedData.portfolio || existingOnboarding.portfolio || '',
        about: extractedData.about || existingOnboarding.about || '',
        experience: extractedData.about || existingOnboarding.experience || '',
        resume: {
          ...(existingOnboarding.resume || {}),
          summary: extractedData.about || '',
          experience: extractedData.experience || [],
          projects: extractedData.projects || [],
          education: [{
            institution: extractedData.college || '',
            degree: extractedData.education || "Bachelor's",
            year: extractedData.year || ''
          }],
          certifications: extractedData.certifications || []
        }
      }

      const finalName = extractedData.fullName.trim() || contextProfile?.full_name || user.email?.split('@')[0] || 'Student'

      const ok = await updateProfile({
        full_name: finalName,
        onboarding: mergedOnboarding,
      }, true)

      if (!ok) {
        setSaveError('Unable to save profile data. Please try again.')
        setLoadingSave(false)
        return
      }

      await refreshProfile()
      setName(finalName)
      setStep(5) // Move to Completion screen
    } catch (err: any) {
      setSaveError(err?.message || 'Error saving profile data.')
      setLoadingSave(false)
    }
  }

  // Confirm Manual Flow & Save to Profile SSoT
  const handleFinishManual = async () => {
    setLoadingSave(true)
    setSaveError(undefined)
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      router.push('/auth/login')
      setLoadingSave(false)
      return
    }

    if (!name.trim()) {
      setSaveError('Full Name is required.')
      setLoadingSave(false)
      return
    }
    if (!targetRole.trim()) {
      setSaveError('Target Role is required.')
      setLoadingSave(false)
      return
    }

    try {
      const existingOnboarding = (contextProfile?.onboarding) || {}

      const skillSetList = skills
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((s: string) => ({ name: s, proficiency: 'Intermediate' }))

      const mergedOnboarding = {
        ...existingOnboarding,
        completed: true,
        onboardingCompletedAt: new Date().toISOString(),
        education,
        branch,
        year,
        skills,
        skillSet: skillSetList,
        targetCareer: targetCareer || targetRole,
        dreamCompany: dreamCompany === 'Custom' ? customCompany : dreamCompany,
        targetRole,
        experience,
        linkedin,
        github
      }

      const ok = await updateProfile({
        full_name: name.trim(),
        onboarding: mergedOnboarding,
      }, true)

      if (!ok) {
        setSaveError('Unable to save profile data. Please try again.')
        setLoadingSave(false)
        return
      }

      await refreshProfile()
      setStep(5)
    } catch (err: any) {
      setSaveError(err?.message || 'Unable to save profile data.')
      setLoadingSave(false)
    }
  }

  if (loadingAuth || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"></div>
          <span className="text-xs font-semibold text-slate-500">Loading AMPRIORA Onboarding...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <div className="text-slate-900 font-extrabold tracking-tight text-xl flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs">A</div>
          AMPRIORA
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden my-12">
        
        {/* STEP 0: RESUME QUESTION (YES / NO) */}
        {step === 0 && (
          <div className="p-8 md:p-12 text-center space-y-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs border border-sky-100">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Do you already have a resume?
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose how you'd like to set up your AMPRIORA profile and unlock AI-powered career matching.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
              {/* YES: Resume Import */}
              <button
                onClick={() => setStep(10)}
                className="p-6 bg-gradient-to-b from-sky-50 to-indigo-50/50 hover:from-sky-100 hover:to-indigo-100/80 border-2 border-sky-200 hover:border-sky-400 rounded-3xl transition-all flex flex-col items-center text-center group shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Yes, I have a resume</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload PDF/DOCX or paste text to auto-fill your profile in seconds.
                </p>
                <span className="mt-4 px-3.5 py-1 bg-sky-600 text-white font-bold text-xs rounded-full inline-flex items-center gap-1 shadow-xs">
                  Fastest <ArrowRight className="w-3 h-3" />
                </span>
              </button>

              {/* NO: Manual Onboarding */}
              <button
                onClick={() => setStep(1)}
                className="p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-3xl transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">No, I don't have a resume</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Guided manual profile creation step-by-step.
                </p>
                <span className="mt-4 text-xs font-bold text-slate-600 group-hover:text-slate-900 inline-flex items-center gap-1">
                  Manual Setup <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 10: RESUME UPLOAD & SCAN */}
        {step === 10 && (
          <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button onClick={back} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Upload Your Resume</h2>
                  <p className="text-xs text-slate-500">AMPRIORA will extract your skills, education, and experience.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AMPRIORA Parser
              </span>
            </div>

            <div className="space-y-4">
              {/* File Box */}
              <div className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 rounded-3xl p-8 text-center transition-all cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="w-12 h-12 bg-white rounded-2xl text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedFileName ? selectedFileName : "Click or drag your resume file here"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOC, DOCX, or TXT formats</p>
              </div>

              {/* Text Paste Fallback */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Or paste resume text below
                </label>
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste raw contents of your resume here..."
                  rows={5}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none transition-all resize-none"
                />
              </div>

              {parseError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button 
                onClick={() => setStep(1)} 
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Switch to manual profile creation
              </button>

              <button
                onClick={handleScanResume}
                disabled={parsingResume || (!resumeText.trim() && !fileBase64)}
                className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                {parsingResume ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Scan & Auto-Fill Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 11: REVIEW & CONFIRM EXTRACTED PROFILE DATA */}
        {step === 11 && (
          <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Review Your Extracted Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Verify, edit, or complete missing details before saving.</p>
              </div>
              <button onClick={() => setStep(10)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Re-upload
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Personal Details */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" /> Personal Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={extractedData.fullName}
                      onChange={e => setExtractedData({ ...extractedData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                    <input 
                      type="email" 
                      value={extractedData.email}
                      onChange={e => setExtractedData({ ...extractedData, email: e.target.value })}
                      placeholder="candidate@example.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Education & Major */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Education & Branch
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Degree / College</label>
                    <input 
                      type="text" 
                      value={extractedData.education}
                      onChange={e => setExtractedData({ ...extractedData, education: e.target.value })}
                      placeholder="e.g. Bachelor's Degree"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Major / Branch</label>
                    <input 
                      type="text" 
                      value={extractedData.branch}
                      onChange={e => setExtractedData({ ...extractedData, branch: e.target.value })}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Career Goals */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" /> Target Role & Goals
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role *</label>
                    <input 
                      type="text" 
                      value={extractedData.targetRole}
                      onChange={e => setExtractedData({ ...extractedData, targetRole: e.target.value })}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Dream Company</label>
                    <input 
                      type="text" 
                      value={extractedData.dreamCompany}
                      onChange={e => setExtractedData({ ...extractedData, dreamCompany: e.target.value })}
                      placeholder="e.g. Google, Stripe"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-600" /> Extracted Skills
                </div>
                <div>
                  <textarea 
                    value={Array.isArray(extractedData.skills) ? extractedData.skills.join(', ') : extractedData.skills}
                    onChange={e => setExtractedData({ ...extractedData, skills: e.target.value.split(',').map((s: string) => s.trim()) })}
                    placeholder="Enter skills separated by commas (e.g. Python, React, SQL)"
                    rows={3}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-600" /> Social Links
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn</label>
                    <input 
                      type="text" 
                      value={extractedData.linkedin}
                      onChange={e => setExtractedData({ ...extractedData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub</label>
                    <input 
                      type="text" 
                      value={extractedData.github}
                      onChange={e => setExtractedData({ ...extractedData, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {saveError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button 
                onClick={() => setStep(10)} 
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Back
              </button>

              <button
                onClick={handleConfirmResumeProfile}
                disabled={loadingSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                {loadingSave ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* MANUAL STEPS 1..4 HEADER BAR */}
        {step >= 1 && step <= 4 && (
          <div className="bg-slate-50/50 border-b border-slate-100 p-6 md:px-10 md:pt-10 md:pb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set up your profile</h1>
                <p className="text-slate-500 mt-1">Personalize your career journey on AMPRIORA.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-semibold text-sky-600">Step {step}</span>
                <span className="text-sm text-slate-400">of 4</span>
              </div>
            </div>

            <div className="flex gap-2">
              {[1,2,3,4].map(s => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1.5 rounded-full flex-1 transition-all duration-300",
                    s <= step ? "bg-sky-500" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* MANUAL STEPS 1..4 BODY */}
        {step >= 1 && step <= 4 && (
          <div className="p-6 md:p-10">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Personal & Education Details</h2>
                    <p className="text-sm text-slate-500">Tell us about your background.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input 
                      value={name} 
                      onChange={e=>setName(e.target.value)} 
                      placeholder="Enter your full name" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn Profile</label>
                      <input 
                        value={linkedin} 
                        onChange={e=>setLinkedin(e.target.value)} 
                        placeholder="https://linkedin.com/in/username" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub Profile</label>
                      <input 
                        value={github} 
                        onChange={e=>setGithub(e.target.value)} 
                        placeholder="https://github.com/username" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree Level</label>
                      <select 
                        value={education} 
                        onChange={e=>setEducation(e.target.value)} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900"
                      >
                        {EDUCATION_LEVELS.map(ed=> <option key={ed} value={ed}>{ed}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Study Year</label>
                      <select 
                        value={year} 
                        onChange={e=>setYear(e.target.value)} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900"
                      >
                        {STUDY_YEARS.map(y=> <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Major / Branch</label>
                    <input 
                      value={branch} 
                      onChange={e=>setBranch(e.target.value)} 
                      placeholder="e.g. Computer Science, Mechanical, Electronics" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-900" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Skills</h2>
                    <p className="text-sm text-slate-500">What tools and technologies do you know?</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Core Skills</label>
                  <textarea 
                    value={skills} 
                    onChange={e=>setSkills(e.target.value)} 
                    placeholder="e.g. Python, React, SQL, Machine Learning..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-900" 
                    rows={5} 
                  />
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">i</span>
                    Separate your skills with commas.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Career Goals</h2>
                    <p className="text-sm text-slate-500">What role are you preparing for?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Role / Post *</label>
                    <input 
                      value={targetRole} 
                      onChange={e=>setTargetRole(e.target.value)} 
                      placeholder="e.g. Software Engineer, AI Engineer, Data Scientist" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Career Goal Statement</label>
                      <input 
                        value={targetCareer} 
                        onChange={e=>setTargetCareer(e.target.value)} 
                        placeholder="e.g. Build AI applications" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience Level</label>
                      <select 
                        value={experience} 
                        onChange={e=>setExperience(e.target.value)} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900"
                      >
                        {EXPERIENCE_LEVELS.map(ex=> <option key={ex} value={ex}>{ex}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Dream Company</h2>
                    <p className="text-sm text-slate-500">Where would you love to work?</p>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {POPULAR_COMPANIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setDreamCompany(c)}
                        className={cn(
                          "p-4 border rounded-2xl text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer",
                          dreamCompany === c 
                            ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20" 
                            : "border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          dreamCompany === c ? "border-purple-600" : "border-slate-300"
                        )}>
                          {dreamCompany === c && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                        </div>
                        {c}
                      </button>
                    ))}
                  </div>
                  
                  {dreamCompany === 'Custom' && (
                    <div className="mt-4 animate-in slide-in-from-top-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter Company Name</label>
                      <input 
                        value={customCompany} 
                        onChange={e=>setCustomCompany(e.target.value)} 
                        placeholder="e.g. Stripe, Airbnb" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-slate-900" 
                      />
                    </div>
                  )}

                  {saveError && (
                    <div className="mt-6 rounded-xl bg-rose-50 p-4 text-xs text-rose-600 border border-rose-100 font-semibold">
                      {saveError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Footer for Manual Steps */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={back} 
                disabled={loadingSave} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={next} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleFinishManual} 
                  disabled={loadingSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                >
                  {loadingSave ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: COMPLETION SCREEN */}
        {step === 5 && (
          <div className="p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">All set, {name || 'Student'}! 🎉</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Your AMPRIORA profile is initialized and ready. Explore your personalized dashboard.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-md text-sm cursor-pointer"
            >
              Go to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
