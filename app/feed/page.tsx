"use client"

import React, { useState, useEffect, useMemo } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import supabaseBrowser from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProfileContext } from '../components/ProfileProvider'
import { 
  Sparkles, 
  Image as ImageIcon, 
  FolderGit2, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  TrendingUp, 
  Search, 
  Filter, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Heart, 
  Flame, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Smile, 
  X, 
  Check, 
  Trash2,
  Edit3,
  Loader2,
  Tag,
  Rocket,
  Code2,
  ChevronRight,
  Globe,
  Lock,
  UserCheck,
  UserPlus,
  User,
  AlertCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FeedComment {
  id: string
  authorId?: string
  authorName: string
  authorAvatar?: string
  authorRole: string
  content: string
  createdAt: string
  likes?: number
}

export interface FeedPost {
  id: string
  authorId?: string
  authorName: string
  authorAvatar?: string
  authorRole: string
  authorCompanyOrSchool?: string
  authorBadge?: string
  createdAt: string
  content: string
  tags?: string[]
  mediaUrl?: string
  mediaType?: 'text' | 'image' | 'code' | 'project'
  projectDetails?: {
    title: string
    description: string
    githubUrl?: string
    demoUrl?: string
    techStack: string[]
  }
  likesCount: number
  hasLiked?: boolean
  likedBy?: string[]
  comments: FeedComment[]
  sharesCount: number
  isSaved?: boolean
  isUserPost?: boolean
}

export interface SuggestedMember {
  id: string
  name: string
  avatar?: string
  title?: string
  college?: string
  skills?: string[]
}

export default function SocialFeedPage() {
  const router = useRouter()
  const { profile: contextProfile, loading: profileLoading } = useProfileContext()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [suggestedMembers, setSuggestedMembers] = useState<SuggestedMember[]>([])
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-posts' | 'projects' | 'media' | 'saved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [composerType, setComposerType] = useState<'text' | 'image' | 'project'>('text')
  const [postContent, setPostContent] = useState('')
  const [postTags, setPostTags] = useState('')
  const [postImageUrl, setPostImageUrl] = useState('')
  
  // Project Post Details
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectGithub, setProjectGithub] = useState('')
  const [projectDemo, setProjectDemo] = useState('')
  const [projectTechStack, setProjectTechStack] = useState('Next.js, TypeScript, Tailwind')

  const [isPublishing, setIsPublishing] = useState(false)

  // Active Comment Box states (post id -> comment text)
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [commentInputText, setCommentInputText] = useState<{ [postId: string]: string }>({})

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const getAuthHeader = async (): Promise<Record<string, string>> => {
    try {
      const { data } = await supabaseBrowser.auth.getSession()
      const token = data.session?.access_token
      return token ? { Authorization: `Bearer ${token}` } : {}
    } catch (e) {
      return {}
    }
  }

  // Fetch real posts from Supabase via API
  const fetchFeed = async () => {
    setLoading(true)
    setError(null)
    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/feed', { headers })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to load community feed')
      } else {
        setPosts(data.posts || [])
        setSuggestedMembers(data.suggestedMembers || [])
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching feed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [contextProfile])

  const handleCreatePost = async () => {
    if (!postContent.trim() && composerType === 'text') return

    setIsPublishing(true)
    try {
      const headers = await getAuthHeader()
      const parsedTags = postTags
        .split(/[,\s]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`)

      const payload = {
        content: postContent.trim(),
        mediaUrl: postImageUrl.trim() || undefined,
        mediaType: composerType === 'project' ? 'project' : (postImageUrl.trim() ? 'image' : 'text'),
        projectDetails: composerType === 'project' ? {
          title: projectTitle.trim() || 'My Engineering Project',
          description: projectDescription.trim() || 'Project built with modern technology stack.',
          githubUrl: projectGithub.trim() || undefined,
          demoUrl: projectDemo.trim() || undefined,
          techStack: projectTechStack.split(',').map(s => s.trim()).filter(Boolean)
        } : undefined,
        tags: parsedTags
      }

      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        alert(data.error || 'Failed to publish post')
      } else if (data.post) {
        setPosts(prev => [data.post, ...prev])
        setPostContent('')
        setPostTags('')
        setPostImageUrl('')
        setProjectTitle('')
        setProjectDescription('')
        setProjectGithub('')
        setProjectDemo('')
        setIsComposerOpen(false)
        showToast('Post published successfully! 🎉')
      }
    } catch (e: any) {
      alert(e.message || 'Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`/api/feed?id=${postId}`, {
        method: 'DELETE',
        headers
      })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
        showToast('Post removed.')
      }
    } catch (e) {
      console.error('Delete error:', e)
    }
  }

  const handleToggleLike = async (postId: string) => {
    // Optimistic local update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const hasLiked = !p.hasLiked
      const likesCount = hasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
      return { ...p, hasLiked, likesCount }
    }))

    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/feed/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ postId })
      })
      const data = await res.json()
      if (data.post) {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, ...data.post } : p)))
      }
    } catch (e) {
      console.error('Like error:', e)
    }
  }

  const handleAddComment = async (postId: string) => {
    const text = commentInputText[postId]?.trim()
    if (!text) return

    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/feed/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ postId, content: text })
      })
      const data = await res.json()
      if (data.post) {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, ...data.post } : p)))
        setCommentInputText(prev => ({ ...prev, [postId]: '' }))
        showToast('Comment added!')
      }
    } catch (e) {
      console.error('Comment error:', e)
    }
  }

  const handleToggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const nextSaved = !p.isSaved
      showToast(nextSaved ? 'Post saved to your bookmarks!' : 'Post removed from bookmarks.')
      return { ...p, isSaved: nextSaved }
    }))
  }

  const handleSharePost = (postId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/feed#${postId}`)
      showToast('Link copied to clipboard! 🔗')
    } else {
      showToast('Link ready to share!')
    }
  }

  const navigateToProfile = (authorId?: string) => {
    if (authorId) {
      router.push(`/profile/${authorId}`)
    } else {
      router.push('/profile')
    }
  }

  // Filter and search computation
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (activeFilter === 'my-posts' && !post.isUserPost) return false
      if (activeFilter === 'projects' && post.mediaType !== 'project') return false
      if (activeFilter === 'media' && !post.mediaUrl) return false
      if (activeFilter === 'saved' && !post.isSaved) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchAuthor = post.authorName.toLowerCase().includes(query)
        const matchContent = post.content.toLowerCase().includes(query)
        const matchTags = post.tags?.some(t => t.toLowerCase().includes(query))
        const matchProject = post.projectDetails?.title.toLowerCase().includes(query) || 
                             post.projectDetails?.techStack.some(ts => ts.toLowerCase().includes(query))
        return matchAuthor || matchContent || matchTags || matchProject
      }

      return true
    })
  }, [posts, activeFilter, searchQuery])

  const userDisplayName = contextProfile?.full_name?.includes('@') 
    ? contextProfile.full_name.split('@')[0] 
    : (contextProfile?.full_name || 'Member Developer')

  const userAvatar = contextProfile?.onboarding?.avatar || ''

  return (
    <DashboardShell>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto pb-16">
        
        <FeatureBanner
          title="Community Feed & Showcases"
          subtitle="Connect with fellow AMPRIORA members, share projects, explore real career updates, and engage with real peers."
          icon={Sparkles}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* MAIN FEED CONTENT COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CREATE POST BAR */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => navigateToProfile(contextProfile?.id)}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold flex items-center justify-center shrink-0 cursor-pointer shadow-md overflow-hidden"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userDisplayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userDisplayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-left text-sm font-medium px-5 py-3.5 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between"
                >
                  <span>Share an update, project showcase, or career milestone...</span>
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 px-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setComposerType('text'); setIsComposerOpen(true); }}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-500" /> Text Post
                  </button>
                  <button
                    onClick={() => { setComposerType('image'); setIsComposerOpen(true); }}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500" /> Photo
                  </button>
                  <button
                    onClick={() => { setComposerType('project'); setIsComposerOpen(true); }}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <FolderGit2 className="w-4 h-4 text-purple-500" /> Project Showcase
                  </button>
                </div>

                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create Post
                </button>
              </div>
            </div>

            {/* FEED FILTER TABS & SEARCH BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Feed' },
                  { id: 'my-posts', label: 'My Posts' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'media', label: 'Photos' },
                  { id: 'saved', label: 'Saved' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      activeFilter === tab.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative shrink-0 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts or tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">Failed to load posts</h3>
                <p className="text-xs text-rose-600 mb-4">{error}</p>
                <button 
                  onClick={fetchFeed} 
                  className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* SKELETON LOADING STATE */}
            {loading && (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-2xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-40 bg-slate-100 rounded-2xl" />
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE (Requirements 1 & 8: Zero fake posts) */}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Be the first to share something with the AMPRIORA community.
                </p>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create First Post
                </button>
              </div>
            )}

            {/* FEED POSTS LIST */}
            {!loading && !error && filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                
                {/* Post Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => navigateToProfile(post.authorId)}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 cursor-pointer shadow-md overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{post.authorName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => navigateToProfile(post.authorId)}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {post.authorName}
                        </span>
                        {post.authorBadge && (
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md text-[10px] border border-indigo-100">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {post.authorRole} • {post.authorCompanyOrSchool}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {post.createdAt ? (
                          new Date(post.createdAt).toString() !== 'Invalid Date' 
                            ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : post.createdAt
                        ) : 'Just now'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleSavePost(post.id)}
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        post.isSaved ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    {post.isUserPost && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {post.content}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => setSearchQuery(tag)}
                        className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Media Image Attachment */}
                {post.mediaUrl && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 max-h-96 flex items-center justify-center">
                    <img src={post.mediaUrl} alt="Post attachment" className="max-h-96 w-full object-cover" />
                  </div>
                )}

                {/* Project Details Showcase */}
                {post.mediaType === 'project' && post.projectDetails && (
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-sky-50/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold text-slate-900 text-sm">{post.projectDetails.title}</h4>
                      </div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
                        Project Showcase
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {post.projectDetails.description}
                    </p>

                    {post.projectDetails.techStack && post.projectDetails.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.projectDetails.techStack.map((tech, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 border-t border-indigo-100/60">
                      {post.projectDetails.githubUrl && (
                        <a
                          href={post.projectDetails.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          <Code2 className="w-3.5 h-3.5 text-slate-600" /> GitHub Repository
                        </a>
                      )}
                      {post.projectDetails.demoUrl && (
                        <a
                          href={post.projectDetails.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement Metrics & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all",
                        post.hasLiked 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "hover:bg-slate-100 text-slate-600"
                      )}
                    >
                      <ThumbsUp className={cn("w-4 h-4", post.hasLiked && "fill-indigo-600 text-indigo-600")} />
                      <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSharePost(post.id)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                {(activeCommentPostId === post.id || (post.comments && post.comments.length > 0)) && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    
                    {/* List Existing Comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div 
                              onClick={() => navigateToProfile(comment.authorId)}
                              className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer overflow-hidden mt-0.5"
                            >
                              {comment.authorAvatar ? (
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
                              ) : (
                                <span>{comment.authorName.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span 
                                  onClick={() => navigateToProfile(comment.authorId)}
                                  className="font-bold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer transition-colors"
                                >
                                  {comment.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {comment.createdAt ? (
                                    new Date(comment.createdAt).toString() !== 'Invalid Date'
                                      ? new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                      : comment.createdAt
                                  ) : 'Just now'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputText[post.id] || ''}
                        onChange={e => setCommentInputText({ ...commentInputText, [post.id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id)
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputText[post.id]?.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>

          {/* RIGHT SIDEBAR COLUMN (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* USER MINI PROFILE CARD */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center relative overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-indigo-600 to-sky-600 -mx-6 -mt-6 mb-4" />
              <div 
                onClick={() => navigateToProfile(contextProfile?.id)}
                className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto -mt-10 border-4 border-white shadow-md cursor-pointer overflow-hidden relative"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{userDisplayName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <h3 
                onClick={() => navigateToProfile(contextProfile?.id)}
                className="font-bold text-slate-900 text-base mt-2 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                {userDisplayName}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {contextProfile?.onboarding?.targetRole || 'Software Engineer'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {contextProfile?.onboarding?.education || 'AMPRIORA Campus'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <Link
                  href="/profile"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200/80 block text-center"
                >
                  View Full Profile
                </Link>
              </div>
            </div>

            {/* SUGGESTED AMPRIORA MEMBERS (Real Supabase Users Only) */}
            {suggestedMembers.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" /> AMPRIORA Members
                </h3>
                <div className="space-y-4">
                  {suggestedMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => navigateToProfile(member.id)}
                          className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                        >
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{member.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p 
                            onClick={() => navigateToProfile(member.id)}
                            className="font-bold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {member.name}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{member.title}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateToProfile(member.id)}
                        className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* CREATE POST MODAL COMPOSER */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-4 p-6 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Create Post</h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Composer Type Selection */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setComposerType('text')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
                  composerType === 'text' ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Edit3 className="w-3.5 h-3.5" /> Text
              </button>
              <button
                onClick={() => setComposerType('image')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
                  composerType === 'image' ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Image
              </button>
              <button
                onClick={() => setComposerType('project')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
                  composerType === 'project' ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <FolderGit2 className="w-3.5 h-3.5" /> Project
              </button>
            </div>

            {/* Author Bar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt={userDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{userDisplayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">{userDisplayName}</p>
                <p className="text-[10px] text-slate-500 font-medium">Posting to AMPRIORA Community</p>
              </div>
            </div>

            {/* Post Content Input */}
            <textarea
              rows={4}
              placeholder="What are you working on or thinking about?"
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-medium"
            />

            {/* Image URL Input if Image Post */}
            {(composerType === 'image' || composerType === 'text') && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={postImageUrl}
                  onChange={e => setPostImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Project Showcase Inputs if Project Post */}
            {composerType === 'project' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">Project Details</h4>
                <input
                  type="text"
                  placeholder="Project Title (e.g., AI Code Assistant)"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="GitHub Link (https://...)"
                    value={projectGithub}
                    onChange={e => setProjectGithub(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Live Demo Link (https://...)"
                    value={projectDemo}
                    onChange={e => setProjectDemo(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated: Next.js, Python, Tailwind)"
                  value={projectTechStack}
                  onChange={e => setProjectTechStack(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            {/* Tags Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Hashtags (comma separated)</label>
              <input
                type="text"
                placeholder="#ArtificialIntelligence, #WebDev, #CareerAdvice"
                value={postTags}
                onChange={e => setPostTags(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsComposerOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={isPublishing || (!postContent.trim() && composerType === 'text')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Publish Post
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardShell>
  )
}
