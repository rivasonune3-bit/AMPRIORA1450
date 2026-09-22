import { resolveRequiredSkills } from '../data/roleRequirements';

export interface RoadmapSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  subtasks: RoadmapSubtask[];
}

export interface CareerState {
  targetRole: string;
  dreamCompany: string;
  currentSkills: string[];
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillCoverage: number; // 0 to 100 (matched required skills / total required skills * 100)
  careerReadiness: number; // 0 to 100 (weighted career readiness indicator)
  prioritySkillGap: string[];
  nextAction: {
    title: string;
    desc: string;
    link: string;
    actionType: string;
  };
  roadmapMilestones: RoadmapMilestone[];
  isRoadmapStale: boolean;
}

// Safely parses skill lists from string, array, or JSON
export function parseSkills(skillsInput: any): string[] {
  if (!skillsInput) return [];
  if (Array.isArray(skillsInput)) {
    return skillsInput.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof skillsInput === 'string') {
    return skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

// Compares candidate skills against target skills (case-insensitive)
export function includesSkill(userSkills: string[], targetSkill: string): boolean {
  const normTarget = targetSkill.trim().toLowerCase();
  return userSkills.some(s => s.trim().toLowerCase() === normTarget);
}

// Centralized Career Engine calculation driven exclusively by Profile SSoT
export function calculateCareerState(onboardingOrProfile: any): CareerState {
  const onboarding = onboardingOrProfile?.onboarding || onboardingOrProfile || {};

  const targetRole = (onboarding.targetRole || 'Software Engineer').trim();
  const dreamCompany = (onboarding.dreamCompany || 'Google').trim();
  const currentSkills = parseSkills(onboarding.skills);

  // Derive authoritative required skills for company + role
  const requiredSkills = resolveRequiredSkills(dreamCompany, targetRole);

  // Calculate matched vs missing skills
  const matchedSkills = requiredSkills.filter(req => includesSkill(currentSkills, req));
  const missingSkills = requiredSkills.filter(req => !includesSkill(currentSkills, req));

  // Transparent Skill Coverage formula: (matched required skills / total required skills) * 100
  const skillCoverage = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 100;

  // Weighted Overall Career Readiness
  const hasSummary = Boolean(onboarding.about || onboarding.summary || onboarding.resume);
  const hasEducation = Boolean(onboarding.education || onboarding.college || onboarding.branch);
  const hasProjects = Array.isArray(onboarding.projects) && onboarding.projects.length > 0;
  const hasExperience = Array.isArray(onboarding.experience) && onboarding.experience.length > 0;

  let readiness = Math.round((matchedSkills.length / Math.max(requiredSkills.length, 1)) * 50);
  if (hasSummary) readiness += 15;
  if (hasEducation) readiness += 15;
  if (hasProjects) readiness += 10;
  if (hasExperience) readiness += 10;

  const careerReadiness = Math.min(Math.max(readiness, 10), 100);
  const prioritySkillGap = missingSkills.slice(0, 5);

  // Dynamic Next Action based on missing skills or profile gaps
  let nextAction = {
    title: `Master ${missingSkills[0] || 'System Design'}`,
    desc: `Priority skill gap for ${dreamCompany} ${targetRole} track`,
    link: '/skill-gap',
    actionType: 'skill_gap'
  };

  if (missingSkills.length === 0) {
    nextAction = {
      title: `Apply to ${dreamCompany} ${targetRole}`,
      desc: 'You have matched 100% of required skills for this track!',
      link: '/job-recommendations',
      actionType: 'opportunity'
    };
  } else if (!hasProjects) {
    nextAction = {
      title: `Build a ${targetRole} Project`,
      desc: `Add a portfolio project utilizing ${missingSkills.slice(0, 2).join(', ')}`,
      link: '/projects',
      actionType: 'project'
    };
  }

  // Check if existing saved roadmap matches current targetRole and dreamCompany
  const savedRoadmap = onboarding.roadmap;
  const savedTarget = onboarding.roadmapTarget;
  const currentTargetKey = `${dreamCompany}:${targetRole}`;
  const isRoadmapStale = savedTarget ? savedTarget !== currentTargetKey : false;

  let roadmapMilestones: RoadmapMilestone[] = [];

  if (savedRoadmap && Array.isArray(savedRoadmap.milestones) && savedRoadmap.milestones.length > 0 && !isRoadmapStale) {
    roadmapMilestones = savedRoadmap.milestones;
  } else {
    // Generate fresh dynamic roadmap tailored to new target company, role, & missing skills
    roadmapMilestones = [
      {
        id: 'step-1',
        title: `Phase 1: Core Fundamentals for ${targetRole}`,
        status: matchedSkills.length > 0 ? 'completed' : 'in_progress',
        subtasks: [
          { id: 'sub-1-1', title: `Master foundational programming (${currentSkills.slice(0, 2).join(', ') || 'Python/Java'})`, completed: currentSkills.length > 0 },
          { id: 'sub-1-2', title: 'Data Structures & Algorithms practice', completed: includesSkill(currentSkills, 'Data Structures') || includesSkill(currentSkills, 'Algorithms') },
          { id: 'sub-1-3', title: 'Version control & Git workflow', completed: includesSkill(currentSkills, 'Git') }
        ]
      },
      {
        id: 'step-2',
        title: `Phase 2: Target Skill Mastery for ${dreamCompany}`,
        status: missingSkills.length > 2 ? 'in_progress' : 'pending',
        subtasks: missingSkills.slice(0, 3).map((skill, i) => ({
          id: `sub-2-${i+1}`,
          title: `Learn & complete practical exercises in ${skill}`,
          completed: false
        }))
      },
      {
        id: 'step-3',
        title: `Phase 3: Portfolio & ${targetRole} Capstone`,
        status: 'pending',
        subtasks: [
          { id: 'sub-3-1', title: `Build end-to-end ${targetRole} project for portfolio`, completed: hasProjects },
          { id: 'sub-3-2', title: `Optimize resume specifically for ${dreamCompany}`, completed: Boolean(onboarding.resumeAnalysis) },
          { id: 'sub-3-3', title: `Complete mock interview for ${targetRole} role`, completed: false }
        ]
      }
    ];
  }

  return {
    targetRole,
    dreamCompany,
    currentSkills,
    requiredSkills,
    matchedSkills,
    missingSkills,
    skillCoverage,
    careerReadiness,
    prioritySkillGap,
    nextAction,
    roadmapMilestones,
    isRoadmapStale
  };
}

// Dynamic opportunity match score calculation
export function calculateOpportunityMatch(userSkills: string[], oppSkills: string[]): number {
  if (!oppSkills || oppSkills.length === 0) return 75;
  if (!userSkills || userSkills.length === 0) return 40;

  const matched = oppSkills.filter(req => includesSkill(userSkills, req));
  const score = Math.round((matched.length / oppSkills.length) * 100);

  // Give base score of 50% so candidate sees relevant learning opportunities
  return Math.min(Math.max(score, 45), 98);
}
