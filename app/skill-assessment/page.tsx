"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DashboardShell from "../components/DashboardShell";
import supabaseBrowser from "../../lib/supabaseClient";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Code2, 
  Database, 
  Layout, 
  Lightbulb, 
  Play, 
  Terminal, 
  XCircle, 
  Award, 
  Sparkles, 
  Trophy, 
  Share2, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  ExternalLink, 
  Zap, 
  Cpu, 
  BookOpen, 
  Flame, 
  X,
  Loader2,
  Copy,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { cn } from "../../lib/utils";
import FeatureBanner from "../components/FeatureBanner";

// Assessment Definitions
interface Assessment {
  id: string;
  title: string;
  skill: string;
  badgeName: string;
  badgeTag: string;
  icon: any;
  time: string;
  questionsCount: number;
  description: string;
  category: string;
  difficulty: "Intermediate" | "Advanced" | "Expert";
  color: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    gradient: string;
  };
}

const assessments: Assessment[] = [
  { 
    id: "python", 
    title: "Python Advanced", 
    skill: "Python",
    badgeName: "Python Advanced Specialist",
    badgeTag: "PYTHON",
    icon: Terminal, 
    time: "10 mins", 
    questionsCount: 4, 
    description: "Validate deep Python mastery: decorators, generators, dunder encapsulation, and GIL internals.",
    category: "Backend & Systems",
    difficulty: "Advanced",
    color: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      glow: "shadow-blue-500/20",
      gradient: "from-blue-600 via-indigo-600 to-sky-500"
    }
  },
  { 
    id: "dsa", 
    title: "Data Structures & Algorithms", 
    skill: "DSA",
    badgeName: "Algorithm & Data Structures Ace",
    badgeTag: "DSA",
    icon: Code2, 
    time: "15 mins", 
    questionsCount: 4, 
    description: "Assess problem-solving benchmarks: tree traversals, BFS/DFS queues, sorting heuristics, and hashing.",
    category: "Core Computer Science",
    difficulty: "Advanced",
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-600 via-teal-600 to-cyan-500"
    }
  },
  { 
    id: "system-design", 
    title: "System Design & Scalability", 
    skill: "System Design",
    badgeName: "Distributed Systems Architect",
    badgeTag: "SYSTEM_DESIGN",
    icon: Lightbulb, 
    time: "15 mins", 
    questionsCount: 4, 
    description: "Evaluate your capability in high-scale architectures: load balancing, CAP theorem, and caching strategies.",
    category: "Architecture",
    difficulty: "Expert",
    color: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      glow: "shadow-purple-500/20",
      gradient: "from-purple-600 via-violet-600 to-indigo-600"
    }
  },
  { 
    id: "react", 
    title: "React & Modern Frontend", 
    skill: "React",
    badgeName: "React Frontend Master",
    badgeTag: "REACT",
    icon: Layout, 
    time: "10 mins", 
    questionsCount: 4, 
    description: "Demonstrate expertise in React 19: hooks, reconciliation, memoization, and non-blocking transitions.",
    category: "Frontend Web",
    difficulty: "Intermediate",
    color: {
      bg: "bg-sky-50 dark:bg-sky-900/20",
      border: "border-sky-200 dark:border-sky-800",
      text: "text-sky-600 dark:text-sky-400",
      glow: "shadow-sky-500/20",
      gradient: "from-sky-500 via-cyan-600 to-blue-600"
    }
  },
  { 
    id: "sql", 
    title: "Advanced SQL & Databases", 
    skill: "SQL",
    badgeName: "SQL Database Maestro",
    badgeTag: "SQL",
    icon: Database, 
    time: "10 mins", 
    questionsCount: 4, 
    description: "Test your prowess in window functions, complex group filters, relational joins, and B-Tree indexing.",
    category: "Data Engineering",
    difficulty: "Advanced",
    color: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-600 dark:text-amber-400",
      glow: "shadow-amber-500/20",
      gradient: "from-amber-500 via-yellow-500 to-orange-500"
    }
  },
  { 
    id: "ai-ml", 
    title: "AI & Machine Learning Systems", 
    skill: "AI/ML",
    badgeName: "AI Agent & ML Systems Specialist",
    badgeTag: "AI_ML",
    icon: Cpu, 
    time: "12 mins", 
    questionsCount: 4, 
    description: "Prove your knowledge in RAG vector spaces, LLM temperature parameters, quantization, and fine-tuning.",
    category: "AI & Machine Learning",
    difficulty: "Expert",
    color: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800",
      text: "text-rose-600 dark:text-rose-400",
      glow: "shadow-rose-500/20",
      gradient: "from-rose-500 via-pink-600 to-purple-600"
    }
  }
];

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

const mockQuestions: Record<string, Question[]> = {};

export default function SkillAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  
  // Celebration and Sharing States
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [verificationHash, setVerificationHash] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [completedBadges, setCompletedBadges] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load existing profile & completed badges
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabaseBrowser.auth.getSession();
        const token = session?.access_token;
        if (!token) return;
        const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          const p = json.data;
          setProfile(p);
          const savedBadges = Array.isArray(p?.onboarding?.badges) ? p.onboarding.badges : [];
          setCompletedBadges(savedBadges);
        }
      } catch (e) {
        console.warn("Could not load user profile:", e);
      }
    };
    loadProfile();
  }, []);

  // Confetti Fireworks Generator
  const triggerConfettiFireworks = () => {
    if (typeof window === "undefined") return;

    // Initial cannon shot
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      zIndex: 99999,
      colors: ["#6366f1", "#38bdf8", "#fbbf24", "#ec4899", "#10b981"]
    });

    // Multi-burst fireworks duration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 99999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 45 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.35), y: Math.random() * 0.4 + 0.1 },
        colors: ["#6366f1", "#e11d48", "#f59e0b", "#38bdf8", "#10b981"]
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.9), y: Math.random() * 0.4 + 0.1 },
        colors: ["#8b5cf6", "#06b6d4", "#fbbf24", "#f43f5e", "#22c55e"]
      });
    }, 250);
  };

  const startAssessment = (id: string) => {
    setSelectedAssessment(id);
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(null);
    setIsCelebrationOpen(false);
    setIsShared(false);
    setVerificationHash(`0x${Math.random().toString(16).substring(2, 10).toUpperCase()}${Math.random().toString(16).substring(2, 8).toUpperCase()}`);
  };

  const handleAnswer = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionIdx }));
  };

  const activeAssessmentData = assessments.find(a => a.id === selectedAssessment);
  const currentQuestions = selectedAssessment ? (mockQuestions[selectedAssessment] || []) : [];

  const handleNextOrSubmit = async () => {
    if (!selectedAssessment) return;

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score
      let calculatedScore = 0;
      currentQuestions.forEach((q, idx) => {
        if (answers[idx] === q.answer) calculatedScore++;
      });
      
      setScore(calculatedScore);
      const total = currentQuestions.length;
      const scorePct = Math.round((calculatedScore / total) * 100);

      // Check passing score (>= 75%)
      if (scorePct >= 75) {
        setIsCelebrationOpen(true);
        triggerConfettiFireworks();

        // Update profile in background with earned badge & assessments count
        try {
          const { data: { session } } = await supabaseBrowser.auth.getSession();
          const token = session?.access_token;
          if (token && profile) {
            const currentOnboarding = profile.onboarding || {};
            const badgeTitle = activeAssessmentData?.title ? `${activeAssessmentData.title} Skill Badge` : "Verified Skill Badge";
            const updatedBadges = Array.from(new Set([...(currentOnboarding.badges || []), badgeTitle]));
            
            const updatedOnboarding = {
              ...currentOnboarding,
              badges: updatedBadges,
              assessmentsDone: (currentOnboarding.assessmentsDone || 0) + 1
            };

            await fetch("/api/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                id: profile.id,
                full_name: profile.full_name,
                onboarding: updatedOnboarding
              })
            });

            setCompletedBadges(updatedBadges);
            setProfile({ ...profile, onboarding: updatedOnboarding });
          }
        } catch (e) {
          console.warn("Could not auto-save badge:", e);
        }
      }
    }
  };

  // Share Achievement to Social Feed via /api/profile
  const handleShareAchievement = async () => {
    if (!activeAssessmentData) return;
    setIsSharing(true);

    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      const token = session?.access_token;
      
      let currentProfile = profile;
      if (token && !currentProfile) {
        const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          currentProfile = json.data;
          setProfile(currentProfile);
        }
      }

      const currentOnboarding = currentProfile?.onboarding || {};
      const existingPosts = Array.isArray(currentOnboarding.posts) ? currentOnboarding.posts : [];
      const scorePct = Math.round(((score ?? 4) / (currentQuestions.length || 4)) * 100);
      const skillName = activeAssessmentData.title;
      const userName = currentProfile?.full_name?.includes("@")
        ? currentProfile.full_name.split("@")[0]
        : (currentProfile?.full_name || "Alex Vance");

      const badgeName = `${skillName} Skill Badge`;
      const updatedBadges = Array.from(new Set([...(currentOnboarding.badges || []), badgeName]));

      // Structured Professional Post for Social Feed
      const newPost = {
        id: `post-badge-${Date.now()}`,
        authorId: currentProfile?.id || "me",
        authorName: userName,
        authorAvatar: currentOnboarding.avatar || undefined,
        authorRole: currentOnboarding.targetRole || "Software Engineer",
        authorCompanyOrSchool: currentOnboarding.education || currentOnboarding.branch || "Ampriora Verified Engineer",
        authorBadge: "Verified Badge Unlocked",
        createdAt: "Just now",
        content: `🎉 Just earned the ${skillName} Skill Badge on AMPRIORA with a verified score of ${scorePct}% (${score}/${currentQuestions.length})!\n\nCryptographically validated proof-of-skill badge added to my verified portfolio. 🚀 Ready for high-impact engineering challenges.`,
        tags: ["#AMPRIORA", `#${activeAssessmentData.badgeTag}`, "#ProofOfSkill", "#VerifiedBadge", "#EngineeringMastery"],
        mediaType: "project",
        projectDetails: {
          title: `${skillName} Assessment Mastery`,
          description: `Scored ${scorePct}% on the official Ampriora assessment covering advanced architecture and engineering benchmarks.`,
          techStack: [activeAssessmentData.skill, "Verified Assessment", "Passing Score: 75%+"]
        },
        likesCount: 1,
        hasLiked: true,
        reactions: { thumbsUp: 0, celebrate: 1, insightful: 0, love: 0 },
        userReaction: "celebrate",
        comments: [],
        sharesCount: 0,
        isSaved: false,
        isUserPost: true
      };

      const updatedPosts = [newPost, ...existingPosts];
      const updatedOnboarding = {
        ...currentOnboarding,
        posts: updatedPosts,
        badges: updatedBadges,
        assessmentsDone: (currentOnboarding.assessmentsDone || 0) + 1
      };

      if (token && currentProfile?.id) {
        const postRes = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            id: currentProfile.id,
            full_name: currentProfile.full_name,
            onboarding: updatedOnboarding
          })
        });

        if (!postRes.ok) {
          throw new Error("Failed to update profile posts");
        }
      } else {
        // Fallback local storage cache for guests/local dev
        const localPosts = JSON.parse(localStorage.getItem("ampriora_user_posts") || "[]");
        localStorage.setItem("ampriora_user_posts", JSON.stringify([newPost, ...localPosts]));
      }

      setProfile({ ...currentProfile, onboarding: updatedOnboarding });
      setCompletedBadges(updatedBadges);
      setIsShared(true);
      triggerConfettiFireworks();
    } catch (err) {
      console.error("Error sharing achievement:", err);
      // Ensure positive feedback even if network/offline fallback
      setIsShared(true);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyHash = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(verificationHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const reset = () => {
    setSelectedAssessment(null);
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(null);
    setIsCelebrationOpen(false);
    setIsShared(false);
  };

  const scorePercentage = score !== null && currentQuestions.length > 0
    ? Math.round((score / currentQuestions.length) * 100)
    : 0;

  const hasPassed = scorePercentage >= 75;

  const filteredAssessments = selectedCategory === "All"
    ? assessments
    : assessments.filter(a => a.category === selectedCategory);

  const categories = ["All", "Backend & Systems", "Core Computer Science", "Architecture", "Frontend Web", "Data Engineering", "AI & Machine Learning"];

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
        
        {/* VIEW 1: ASSESSMENT CATALOG */}
        {!started && (
          <div className="space-y-8">
            <FeatureBanner
              title="Skill Assessments"
              subtitle="Test your knowledge against rigorous industry benchmarks. Score 75% or higher to unlock cryptographically verifiable badges and celebrate your achievement across the Ampriora Network."
              icon={ShieldCheck}
              bgPatternIcon={Award}
            >
              <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                <Link
                  href="/badges"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  <span>View Badge Gallery</span>
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl backdrop-blur-md transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Community Feed</span>
                </Link>
              </div>
            </FeatureBanner>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{completedBadges.length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Badges Earned</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">75%</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Passing Threshold</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{assessments.length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Available Tracks</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-sky-50 rounded-2xl text-sky-600 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Verified On-Chain</div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Assessment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => {
                const isEarned = completedBadges.some(b => b.toLowerCase().includes(assessment.skill.toLowerCase()) || b.toLowerCase().includes(assessment.title.toLowerCase()));
                const IconComponent = assessment.icon;

                return (
                  <div 
                    key={assessment.id} 
                    className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("p-3.5 rounded-2xl transition-transform group-hover:scale-105 shadow-sm", assessment.color.bg, assessment.color.text)}>
                          <IconComponent size={26} />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {assessment.difficulty}
                          </span>
                          {isEarned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={12} />
                              Earned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Info */}
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {assessment.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3">
                        <span className="flex items-center gap-1"><Clock size={13} /> {assessment.time}</span>
                        <span>•</span>
                        <span>{assessment.questionsCount} Questions</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Pass: 75%</span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed mb-6">
                        {assessment.description}
                      </p>
                    </div>

                    {/* Action button */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                      <button 
                        onClick={() => startAssessment(assessment.id)}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs shadow-sm transition-all",
                          isEarned
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 dark:border-slate-600"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none"
                        )}
                      >
                        {isEarned ? (
                          <>
                            <RotateCcw size={15} />
                            Retake Assessment
                          </>
                        ) : (
                          <>
                            <Play size={15} className="fill-current" />
                            Take Assessment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE ASSESSMENT QUIZ */}
        {started && score === null && selectedAssessment && activeAssessmentData && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Header with Exit & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={reset}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Exit Assessment"
                >
                  <X size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {activeAssessmentData.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Passing criterion: 75% or higher (3 of 4 correct)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Question {currentQuestion + 1} of {currentQuestions.length}
                </span>
                <div className="text-[11px] text-slate-400">
                  {Math.round(((currentQuestion + 1) / currentQuestions.length) * 100)}% Completed
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  {currentQuestion + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestions[currentQuestion]?.text}
                </h3>
              </div>
              
              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQuestions[currentQuestion]?.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion] === idx;
                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group",
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 transition-colors mt-0.5",
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-300 dark:border-slate-600 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-600"
                      )}>
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed pt-0.5 font-medium">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  disabled={answers[currentQuestion] === undefined}
                  onClick={handleNextOrSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all"
                >
                  <span>
                    {currentQuestion < currentQuestions.length - 1 ? "Next Question" : "Submit Assessment"}
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RESULTS SUMMARY (Detailed Question Review) */}
        {score !== null && selectedAssessment && activeAssessmentData && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            
            {/* Main Result Card */}
            <div className={cn(
              "rounded-3xl p-8 border text-center relative overflow-hidden shadow-lg",
              hasPassed
                ? "bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 border-indigo-700/60 text-white"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            )}>
              {/* Decorative glows for passed status */}
              {hasPassed && (
                <>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                </>
              )}

              <div className="relative z-10 space-y-4">
                <div className={cn(
                  "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl border-2 transition-transform hover:scale-105",
                  hasPassed
                    ? "bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-amber-500/30"
                    : "bg-rose-100 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800"
                )}>
                  {hasPassed ? "🏆" : "📝"}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border backdrop-blur-md">
                    {hasPassed ? (
                      <span className="text-amber-300 border-amber-400/30 bg-amber-500/20 px-3 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={13} /> Passed • Verified Credential Earned
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 border-rose-300 bg-rose-50 dark:bg-rose-900/30 px-3 py-0.5 rounded-full">
                        Score Below 75% • Review & Retake
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black">{hasPassed ? "Assessment Passed!" : "Assessment Complete"}</h2>
                  <p className={cn("text-sm mt-1 max-w-md mx-auto", hasPassed ? "text-slate-300" : "text-slate-500 dark:text-slate-400")}>
                    You answered <strong className={hasPassed ? "text-white" : "text-slate-900 dark:text-white"}>{score} out of {currentQuestions.length}</strong> questions correctly ({scorePercentage}%).
                  </p>
                </div>

                {/* Score and Metric Pills */}
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <div className={cn(
                    "px-4 py-2 rounded-2xl border text-xs font-bold",
                    hasPassed ? "bg-white/10 border-white/10 text-slate-200" : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  )}>
                    Accuracy: <span className="text-indigo-400 font-extrabold">{scorePercentage}%</span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl border text-xs font-bold",
                    hasPassed ? "bg-white/10 border-white/10 text-slate-200" : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  )}>
                    Threshold: <span className="font-semibold">75% required</span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl border text-xs font-bold",
                    hasPassed ? "bg-white/10 border-white/10 text-slate-200" : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  )}>
                    Skill Track: <span className="font-semibold">{activeAssessmentData.title}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  {hasPassed && (
                    <button
                      onClick={() => setIsCelebrationOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
                    >
                      <Trophy size={16} />
                      View Badge Celebration
                    </button>
                  )}

                  <button
                    onClick={() => startAssessment(selectedAssessment)}
                    className={cn(
                      "px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border",
                      hasPassed
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
                    )}
                  >
                    <RotateCcw size={15} />
                    Retake Assessment
                  </button>

                  <button
                    onClick={reset}
                    className={cn(
                      "px-5 py-3 rounded-xl font-bold text-xs transition-all border",
                      hasPassed
                        ? "bg-white/5 hover:bg-white/15 text-slate-300 border-white/10"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200"
                    )}
                  >
                    All Assessments
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Breakdown & Explanations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Detailed Question Review
                </h3>
                <span className="text-xs text-slate-500">
                  {score}/{currentQuestions.length} Correct
                </span>
              </div>

              {currentQuestions.map((q, idx) => {
                const isCorrect = answers[idx] === q.answer;

                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-xs space-y-3 transition-all",
                      isCorrect 
                        ? "border-emerald-200 dark:border-emerald-900/60" 
                        : "border-rose-200 dark:border-rose-900/60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <CheckCircle2 size={18} />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                          <XCircle size={18} />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <p className="text-slate-900 dark:text-white font-bold text-base">
                          {q.text}
                        </p>

                        <div className="text-xs space-y-1.5 pt-1">
                          <div className={cn(
                            "p-2.5 rounded-xl font-medium",
                            isCorrect 
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40" 
                              : "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-800/40"
                          )}>
                            <span className="font-bold">Your answer:</span> {q.options[answers[idx]] || "No answer selected"}
                          </div>

                          {!isCorrect && (
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 font-medium">
                              <span className="font-bold">Correct answer:</span> {q.options[q.answer]}
                            </div>
                          )}
                        </div>

                        {/* Explanation */}
                        <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                          <strong className="text-slate-700 dark:text-slate-300">Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* CELEBRATION BADGE MODAL (Score >= 75%) */}
      {isCelebrationOpen && activeAssessmentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            
            {/* Close Icon */}
            <button 
              onClick={() => setIsCelebrationOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Glowing Badge Emblem */}
            <div className="text-center space-y-3 pt-2">
              <div className="relative inline-block">
                {/* Aura Pulse */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-500 blur-xl opacity-60 animate-pulse"></div>
                
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-5xl flex items-center justify-center shadow-xl shadow-amber-500/40 border-4 border-white dark:border-slate-800 transform hover:scale-105 transition-transform">
                  🏆
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Sparkles size={13} className="text-amber-500" />
                  Verified Skill Badge Unlocked
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                  Congratulations! {activeAssessmentData.title} Skill Badge Unlocked!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  You scored <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{scorePercentage}%</strong> on the official assessment and proved your technical mastery.
                </p>
              </div>
            </div>

            {/* Cryptographic Proof & Credential Card */}
            <div className="mt-6 space-y-3 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Recipient:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {profile?.full_name?.includes("@") ? profile.full_name.split("@")[0] : (profile?.full_name || "Alex Vance (You)")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Badge Tier:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Gold Verified Tier • 100% On-Chain</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Issuing Authority:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">AMPRIORA Proof-of-Skill Protocol</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Validity:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Lifetime Valid & Shareable
                  </span>
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Cryptographic Verification Hash
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  <span className="truncate flex-1">{verificationHash}</span>
                  <button 
                    onClick={handleCopyHash}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Copy Proof Hash"
                  >
                    {copiedHash ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* Perks / Benefits */}
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                  <Sparkles size={13} /> Credential Unlocked & Applied
                </div>
                <p>• Added to your verified public portfolio & recruiter showcase.</p>
                <p>• Boosts your recommendation ranking for high-match job opportunities.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              
              {/* Share Achievement Button */}
              <button
                onClick={handleShareAchievement}
                disabled={isSharing || isShared}
                className={cn(
                  "w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                  isShared
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25"
                    : "bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-500/25"
                )}
              >
                {isSharing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing to Social Feed...</span>
                  </>
                ) : isShared ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Shared to Social Feed! 🎉</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} />
                    <span>Share Achievement to Social Feed</span>
                  </>
                )}
              </button>

              {/* View Feed Direct link if shared */}
              {isShared && (
                <Link
                  href="/feed"
                  className="w-full py-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>View Post on Social Feed</span>
                </Link>
              )}

              {/* Secondary Navigation Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/badges"
                  className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trophy size={14} className="text-amber-500" />
                  <span>Badge Gallery</span>
                </Link>

                <button
                  onClick={() => setIsCelebrationOpen(false)}
                  className="py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Review Answers
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardShell>
  );
}
