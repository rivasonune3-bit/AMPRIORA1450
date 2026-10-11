"use client"

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import DashboardShell from '../components/DashboardShell'
import supabaseBrowser from '../../lib/supabaseClient'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProfileContext } from '../components/ProfileProvider'
import { 
  Search, 
  Send, 
  Sparkles, 
  MessageSquare, 
  MoreVertical, 
  Phone, 
  Video, 
  User, 
  Paperclip, 
  Smile, 
  Clock, 
  CheckCheck, 
  Check, 
  Circle, 
  Plus, 
  ArrowLeft, 
  ExternalLink, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Code, 
  FileText, 
  X, 
  Trash2, 
  Loader2,
  Users,
  CheckCircle2,
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ChatMessage {
  id: string
  senderId: 'me' | string
  senderName: string
  senderAvatar?: string
  text: string
  timestamp: string
  isRead?: boolean
  attachment?: {
    type: 'project' | 'file' | 'schedule' | 'code'
    title: string
    subtitle?: string
    url?: string
    metadata?: string
  }
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole: string
  participantCompanyOrSchool: string
  participantBadge?: string
  isOnline: boolean
  lastSeen?: string
  messages: ChatMessage[]
  unreadCount: number
  pinned?: boolean
}

export interface SearchedUser {
  id: string
  name: string
  avatar?: string
  title?: string
  college?: string
  location?: string
}

const QUICK_REPLY_SUGGESTIONS = [
  "Thanks for connecting! 🙌",
  "I'd love to discuss potential projects.",
  "Here is my portfolio link to check out:",
  "Sounds great! Looking forward to it.",
  "Could you share more details?"
]

function MessengerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sharedContent = searchParams.get('share')
  const initialTargetUserId = searchParams.get('user')

  const { profile: contextProfile, loading: profileLoading } = useProfileContext()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)

  // New Chat Modal state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userSearchResults, setUserSearchResults] = useState<SearchedUser[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [startingChatUserId, setStartingChatUserId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getAuthHeader = async (): Promise<Record<string, string>> => {
    try {
      const { data } = await supabaseBrowser.auth.getSession()
      const token = data.session?.access_token
      return token ? { Authorization: `Bearer ${token}` } : {}
    } catch (e) {
      return {}
    }
  }

  // Fetch real conversations from Supabase via API
  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/messages', { headers })
      const data = await res.json()

      if (!res.ok || data.error) {
        if (!silent) setError(data.error || 'Failed to load conversations')
      } else {
        const convs: Conversation[] = data.conversations || []
        setConversations(convs)

        if (convs.length > 0 && !activeConvId) {
          setActiveConvId(convs[0].id)
        }
      }
    } catch (err: any) {
      if (!silent) setError(err?.message || 'Network error')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Initial load + interval polling every 4 seconds for real-time messages
  useEffect(() => {
    fetchConversations(false)

    const interval = setInterval(() => {
      fetchConversations(true)
    }, 4000)

    return () => clearInterval(interval)
  }, [contextProfile])

  // Handle URL param target user if directed from another page
  useEffect(() => {
    if (initialTargetUserId && !profileLoading) {
      handleStartConversationWithUser(initialTargetUserId)
    }
  }, [initialTargetUserId, profileLoading])

  // Pre-fill shared text if passed via search param
  useEffect(() => {
    if (sharedContent) {
      setInputText(`Check out this update: ${sharedContent}`)
    }
  }, [sharedContent])

  // Scroll to bottom when active conversation messages update
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConvId) || null
  }, [conversations, activeConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages?.length])

  // Search users in New Chat Modal
  const searchUsersInSupabase = async (query: string) => {
    setIsSearchingUsers(true)
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`/api/messages/users?q=${encodeURIComponent(query)}`, { headers })
      const data = await res.json()
      if (data.users) {
        setUserSearchResults(data.users)
      }
    } catch (err) {
      console.error('Search users error:', err)
    } finally {
      setIsSearchingUsers(false)
    }
  }

  useEffect(() => {
    if (isNewChatOpen) {
      searchUsersInSupabase(userSearchQuery)
    }
  }, [isNewChatOpen, userSearchQuery])

  // Start/Open conversation with a selected user
  const handleStartConversationWithUser = async (targetUserId: string) => {
    setStartingChatUserId(targetUserId)
    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/messages/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ targetUserId })
      })

      const data = await res.json()
      if (data.conversationId) {
        await fetchConversations(true)
        setActiveConvId(data.conversationId)
        setIsNewChatOpen(false)
        setIsMobileChatOpen(true)
      } else if (data.error) {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message || 'Failed to start conversation')
    } finally {
      setStartingChatUserId(null)
    }
  }

  // Send real message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || !activeConvId) return

    setIsSending(true)
    const activeConv = activeConversation

    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          conversationId: activeConvId,
          targetUserId: activeConv?.participantId,
          text: text.trim()
        })
      })

      const data = await res.json()
      if (data.message) {
        setInputText('')
        await fetchConversations(true)
      } else if (data.error) {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const navigateToProfile = (userId?: string) => {
    if (userId) {
      router.push(`/profile/${userId}`)
    }
  }

  // Filter conversations in sidebar
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const matchName = c.participantName.toLowerCase().includes(q)
      const matchRole = c.participantRole.toLowerCase().includes(q)
      const matchCompany = c.participantCompanyOrSchool.toLowerCase().includes(q)
      const matchLastMsg = c.messages.some(m => m.text.toLowerCase().includes(q))
      return matchName || matchRole || matchCompany || matchLastMsg
    })
  }, [conversations, searchQuery])

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-8">
        
        {/* MESSENGER CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[680px] flex flex-col md:flex-row relative">
          
          {/* LEFT SIDEBAR: CONVERSATION LIST */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50",
            isMobileChatOpen ? "hidden md:flex" : "flex"
          )}>
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-slate-900 text-lg">Messenger</h2>
                </div>

                <button
                  onClick={() => setIsNewChatOpen(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" /> New Chat
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Conversation List Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              
              {/* SKELETON LOADING */}
              {loading && (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-11 h-11 bg-slate-200 rounded-2xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EMPTY STATE (Requirements 1, 6, 10: Zero fake chats) */}
              {!loading && conversations.length === 0 && (
                <div className="p-8 text-center my-auto">
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Your inbox is empty.</h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Start a new chat with someone from AMPRIORA.
                  </p>
                  <button
                    onClick={() => setIsNewChatOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> New Chat
                  </button>
                </div>
              )}

              {/* NO MATCHING FILTER RESULTS */}
              {!loading && conversations.length > 0 && filteredConversations.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs font-medium">
                  No conversations match "{searchQuery}".
                </div>
              )}

              {/* REAL CONVERSATIONS LIST */}
              {!loading && filteredConversations.map(conv => {
                const isActive = conv.id === activeConvId
                const lastMsg = conv.messages[conv.messages.length - 1]

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id)
                      setIsMobileChatOpen(true)
                    }}
                    className={cn(
                      "p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative",
                      isActive ? "bg-white border-l-4 border-indigo-600" : "hover:bg-slate-100/70"
                    )}
                  >
                    {/* Participant Avatar */}
                    <div 
                      onClick={e => {
                        e.stopPropagation()
                        navigateToProfile(conv.participantId)
                      }}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {conv.participantAvatar ? (
                        <img src={conv.participantAvatar} alt={conv.participantName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{conv.participantName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 
                          onClick={e => {
                            e.stopPropagation()
                            navigateToProfile(conv.participantId)
                          }}
                          className="font-bold text-slate-900 text-xs truncate hover:text-indigo-600 transition-colors"
                        >
                          {conv.participantName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {lastMsg ? (
                            new Date(lastMsg.timestamp).toString() !== 'Invalid Date'
                              ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : lastMsg.timestamp
                          ) : ''}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">
                        {conv.participantRole}
                      </p>

                      <p className={cn(
                        "text-xs truncate mt-1 font-normal",
                        conv.unreadCount > 0 ? "text-slate-900 font-semibold" : "text-slate-500"
                      )}>
                        {lastMsg ? (lastMsg.senderId === 'me' ? `You: ${lastMsg.text}` : lastMsg.text) : 'Started a conversation'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                )
              })}

            </div>
          </div>

          {/* RIGHT MAIN CHAT AREA */}
          <div className={cn(
            "flex-1 flex flex-col bg-white",
            isMobileChatOpen ? "flex" : "hidden md:flex"
          )}>
            
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMobileChatOpen(false)}
                      className="md:hidden text-slate-500 hover:text-slate-800 p-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div 
                      onClick={() => navigateToProfile(activeConversation.participantId)}
                      className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-xs hover:opacity-90 transition-opacity"
                    >
                      {activeConversation.participantAvatar ? (
                        <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{activeConversation.participantName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 
                          onClick={() => navigateToProfile(activeConversation.participantId)}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {activeConversation.participantName}
                        </h3>
                        {activeConversation.participantBadge && (
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px] border border-indigo-100">
                            {activeConversation.participantBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {activeConversation.participantRole} • {activeConversation.participantCompanyOrSchool}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToProfile(activeConversation.participantId)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" /> View Profile
                    </button>
                  </div>
                </div>

                {/* Message History Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                  
                  {activeConversation.messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'me'

                    return (
                      <div
                        key={msg.id || idx}
                        className={cn("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                      >
                        {!isMe && (
                          <div 
                            onClick={() => navigateToProfile(activeConversation.participantId)}
                            className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden cursor-pointer mt-1"
                          >
                            {activeConversation.participantAvatar ? (
                              <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{activeConversation.participantName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                        )}

                        <div>
                          <div className={cn(
                            "p-4 rounded-2xl text-xs font-normal leading-relaxed shadow-2xs whitespace-pre-wrap",
                            isMe 
                              ? "bg-indigo-600 text-white rounded-tr-xs" 
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                          )}>
                            {msg.text}
                          </div>

                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-medium",
                            isMe ? "justify-end" : "justify-start"
                          )}>
                            <span>
                              {msg.timestamp ? (
                                new Date(msg.timestamp).toString() !== 'Invalid Date'
                                  ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : msg.timestamp
                              ) : ''}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies Bar */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {QUICK_REPLY_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Input Controls Bar */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a message..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendMessage()
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isSending || !inputText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold p-3 rounded-2xl transition-colors shadow-sm shrink-0"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* NO ACTIVE CONVERSATION SELECTED EMPTY STATE */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Your inbox is empty.</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                  Start a new conversation with registered members on AMPRIORA.
                </p>
                <button
                  onClick={() => setIsNewChatOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Start New Chat
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* NEW CHAT SEARCH MODAL (Requirements 2, 3, 4) */}
      {isNewChatOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden space-y-4 p-6 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">New Conversation</h3>
              </div>
              <button
                onClick={() => setIsNewChatOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search people on AMPRIORA..."
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                autoFocus
              />
            </div>

            {/* Search Results List */}
            <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100">
              {isSearchingUsers && (
                <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Searching registered members...
                </div>
              )}

              {!isSearchingUsers && userSearchResults.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs font-bold text-slate-700 mb-1">No AMPRIORA users found.</p>
                  <p className="text-[11px] text-slate-400">Try searching for a different name or college.</p>
                </div>
              )}

              {!isSearchingUsers && userSearchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleStartConversationWithUser(user.id)}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors pt-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{user.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{user.title}</p>
                      <p className="text-[10px] text-slate-400">{user.college}</p>
                    </div>
                  </div>

                  <button
                    disabled={startingChatUserId === user.id}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors shadow-2xs flex items-center gap-1 shrink-0"
                  >
                    {startingChatUserId === user.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Chat</span>
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </DashboardShell>
  )
}

export default function MessengerPage() {
  return (
    <Suspense fallback={
      <DashboardShell>
        <div className="max-w-7xl mx-auto py-12 text-center text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">Loading Messenger...</p>
        </div>
      </DashboardShell>
    }>
      <MessengerContent />
    </Suspense>
  )
}
