/**
 * AMPRIORA Centralized Feature Flags & Navigation Configuration
 * 
 * Controls main navigation visibility for MVP vs Phase-2 / Advanced features.
 * All Phase-2 routes remain active and accessible directly via URL during development.
 */

export interface FeatureFlags {
  // Locked MVP Primary Navigation Categories
  dashboard: boolean
  profile: boolean
  opportunities: boolean
  career: boolean
  learning: boolean
  community: boolean
  smartPortfolio: boolean
  digitalId: boolean

  // Phase-2 Sidebar Toggle (Default: false to keep MVP navigation clean & compact)
  showPhase2InSidebar: boolean

  // Individual Phase-2 Feature Flags (accessible inside parent features or via direct URL)
  jobRecommendations: boolean
  skillGapAnalysis: boolean
  resumeAnalyzer: boolean
  badges: boolean
  scholarships: boolean
  nearbyOpportunities: boolean
  codingChallenges: boolean
  alumniConnect: boolean
  localCommunity: boolean
  studyGroups: boolean
  networking: boolean
  freelance: boolean
  startupHub: boolean
  hackathonTeamBuilding: boolean
  interviewExperiences: boolean
  aiCoach: boolean
  mentorDashboard: boolean
  recruiterDashboard: boolean
  myCourses: boolean
  certificates: boolean
  applicationsTracker: boolean
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Locked MVP Primary Features
  dashboard: true,
  profile: true,
  opportunities: true,
  career: true,
  learning: true,
  community: true,
  smartPortfolio: true,
  digitalId: true,

  // Phase-2 Sidebar Toggle
  showPhase2InSidebar: false,

  // Sub-features / Phase-2 routes
  jobRecommendations: false,
  skillGapAnalysis: false,
  resumeAnalyzer: false,
  badges: false,
  scholarships: false,
  nearbyOpportunities: false,
  codingChallenges: false,
  alumniConnect: false,
  localCommunity: false,
  studyGroups: false,
  networking: false,
  freelance: false,
  startupHub: false,
  hackathonTeamBuilding: false,
  interviewExperiences: false,
  aiCoach: false,
  mentorDashboard: false,
  recruiterDashboard: false,
  myCourses: false,
  certificates: false,
  applicationsTracker: false,
}

export function getFeatureFlags(): FeatureFlags {
  return DEFAULT_FEATURE_FLAGS
}
