"use client"

import { useState, useEffect } from 'react'
import DashboardShell from '../components/DashboardShell'
import FeatureBanner from '../components/FeatureBanner'
import {
  TerminalSquare,
  Trophy,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Code2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Award,
  Users,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Star,
  Layers,
  Send,
  X,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface Problem {
  id: string
  num: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Algorithms' | 'Data Structures' | 'Dynamic Programming' | 'Graphs & Trees' | 'System Design' | 'SQL' | 'Concurrency'
  acceptanceRate: string
  points: number
  status: 'solved' | 'attempted' | 'unsolved'
  companies: string[]
  description: string
  constraints: string[]
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  starterCode: {
    python: string
    typescript: string
    cpp: string
    java: string
  }
}

const mockProblems: Problem[] = []

export default function CodingChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'typescript' | 'cpp' | 'java'>('python')
  const [userCode, setUserCode] = useState<string>('')
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'error' | 'idle'
    message: string
    runtime?: string
    memory?: string
    testCasesPassed?: number
    testCasesTotal?: number
  }>({ status: 'idle', message: '' })
  const [copiedInput, setCopiedInput] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState('05h 42m 18s')
  const [activeTournamentJoined, setActiveTournamentJoined] = useState(false)

  useEffect(() => {
    // Simple timer simulation
    const interval = setInterval(() => {
      const d = new Date()
      const hours = 23 - d.getHours()
      const mins = 59 - d.getMinutes()
      const secs = 59 - d.getSeconds()
      setTimeLeft(
        `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const openArena = (problem: Problem) => {
    setActiveProblem(problem)
    setUserCode(problem.starterCode[selectedLanguage])
    setExecutionResult({ status: 'idle', message: '' })
  }

  const handleLanguageChange = (lang: 'python' | 'typescript' | 'cpp' | 'java') => {
    setSelectedLanguage(lang)
    if (activeProblem) {
      setUserCode(activeProblem.starterCode[lang])
    }
  }

  const runCode = () => {
    setExecuting(true)
    setExecutionResult({ status: 'idle', message: 'Running test cases...' })

    setTimeout(() => {
      setExecuting(false)
      setExecutionResult({
        status: 'success',
        message: 'All Sample Test Cases Passed!',
        runtime: '14 ms (Beats 94.2% of users)',
        memory: '16.8 MB (Beats 88.5% of users)',
        testCasesPassed: 3,
        testCasesTotal: 3
      })
    }, 900)
  }

  const submitCode = () => {
    setExecuting(true)
    setExecutionResult({ status: 'idle', message: 'Evaluating full test suite (50/50 testcases)...' })

    setTimeout(() => {
      setExecuting(false)
      setExecutionResult({
        status: 'success',
        message: '🎉 Accepted & Verified! +150 XP Awarded',
        runtime: '11 ms (Beats 98.6% of users)',
        memory: '15.4 MB (Beats 92.1% of users)',
        testCasesPassed: 50,
        testCasesTotal: 50
      })
    }, 1200)
  }

  const filteredProblems = mockProblems.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchDiff =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty

    const matchCat =
      selectedCategory === 'All' || p.category === selectedCategory

    const matchStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Solved' && p.status === 'solved') ||
      (selectedStatus === 'Attempted' && p.status === 'attempted') ||
      (selectedStatus === 'Unsolved' && p.status === 'unsolved')

    return matchSearch && matchDiff && matchCat && matchStatus
  })

  const getDifficultyBadge = (diff: Problem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200'
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Top Header */}
        <FeatureBanner
          title="Coding Challenges & Sprints"
          subtitle="Tackle daily algorithmic puzzles, live weekend tournaments, and interview speed trials."
          icon={TerminalSquare}
          bgPatternIcon={Code2}
        >
          {/* User Streak & Level Progress Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
              <Flame className="w-5 h-5 animate-pulse text-amber-200" />
              <div>
                <p className="text-[10px] text-amber-100 uppercase font-bold tracking-wider">Active Streak</p>
                <p className="text-sm font-extrabold">14 Days</p>
              </div>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md shadow-sm flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-200 font-semibold uppercase">Elo Rating</p>
                <p className="text-sm font-bold">1,840 <span className="text-xs text-indigo-300 font-medium">(Master)</span></p>
              </div>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md shadow-sm flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-200 font-semibold uppercase">Solved</p>
                <p className="text-sm font-bold">148 / 400</p>
              </div>
            </div>
          </div>
        </FeatureBanner>

        {/* Daily Challenge & Weekly Sprint Arena Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Problem Hero (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Problem of the Day
                  </span>
                  <span className="text-xs font-medium text-slate-400">#142</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resets in: {timeLeft}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Optimal Autonomous Rover Navigation
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                Compute the minimum total altitude-friction energy required to navigate Mars rover coordinates on an N x M grid using shortest path BFS/Dijkstra.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs mb-6">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
                  Medium
                </span>
                <span className="text-slate-400">Graphs & Pathfinding</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 font-semibold">+150 XP & "Daily Solver" Badge</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-4 h-4 text-sky-400" />
                <span>1,420 engineers solved today</span>
              </div>

              <button
                onClick={() => openArena(mockProblems[0])}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Daily Challenge</span>
              </button>
            </div>
          </div>

          {/* Weekly Sprint Tournament (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-base">Weekly Algorithmic Sprint 42</h3>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold rounded-full uppercase">
                  This Saturday
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                4 Problems · 90 Minutes · Global Real-Time Leaderboard · Sponsored by Top Silicon Valley & NYC Tech firms.
              </p>

              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Prize Pool</span>
                  <span className="font-bold text-emerald-600">$2,500 + Fast-Track Interviews</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Registered Coders</span>
                  <span className="font-bold text-slate-800">
                    {activeTournamentJoined ? '2,841 Coders (You are registered)' : '2,840 Coders'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Start Time</span>
                  <span className="font-bold text-slate-800">Saturday, 10:00 AM PST</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTournamentJoined(true)}
              className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                activeTournamentJoined
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              {activeTournamentJoined ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Registered for Sprint 42</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Register for Free</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems by name, topic, or target company (e.g. Stripe, Graphs, LRU)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Unsolved">Todo</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Algorithms', 'Dynamic Programming', 'Graphs & Trees', 'Data Structures', 'System Design', 'Concurrency'].map(
              cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Problems List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Problem Set</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
                {filteredProblems.length} Problems
              </span>
            </h3>
            <span className="text-xs text-slate-400">Updated Daily</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredProblems.map(p => {
              const diffBadge = getDifficultyBadge(p.difficulty)

              return (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="mt-1 sm:mt-0">
                      {p.status === 'solved' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : p.status === 'attempted' ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">#{p.num}</span>
                        <h4
                          onClick={() => openArena(p)}
                          className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {p.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${diffBadge}`}
                        >
                          {p.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>{p.category}</span>
                        <span>•</span>
                        <span>Acceptance: {p.acceptanceRate}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Asked by:</span>
                          {p.companies.map(c => (
                            <span
                              key={c}
                              className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      +{p.points} XP
                    </span>

                    <button
                      onClick={() => openArena(p)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Solve in Arena</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* In-Page Interactive Code Arena / Modal */}
        {activeProblem && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Arena Header Bar */}
              <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs">
                    #{activeProblem.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <span>{activeProblem.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${getDifficultyBadge(
                          activeProblem.difficulty
                        )}`}
                      >
                        {activeProblem.difficulty}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Selector */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                    {(['python', 'typescript', 'cpp', 'java'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`px-2.5 py-1 rounded-lg uppercase font-mono font-semibold text-[11px] transition ${
                          selectedLanguage === lang
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang === 'typescript' ? 'TS' : lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveProblem(null)}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arena Split Panels */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
                {/* Left Panel: Problem Statement & Examples (5 Cols) */}
                <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {activeProblem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Examples
                    </h4>
                    {activeProblem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 shadow-xs font-mono"
                      >
                        <p className="text-slate-500 font-sans font-bold">Example {i + 1}:</p>
                        <div className="text-slate-800">
                          <span className="text-indigo-600 font-bold">Input: </span>
                          <span>{ex.input}</span>
                        </div>
                        <div className="text-slate-800">
                          <span className="text-emerald-600 font-bold">Output: </span>
                          <span>{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <p className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-semibold text-slate-600">Explanation: </span>
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Constraints
                    </h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 font-mono">
                      {activeProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Panel: Code Editor & Execution Console (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col h-full bg-slate-900 text-white min-h-0">
                  {/* Editor Top Bar */}
                  <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono">solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'typescript' ? 'ts' : selectedLanguage === 'cpp' ? 'cpp' : 'java'}</span>
                    <button
                      onClick={() => setUserCode(activeProblem.starterCode[selectedLanguage])}
                      className="hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Code</span>
                    </button>
                  </div>

                  {/* Code Editor Mockup Area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-sm leading-relaxed text-slate-200">
                    <textarea
                      value={userCode}
                      onChange={e => setUserCode(e.target.value)}
                      rows={14}
                      className="w-full h-full bg-transparent text-indigo-200 font-mono text-xs sm:text-sm focus:outline-none resize-none selection:bg-indigo-600"
                      spellCheck={false}
                    />
                  </div>

                  {/* Execution Console Output */}
                  {executionResult.status !== 'idle' || executing ? (
                    <div className="p-4 bg-slate-900 border-t border-slate-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">
                          Console Output
                        </span>
                        {executionResult.runtime && (
                          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                            <span>⚡ {executionResult.runtime}</span>
                            <span>💾 {executionResult.memory}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                        {executing ? (
                          <div className="flex items-center gap-2 text-amber-400">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{executionResult.message}</span>
                          </div>
                        ) : (
                          <div className="text-emerald-400 font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{executionResult.message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Editor Bottom Actions */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={runCode}
                      disabled={executing}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center gap-2 border border-slate-700"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-300" />
                      <span>Run Test Cases</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={submitCode}
                        disabled={executing}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Solution</span>
                      </button>
                    </div>
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
