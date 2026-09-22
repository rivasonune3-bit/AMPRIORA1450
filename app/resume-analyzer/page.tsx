"use client"

import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { useProfileContext } from '../components/ProfileProvider'
import supabaseBrowser from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileSearch, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  ChevronRight, 
  Upload, 
  FileText, 
  Target, 
  Building, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  HelpCircle,
  BarChart2
} from 'lucide-react'
import { cn } from '../../lib/utils'

// Converts resume data objects or stringified JSON into clean plain text (no raw JSON/code metadata)
function formatResumeObjectToPlainText(input: any): string {
  if (!input) return '';
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return formatResumeObjectToPlainText(parsed);
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }
  
  if (typeof input !== 'object') return String(input);

  const lines: string[] = [];
  if (input.name) lines.push(`Name: ${input.name}`);
  if (input.targetRole) lines.push(`Target Role: ${input.targetRole}`);
  if (input.email) lines.push(`Email: ${input.email}`);
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  if (input.location) lines.push(`Location: ${input.location}`);
  if (input.summary) lines.push(`\nProfessional Summary:\n${input.summary}`);
  if (input.skills) lines.push(`\nTechnical Skills:\n${typeof input.skills === 'string' ? input.skills : Array.isArray(input.skills) ? input.skills.join(', ') : ''}`);
  if (input.education) lines.push(`\nEducation:\n${input.education}`);

  if (Array.isArray(input.experience) && input.experience.length > 0) {
    lines.push('\nWork Experience:');
    input.experience.forEach((ex: any) => {
      lines.push(`- ${ex.role || 'Role'} at ${ex.company || 'Company'} (${ex.startDate || ''} - ${ex.endDate || ''}): ${ex.details || ''}`);
    });
  }

  if (Array.isArray(input.projects) && input.projects.length > 0) {
    lines.push('\nProjects:');
    input.projects.forEach((p: any) => {
      lines.push(`- ${p.title || 'Project'} (${p.technologies || ''}): ${p.description || ''} ${p.link || ''}`);
    });
  }

  if (input.achievements) lines.push(`\nAchievements:\n${input.achievements}`);
  return lines.join('\n');
}

export default function ResumeAnalyzerPage() {
  const router = useRouter()
  const [resumeText, setResumeText] = useState<string>('')
  const [fileBase64, setFileBase64] = useState<string>('')
  const [fileMimeType, setFileMimeType] = useState<string>('application/pdf')
  const [fileName, setFileName] = useState<string>('')

  const [targetRole, setTargetRole] = useState<string>('')
  const [targetCompany, setTargetCompany] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { profile, loading: profileLoading } = useProfileContext()

  useEffect(() => {
    if (!profileLoading) {
      if (profile) {
        const onboarding = profile.onboarding || {}
        
        // Auto-fill clean plain text from Profile SSoT
        const rawResume = onboarding?.resumeData || onboarding?.resume || '';
        const cleanText = formatResumeObjectToPlainText(rawResume);

        if (cleanText) setResumeText(cleanText);
        if (onboarding.targetRole) setTargetRole(onboarding.targetRole);
        if (onboarding.dreamCompany) setTargetCompany(onboarding.dreamCompany);
        if (onboarding.resumeAnalysis) setAnalysis(onboarding.resumeAnalysis);

      } else {
        setError('Failed to load profile')
      }
      setLoading(false)
    }
  }, [profile, profileLoading])

  // File Upload Handler (.pdf, .docx, .txt) with Base64 Conversion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError(null)

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
      setResumeText(`[Attached Document: ${file.name}]\nDocument is ready for analysis.`)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !fileBase64) {
      setError('Please paste your resume text or upload a resume file.')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeText,
          fileBase64,
          mimeType: fileMimeType,
          targetRole,
          targetCompany,
          jobDescription
        })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Analysis request failed')

      setAnalysis(json.data)
    } catch (e: any) {
      setError(e?.message || 'Error running resume analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AMPRIORA Resume Analyzer</h1>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Actionable Diagnostics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Serious ATS & Recruiter evaluation, section-by-section breakdown, and transparent JD matching.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/resume"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Open Resume Builder</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left Input Form (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Resume Input & Upload Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                  <span>Resume Content</span>
                </h2>

                {/* Upload File Drop Area */}
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 rounded-2xl p-4 text-center relative transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-800 block">
                    {fileName ? fileName : 'Click or drop resume file (.pdf, .docx, .txt)'}
                  </span>
                  <span className="text-[10px] text-slate-400">Pre-filled automatically if built in AMPRIORA</span>
                </div>

                {/* Textarea */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Resume Text Content</label>
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    placeholder="Paste full resume text content here..."
                    rows={8}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 transition resize-none"
                  />
                </div>

                {/* Target Role & Company Fields */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Role</label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        placeholder="e.g. Software Engineer"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Company</label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={e => setTargetCompany(e.target.value)}
                        placeholder="e.g. Google"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Job Description (Optional)</label>
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste Job Description for transparent Job Match Analysis..."
                      rows={3}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || (!resumeText.trim() && !fileBase64)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{analyzing ? 'Analyzing Resume...' : 'Analyze Resume'}</span>
                </button>
              </div>

            </div>

            {/* Right Output Results (7 Cols) */}
            <div className="lg:col-span-7">
              {!analysis ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Ready to Run Analysis</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Paste your resume text or upload a file to get an ATS compatibility score, section diagnostics, and job match alignment.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Scores Dashboard */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall Score</span>
                      <span className="text-3xl font-extrabold text-indigo-600">{analysis.overallScore || 80}/100</span>
                    </div>

                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ATS Score</span>
                      <span className="text-3xl font-extrabold text-emerald-600">{analysis.atsCompatibilityScore || 85}/100</span>
                    </div>

                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Content Quality</span>
                      <span className="text-3xl font-extrabold text-sky-600">{analysis.contentQualityScore || 78}/100</span>
                    </div>
                  </div>

                  {/* Job Match Analysis (if JD supplied) */}
                  {analysis.jobMatchAnalysis && (
                    <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Match Analysis</span>
                        <span className="text-2xl font-black text-emerald-400">{analysis.jobMatchAnalysis.matchPercentage || 85}%</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                          <span className="text-xs font-bold text-emerald-400 block mb-1.5">Matched Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {(analysis.jobMatchAnalysis.matchedKeywords || []).map((k: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded border border-emerald-800">{k}</span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                          <span className="text-xs font-bold text-rose-400 block mb-1.5">Missing Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {(analysis.jobMatchAnalysis.missingKeywords || []).map((k: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-rose-950 text-rose-300 text-[10px] font-bold rounded border border-rose-800">{k}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section-by-Section Diagnostics */}
                  {analysis.sectionAnalysis && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                        <BarChart2 className="w-5 h-5 text-indigo-600" />
                        <span>Section-wise Feedback</span>
                      </h3>

                      <div className="space-y-3">
                        {Object.entries(analysis.sectionAnalysis).map(([secKey, secData]: [string, any]) => (
                          <div key={secKey} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">{secKey}</span>
                              <span className={cn(
                                "px-2 py-0.5 text-[10px] font-bold rounded",
                                secData?.status === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              )}>
                                {secData?.status || 'Needs Review'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{secData?.feedback}</p>
                            {secData?.suggestedImprovement && (
                              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-800 font-medium">
                                <span className="font-bold text-indigo-600 block mb-0.5">Suggested Improvement:</span>
                                {secData.suggestedImprovement}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Missing Sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {(analysis.strengths || []).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5 mb-3">
                        <XCircle className="w-4 h-4 text-rose-600" /> Areas to Improve / Missing
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(analysis.missingSections || []).map((m: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actionable Suggestions & Bridge to Builder */}
                  <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-400" /> Actionable Suggestions
                      </h4>
                      <Link
                        href="/resume"
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Improve in Resume Builder</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {(analysis.actionableSuggestions || []).map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-bold text-white flex items-center justify-between">
                            <span>{item.issue || `Suggestion #${i+1}`}</span>
                            <span className="text-[10px] text-indigo-400 uppercase font-semibold">{item.category}</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{item.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardShell>
  )
}
