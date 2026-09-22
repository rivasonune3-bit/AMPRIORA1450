"use client"

import React, { useEffect, useState, useMemo } from 'react'
import supabaseBrowser from '../../lib/supabaseClient'
import { useProfileContext } from '../components/ProfileProvider'
import { useRouter } from 'next/navigation'
import DashboardShell from '../components/DashboardShell'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { 
  User, MapPin, Briefcase, GraduationCap, Edit2, Plus, 
  ExternalLink, CheckCircle2, ChevronRight, FileText,
  Star, Trophy, Loader2, X, Link as LinkIcon, Code,
  Award, Sparkles, Share2, QrCode, Cpu, Lightbulb, 
  ArrowRight, Activity, Trash2, Calendar, Camera, Mail, Phone, Target
} from 'lucide-react'
import { cn } from '../../lib/utils'

// Types
interface Skill {
  name: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  details: string
}

interface Project {
  id: string
  title: string
  description: string
  githubUrl?: string
  demoUrl?: string
}

interface EducationItem {
  id: string
  institution: string
  degree: string
  year: string
}

interface CertItem {
  id: string
  name: string
  issuer: string
  date: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Edit Modal State
  const [editMode, setEditMode] = useState<'basic' | 'about' | 'skills' | 'experience' | 'projects' | 'education' | 'certs' | null>(null)
  const [saving, setSaving] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    branch: '',
    education: '', // College
    year: '',
    targetRole: '',
    location: 'India',
    linkedin: '',
    github: '',
    portfolio: '',
    avatar: '',
    banner: '',
    email: '',
    phone: '',
    currentProfession: '',
    about: '',
    skills: [] as Skill[],
    experiences: [] as Experience[],
    projects: [] as Project[],
    educationHistory: [] as EducationItem[],
    certifications: [] as CertItem[]
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const { profile: contextProfile, loading: profileLoading, updateProfile: saveContextProfile, refreshProfile } = useProfileContext()

  useEffect(() => {
    if (!profileLoading) {
      if (!contextProfile) {
        router.push('/auth/login')
        return
      }
      setProfile(contextProfile)
      
      const ob = contextProfile.onboarding || {}
      const resData = ob.resume || {}
      
      let name = contextProfile.full_name || ''
      if (name.includes('@')) name = name.split('@')[0]

      // Parse skills
      let parsedSkills: Skill[] = []
      if (Array.isArray(ob.skillSet)) {
        parsedSkills = ob.skillSet
      } else {
        let skillsStrArr: string[] = []
        if (Array.isArray(ob.skills)) skillsStrArr = ob.skills
        else if (typeof ob.skills === 'string' && ob.skills.trim()) skillsStrArr = ob.skills.split(',').map((s:string) => s.trim())
        parsedSkills = skillsStrArr.map(s => ({ name: s, proficiency: 'Intermediate' }))
      }

      setFormData({
        fullName: name,
        branch: ob.branch || '',
        education: ob.education || '',
        year: ob.year || '',
        targetRole: ob.targetRole || '',
        location: ob.location || 'India',
        linkedin: ob.linkedin || '',
        github: ob.github || '',
        portfolio: ob.portfolio || '',
        avatar: ob.avatar || '',
        banner: ob.banner || '',
        email: ob.email || '',
        phone: ob.phone || '',
        currentProfession: ob.currentProfession || '',
        about: ob.about || ob.experience || resData.summary || '',
        skills: parsedSkills,
        experiences: Array.isArray(resData.experience) ? resData.experience.map((e:any, i:number) => ({
          id: e.id || `exp-${i}`,
          role: e.role || '',
          company: e.company || '',
          duration: e.duration || e.date || '',
          details: e.details || ''
        })) : [],
        projects: Array.isArray(resData.projects) ? resData.projects.map((p:any, i:number) => ({
          id: p.id || `proj-${i}`,
          title: p.title || '',
          description: p.description || '',
          githubUrl: p.githubUrl || '',
          demoUrl: p.demoUrl || ''
        })) : [],
        educationHistory: Array.isArray(resData.education) ? resData.education.map((e:any, i:number) => ({
          id: e.id || `edu-${i}`,
          institution: e.institution || '',
          degree: e.degree || '',
          year: e.year || ''
        })) : [],
        certifications: Array.isArray(resData.certifications) ? resData.certifications.map((c:any, i:number) => ({
          id: c.id || `cert-${i}`,
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || ''
        })) : []
      })
      setLoading(false)
    }
  }, [contextProfile, profileLoading, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedOnboarding = {
        ...(profile?.onboarding || {}),
        branch: formData.branch,
        education: formData.education,
        year: formData.year,
        about: formData.about,
        experience: formData.about, // keep legacy experience field in sync
        targetRole: formData.targetRole,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        avatar: formData.avatar,
        banner: formData.banner,
        email: formData.email,
        phone: formData.phone,
        currentProfession: formData.currentProfession,
        skillSet: formData.skills,
        skills: formData.skills.map(s => s.name), // legacy flat array
        resume: {
          ...(profile?.onboarding?.resume || {}),
          summary: formData.about,
          experience: formData.experiences,
          projects: formData.projects,
          education: formData.educationHistory,
          certifications: formData.certifications
        }
      }
      
      const success = await saveContextProfile({ full_name: formData.fullName, onboarding: updatedOnboarding }, true)
      if(!success) throw new Error('Failed to save profile. Please check connection and try again.')
      
      setProfile((p:any)=> ({...p, full_name: formData.fullName, onboarding: updatedOnboarding}))
      await refreshProfile()
      setEditMode(null)
      showToast('Profile updated successfully! ✨')
    } catch(e:any) {
      alert(e.message || 'Error saving profile')
    } finally {
      setSaving(false)
    }
  }

  const completionPercentage = useMemo(() => {
    let score = 0
    if (formData.fullName) score += 10
    if (formData.avatar) score += 5
    if (formData.about) score += 10
    if (formData.targetRole) score += 10
    if (formData.education && formData.branch) score += 10
    if (formData.skills.length > 0) score += 15
    if (formData.experiences.length > 0) score += 15
    if (formData.projects.length > 0) score += 15
    if (formData.linkedin || formData.github) score += 10
    return Math.min(100, score)
  }, [formData])

  if (loading) {
    return (
      <DashboardShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </DashboardShell>
    )
  }

  const renderEditModal = () => {
    if (!editMode) return null

    const handleArrayItemAdd = (field: keyof typeof formData, emptyItem: any) => {
      setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), emptyItem] }))
    }

    const handleArrayItemUpdate = (field: keyof typeof formData, index: number, key: string, value: string) => {
      setFormData(prev => {
        const newArr = [...(prev[field] as any[])]
        newArr[index] = { ...newArr[index], [key]: value }
        return { ...prev, [field]: newArr }
      })
    }

    const handleArrayItemRemove = (field: keyof typeof formData, index: number) => {
      setFormData(prev => {
        const newArr = [...(prev[field] as any[])]
        newArr.splice(index, 1)
        return { ...prev, [field]: newArr }
      })
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              Edit {editMode.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <button onClick={() => setEditMode(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 grow">
            {editMode === 'basic' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6 relative">
                  {/* Banner Uploader */}
                  <div className="w-full h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl relative overflow-hidden group cursor-pointer shrink-0">
                    {formData.banner && (
                      <img src={formData.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Camera className="w-6 h-6 mr-2" />
                      <span className="text-sm font-bold">Edit Background</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 1920;
                            const MAX_HEIGHT = 720;
                            let width = img.width;
                            let height = img.height;
                            if (width > height) {
                              if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                              }
                            } else {
                              if (height > MAX_HEIGHT) {
                                width = Math.round((width * MAX_HEIGHT) / height);
                                height = MAX_HEIGHT;
                              }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;
                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = 'high';
                            ctx.drawImage(img, 0, 0, width, height);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                            setFormData(p => ({ ...p, banner: dataUrl }));
                          };
                          img.src = event.target?.result as string;
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                  
                  {/* Avatar Uploader */}
                  <div className="relative -mt-16 group">
                    <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0 cursor-pointer relative z-10">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover object-center" />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white cursor-pointer">
                        <Edit2 className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Upload</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const MAX_WIDTH = 800;
                              const MAX_HEIGHT = 800;
                              let width = img.width;
                              let height = img.height;

                              if (width > height) {
                                if (width > MAX_WIDTH) {
                                  height = Math.round((height * MAX_WIDTH) / width);
                                  width = MAX_WIDTH;
                                }
                              } else {
                                if (height > MAX_HEIGHT) {
                                  width = Math.round((width * MAX_HEIGHT) / height);
                                  height = MAX_HEIGHT;
                                }
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              if (!ctx) return;
                              ctx.imageSmoothingEnabled = true;
                              ctx.imageSmoothingQuality = 'high';
                              ctx.drawImage(img, 0, 0, width, height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                              setFormData(p => ({ ...p, avatar: dataUrl }));
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full hidden">
                    {/* Hidden URL input fallback */}
                    <label className="block text-sm font-bold text-slate-700 mb-1">Avatar URL</label>
                    <input value={formData.avatar} onChange={e=>setFormData(p=>({...p, avatar: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm" placeholder="https://..." />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label><input value={formData.fullName} onChange={e=>setFormData(p=>({...p, fullName: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Current Profession / Headline</label><input value={formData.currentProfession} onChange={e=>setFormData(p=>({...p, currentProfession: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="e.g. Student at MIT | Web Developer" /></div>
                  
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Target Role</label><input value={formData.targetRole} onChange={e=>setFormData(p=>({...p, targetRole: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="e.g. AI Engineer" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Location</label><input value={formData.location} onChange={e=>setFormData(p=>({...p, location: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e=>setFormData(p=>({...p, email: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label><input value={formData.phone} onChange={e=>setFormData(p=>({...p, phone: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>

                  <div><label className="block text-sm font-bold text-slate-700 mb-1">College/University</label><input value={formData.education} onChange={e=>setFormData(p=>({...p, education: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Branch/Major</label><input value={formData.branch} onChange={e=>setFormData(p=>({...p, branch: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Graduation Year</label><input value={formData.year} onChange={e=>setFormData(p=>({...p, year: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  <div className="hidden sm:block"></div>

                  <div><label className="block text-sm font-bold text-slate-700 mb-1">LinkedIn URL</label><input value={formData.linkedin} onChange={e=>setFormData(p=>({...p, linkedin: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">GitHub URL</label><input value={formData.github} onChange={e=>setFormData(p=>({...p, github: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" /></div>
                </div>
              </div>
            )}

            {editMode === 'about' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Professional Summary</label>
                <textarea value={formData.about} onChange={e=>setFormData(p=>({...p, about: e.target.value}))} rows={8} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm resize-none" placeholder="Share your story, passions, and career aspirations..." />
              </div>
            )}

            {editMode === 'skills' && (
              <div className="space-y-4">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <input value={skill.name} onChange={e => handleArrayItemUpdate('skills', idx, 'name', e.target.value)} placeholder="Skill name" className="flex-1 bg-transparent text-sm font-medium outline-none" />
                    <select value={skill.proficiency} onChange={e => handleArrayItemUpdate('skills', idx, 'proficiency', e.target.value)} className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none font-medium text-slate-700">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button onClick={() => handleArrayItemRemove('skills', idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => handleArrayItemAdd('skills', { name: '', proficiency: 'Intermediate' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
              </div>
            )}

            {editMode === 'experience' && (
              <div className="space-y-6">
                {formData.experiences.map((exp, idx) => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative group">
                    <button onClick={() => handleArrayItemRemove('experiences', idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                    <input value={exp.role} onChange={e => handleArrayItemUpdate('experiences', idx, 'role', e.target.value)} placeholder="Role (e.g. Frontend Intern)" className="w-full font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={exp.company} onChange={e => handleArrayItemUpdate('experiences', idx, 'company', e.target.value)} placeholder="Company" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                      <input value={exp.duration} onChange={e => handleArrayItemUpdate('experiences', idx, 'duration', e.target.value)} placeholder="Duration (e.g. May 2024 - Aug 2024)" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                    </div>
                    <textarea value={exp.details} onChange={e => handleArrayItemUpdate('experiences', idx, 'details', e.target.value)} placeholder="Details and impact..." rows={2} className="w-full text-sm outline-none resize-none pt-2 text-slate-600" />
                  </div>
                ))}
                <button onClick={() => handleArrayItemAdd('experiences', { id: `exp-${Date.now()}`, role: '', company: '', duration: '', details: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            )}

            {editMode === 'projects' && (
              <div className="space-y-6">
                {formData.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative group">
                    <button onClick={() => handleArrayItemRemove('projects', idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                    <input value={proj.title} onChange={e => handleArrayItemUpdate('projects', idx, 'title', e.target.value)} placeholder="Project Title" className="w-full font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={proj.githubUrl} onChange={e => handleArrayItemUpdate('projects', idx, 'githubUrl', e.target.value)} placeholder="GitHub URL" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                      <input value={proj.demoUrl} onChange={e => handleArrayItemUpdate('projects', idx, 'demoUrl', e.target.value)} placeholder="Live Demo URL" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                    </div>
                    <textarea value={proj.description} onChange={e => handleArrayItemUpdate('projects', idx, 'description', e.target.value)} placeholder="What did you build and which technologies did you use?" rows={2} className="w-full text-sm outline-none resize-none pt-2 text-slate-600" />
                  </div>
                ))}
                <button onClick={() => handleArrayItemAdd('projects', { id: `proj-${Date.now()}`, title: '', description: '', githubUrl: '', demoUrl: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            )}

            {editMode === 'education' && (
              <div className="space-y-6">
                {formData.educationHistory.map((edu, idx) => (
                  <div key={edu.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative group">
                    <button onClick={() => handleArrayItemRemove('educationHistory', idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                    <input value={edu.institution} onChange={e => handleArrayItemUpdate('educationHistory', idx, 'institution', e.target.value)} placeholder="Institution Name" className="w-full font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={edu.degree} onChange={e => handleArrayItemUpdate('educationHistory', idx, 'degree', e.target.value)} placeholder="Degree/Major" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                      <input value={edu.year} onChange={e => handleArrayItemUpdate('educationHistory', idx, 'year', e.target.value)} placeholder="Graduation Year" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayItemAdd('educationHistory', { id: `edu-${Date.now()}`, institution: '', degree: '', year: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            )}

            {editMode === 'certs' && (
              <div className="space-y-6">
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative group">
                    <button onClick={() => handleArrayItemRemove('certifications', idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                    <input value={cert.name} onChange={e => handleArrayItemUpdate('certifications', idx, 'name', e.target.value)} placeholder="Certification Name" className="w-full font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={cert.issuer} onChange={e => handleArrayItemUpdate('certifications', idx, 'issuer', e.target.value)} placeholder="Issuer (e.g. AWS, Coursera)" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                      <input value={cert.date} onChange={e => handleArrayItemUpdate('certifications', idx, 'date', e.target.value)} placeholder="Date Earned" className="text-sm outline-none border-b border-slate-200 pb-1 focus:border-indigo-500" />
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayItemAdd('certifications', { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border-t border-slate-100 p-5 flex justify-end gap-3 shrink-0 z-10">
            <button onClick={() => setEditMode(null)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-500/20 text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {renderEditModal()}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6 pb-12">
        
        {/* HERO COMPONENT - FULL WIDTH SPAN (LINKEDIN STYLE) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Cover Photo / Banner */}
          <div className="w-full h-40 md:h-64 bg-slate-200 relative group">
            {formData.banner ? (
              <img src={formData.banner} alt="Banner" className="w-full h-full object-cover object-center" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            
            {/* Top Right Action Buttons */}
            <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row gap-2">
                <button onClick={() => setEditMode('basic')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors shadow-sm text-sm font-semibold opacity-0 group-hover:opacity-100">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Cover Photo</span>
                </button>
                <div className="flex gap-2">
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    showToast('Profile link copied!')
                  }} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditMode('basic')} className="w-10 h-10 rounded-xl bg-white text-indigo-600 border border-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
            </div>
          </div>
          
          <div className="px-6 md:px-10 pb-8 md:pb-10 flex flex-col relative z-10 -mt-16 md:-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 md:border-[6px] border-white bg-slate-100 flex items-center justify-center text-5xl font-bold text-slate-400 shadow-lg overflow-hidden shrink-0 relative group cursor-pointer" onClick={() => setEditMode('basic')}>
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover object-center" />
                ) : formData.fullName ? (
                  formData.fullName.charAt(0).toUpperCase()
                ) : (
                  <User className="w-16 h-16" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Edit Photo</span>
                </div>
              </div>
              
              {/* Profile Completion Badge */}
              <div className="hidden md:flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm mb-2 hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Strength</span>
                  <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" style={{width: `${completionPercentage}%`}}></div>
                  </div>
                </div>
                <div className="text-xl font-black text-indigo-600">{completionPercentage}%</div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {formData.fullName || 'Add your name'}
                    {completionPercentage === 100 && <Award className="w-7 h-7 text-emerald-500 fill-emerald-100" />}
                  </h1>
                  
                  {/* Current Profession Section */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold">Current:</span>
                    <span className="text-sm font-medium">{formData.currentProfession || 'Add your current profession / headline'}</span>
                  </div>
                  
                </div>
                
                {formData.targetRole && (
                  <div className="md:text-right flex flex-col items-start md:items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Target Role
                    </span>
                    <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-black border border-indigo-100/50 shadow-sm text-lg">
                      {formData.targetRole}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact & Meta Info Section */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500 mt-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {formData.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  {formData.education || 'Add College'} {formData.year ? `• ${formData.year}` : ''}
                </div>
                {formData.email && (
                  <a href={`mailto:${formData.email}`} className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
                    <Mail className="w-4 h-4 text-slate-400" /> {formData.email}
                  </a>
                )}
                {formData.phone && (
                  <a href={`tel:${formData.phone}`} className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
                    <Phone className="w-4 h-4 text-slate-400" /> {formData.phone}
                  </a>
                )}
                {formData.linkedin && (
                  <a href={formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sky-600 hover:underline font-semibold">
                    <LinkIcon className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {formData.github && (
                  <a href={formData.github.startsWith('http') ? formData.github : `https://${formData.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-800 hover:underline font-semibold">
                    <Code className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN COLUMN (LEFT) */}
        <div className="lg:col-span-8 space-y-6">


          {/* ABOUT */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
            <button onClick={() => setEditMode('about')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> About
            </h2>
            {formData.about ? (
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">{formData.about}</p>
            ) : (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm mb-2 font-medium">No professional summary added.</p>
                <button onClick={() => setEditMode('about')} className="text-indigo-600 font-bold text-sm hover:underline">Add Summary</button>
              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
            <button onClick={() => setEditMode('skills')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" /> Technical Skills
            </h2>
            {formData.skills.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 text-sm">{skill.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{skill.proficiency}</span>
                      <div className="flex gap-0.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", skill.proficiency ? "bg-indigo-500" : "bg-slate-300")} />
                        <div className={cn("w-1.5 h-1.5 rounded-full", ['Intermediate', 'Advanced', 'Expert'].includes(skill.proficiency) ? "bg-indigo-500" : "bg-slate-300")} />
                        <div className={cn("w-1.5 h-1.5 rounded-full", ['Advanced', 'Expert'].includes(skill.proficiency) ? "bg-indigo-500" : "bg-slate-300")} />
                        <div className={cn("w-1.5 h-1.5 rounded-full", skill.proficiency === 'Expert' ? "bg-indigo-500" : "bg-slate-300")} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm mb-2 font-medium">Highlight your top tools and technologies.</p>
                <button onClick={() => setEditMode('skills')} className="text-indigo-600 font-bold text-sm hover:underline">Add Skills</button>
              </div>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
            <button onClick={() => setEditMode('experience')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" /> Experience
            </h2>
            
            {formData.experiences.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {formData.experiences.map((exp, i) => (
                  <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-indigo-500 mb-1">{exp.duration}</div>
                      <h3 className="font-bold text-slate-900">{exp.role}</h3>
                      <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                      <p className="text-sm text-slate-500 whitespace-pre-wrap">{exp.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm mb-2 font-medium">Showcase internships, part-time roles, or leadership.</p>
                <button onClick={() => setEditMode('experience')} className="text-indigo-600 font-bold text-sm hover:underline">Add Experience</button>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
            <button onClick={() => setEditMode('projects')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-500" /> Projects
            </h2>
            
            {formData.projects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {formData.projects.map((proj) => (
                  <div key={proj.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all group/card flex flex-col">
                    <h3 className="font-bold text-slate-900 group-hover/card:text-indigo-600 transition-colors mb-2">{proj.title}</h3>
                    <p className="text-sm text-slate-600 flex-1 line-clamp-3 mb-4">{proj.description}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                          <Code className="w-4 h-4" />
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a href={proj.demoUrl.startsWith('http') ? proj.demoUrl : `https://${proj.demoUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm mb-2 font-medium">Projects demonstrate your practical abilities.</p>
                <button onClick={() => setEditMode('projects')} className="text-indigo-600 font-bold text-sm hover:underline">Add Project</button>
              </div>
            )}
          </div>
          
          {/* EDUCATION & CERTS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
              <button onClick={() => setEditMode('education')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" /> Education
              </h2>
              {formData.educationHistory.length > 0 ? (
                <div className="space-y-4">
                  {formData.educationHistory.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-slate-900 text-sm">{edu.institution}</h3>
                      <p className="text-sm font-medium text-slate-600">{edu.degree}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{edu.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <button onClick={() => setEditMode('education')} className="text-indigo-600 font-bold text-xs hover:underline">Add Education</button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative group">
              <button onClick={() => setEditMode('certs')} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" /> Certifications
              </h2>
              {formData.certifications.length > 0 ? (
                <div className="space-y-4">
                  {formData.certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-bold text-slate-900 text-sm">{cert.name}</h3>
                      <p className="text-sm font-medium text-slate-600">{cert.issuer}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{cert.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <button onClick={() => setEditMode('certs')} className="text-indigo-600 font-bold text-xs hover:underline">Add Certification</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DIGITAL ID CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="font-bold text-slate-900 mb-5 w-full text-left flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-500" /> Digital Student ID
            </h3>
            
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-4">
              <QRCode 
                value={`https://ampriora.com/u/${profile?.id || 'demo'}`} 
                size={140}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor="#0f172a"
              />
            </div>
            
            <div className="text-center w-full relative z-10">
              <h4 className="font-bold text-slate-900 text-lg">{formData.fullName}</h4>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-1 mb-4">Verified Student</p>
              
              <Link href="/digital-id" className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md">
                <ExternalLink className="w-4 h-4" /> Open Full ID
              </Link>
            </div>
          </div>

          {/* RESUME BUILDER ACTION */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl border border-indigo-100 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Resume Studio</h3>
            <p className="text-sm text-slate-600 mb-5">Your profile data automatically syncs with your professional resume. Generate ATS-friendly formats instantly.</p>
            <div className="flex flex-col gap-2">
              <Link href="/resume" className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                View Generated Resume
              </Link>
              <Link href="/resume-analyzer" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
                Analyze ATS Score
              </Link>
            </div>
          </div>


        </div>
      </div>
    </DashboardShell>
  )
}
