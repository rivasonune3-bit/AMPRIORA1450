import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const comprehensiveAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Overall Resume Quality Score from 0 to 100 based on realistic ATS & recruiter evaluation." },
    atsCompatibilityScore: { type: Type.INTEGER, description: "ATS Format & Parsing Score from 0 to 100." },
    contentQualityScore: { type: Type.INTEGER, description: "Content & Action-Verb Quality Score from 0 to 100." },
    skillsMatchScore: { type: Type.INTEGER, description: "Skills alignment score." },
    experienceQualityScore: { type: Type.INTEGER, description: "Experience & achievement clarity score." },
    projectQualityScore: { type: Type.INTEGER, description: "Project description & technology detail score." },
    
    // Strengths & Missing
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific strong points in the candidate's actual resume." },
    missingSections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Missing critical sections if any." },
    atsWarnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "ATS formatting warnings (e.g. font, tables, headers, dates)." },
    
    // Section by Section Breakdown
    sectionAnalysis: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Good, Weak, or Missing" },
            feedback: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING }
          }
        },
        skills: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING }
          }
        },
        experience: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING }
          }
        },
        projects: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING }
          }
        },
        education: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING }
          }
        }
      }
    },

    // Job Description Match Analysis (if JD provided)
    jobMatchAnalysis: {
      type: Type.OBJECT,
      properties: {
        matchPercentage: { type: Type.INTEGER },
        matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        relevantProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },

    actionableSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          issue: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          actionableSnippet: { type: Type.STRING }
        }
      },
      description: "Actionable itemized corrections with clean student-friendly guidance."
    }
  },
  required: ["overallScore", "atsCompatibilityScore", "strengths", "missingSections", "sectionAnalysis", "actionableSuggestions"]
};

// Safe Regex Escape Helper: Escapes all special regex characters (e.g. +, #, ., $, ^, *, ?, (, ), [, ])
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Universal keyword matcher that safely handles C++, C#, .NET, Node.js without RegExp SyntaxErrors
function includesKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const escaped = escapeRegExp(keyword);
  const startBoundary = /^\w/.test(keyword) ? '\\b' : '';
  const endBoundary = /\w$/.test(keyword) ? '\\b' : '';
  try {
    const regex = new RegExp(`${startBoundary}${escaped}${endBoundary}`, 'i');
    return regex.test(text);
  } catch (e) {
    return text.toLowerCase().includes(keyword.toLowerCase());
  }
}

// Formats JSON objects or stringified JSON into clean plain text for resume analysis
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

// Sanitizes output strings to guarantee no internal code or prompt terms appear in candidate output
function sanitizeOutput(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return obj
      .replace(/json schema/gi, 'formatting structure')
      .replace(/payload/gi, 'resume content')
      .replace(/system prompt/gi, 'evaluation guidelines')
      .replace(/validation/gi, 'review')
      .replace(/parser instructions/gi, 'parsing guidelines')
      .replace(/metadata/gi, 'details');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeOutput);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = sanitizeOutput(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

// Deterministic Truth-First Fallback Analysis (Runs if Gemini quota is exhausted or offline)
function fallbackTruthAnalysis(text: string, targetRole?: string, jobDescription?: string) {
  if (!text || typeof text !== 'string') text = '';

  const commonSkills = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'C++', 'C#', '.NET', 'Java', 'SQL', 'HTML', 'CSS', 'Tailwind', 'Git', 'Machine Learning', 'Docker', 'AWS', 'PyTorch', 'Next.js', 'PostgreSQL', 'MongoDB', 'Kubernetes', 'GraphQL', 'REST API', 'Flutter', 'Go', 'Rust'];
  const extractedSkills = commonSkills.filter(s => includesKeyword(text, s));

  const hasSummary = /summary|overview|profile|about/i.test(text) || text.length > 200;
  const hasExperience = /experience|work|employment|intern/i.test(text);
  const hasProjects = /project|built|developed|repository/i.test(text);
  const hasEducation = /education|university|college|bachelor|degree|b\.tech|bs|master/i.test(text);

  const missing: string[] = [];
  if (!hasSummary) missing.push('Professional Summary');
  if (!hasExperience) missing.push('Work / Internship Experience');
  if (!hasProjects) missing.push('Key Projects');
  if (!hasEducation) missing.push('Education Credentials');

  let score = 70;
  if (extractedSkills.length > 4) score += 10;
  if (hasExperience) score += 10;
  if (hasProjects) score += 10;
  if (missing.length > 2) score -= 15;

  const matchedJdSkills: string[] = [];
  const missingJdSkills: string[] = [];
  if (jobDescription) {
    commonSkills.forEach(s => {
      if (includesKeyword(jobDescription, s)) {
        if (extractedSkills.includes(s)) matchedJdSkills.push(s);
        else missingJdSkills.push(s);
      }
    });
  }

  return {
    overallScore: Math.min(Math.max(score, 50), 95),
    atsCompatibilityScore: hasSummary && hasEducation ? 85 : 65,
    contentQualityScore: extractedSkills.length > 3 ? 80 : 60,
    skillsMatchScore: extractedSkills.length * 10,
    experienceQualityScore: hasExperience ? 80 : 50,
    projectQualityScore: hasProjects ? 85 : 50,

    strengths: [
      extractedSkills.length > 0 ? `Identified ${extractedSkills.length} technical skills (${extractedSkills.slice(0, 5).join(', ')})` : 'Clear text structure',
      hasEducation ? 'Clear education section present' : 'Standard contact info formatting',
      hasProjects ? 'Project portfolio included' : 'Clean layout formatting'
    ],
    missingSections: missing,
    atsWarnings: [
      missing.length > 0 ? `Missing key section(s): ${missing.join(', ')}` : 'Ensure standard font and headings are used throughout',
      'Use action verbs (e.g. Developed, Built, Led) at the start of each bullet point'
    ],

    sectionAnalysis: {
      summary: {
        status: hasSummary ? 'Good' : 'Missing',
        feedback: hasSummary ? 'Summary is present. Ensure it includes target role and key technical strengths.' : 'Add a 2-3 sentence Professional Summary at the top of your resume.',
        suggestedImprovement: 'Highlight your target role, years of project experience, and primary tech stack.'
      },
      skills: {
        status: extractedSkills.length > 3 ? 'Good' : 'Weak',
        feedback: `Found ${extractedSkills.length} technical skills in text.`,
        suggestedImprovement: 'Organize skills into categories (Languages, Frameworks, Tools).'
      },
      experience: {
        status: hasExperience ? 'Good' : 'Weak',
        feedback: hasExperience ? 'Experience section detected.' : 'No clear work or internship experience section found.',
        suggestedImprovement: 'Format work bullets as Action Verb + Task + Tool + Measured Outcome.'
      },
      projects: {
        status: hasProjects ? 'Good' : 'Weak',
        feedback: hasProjects ? 'Projects section detected.' : 'Add 2-3 technical projects with live links or GitHub repos.',
        suggestedImprovement: 'Include project title, tech stack used, and live demo link.'
      },
      education: {
        status: hasEducation ? 'Good' : 'Missing',
        feedback: hasEducation ? 'Education section detected.' : 'Add degree, institution, and completion year.',
        suggestedImprovement: 'List degree, university, major, and graduation year clearly.'
      }
    },

    jobMatchAnalysis: jobDescription ? {
      matchPercentage: Math.round((matchedJdSkills.length / Math.max(matchedJdSkills.length + missingJdSkills.length, 1)) * 100) || 75,
      matchedKeywords: matchedJdSkills,
      missingKeywords: missingJdSkills,
      relevantProjects: hasProjects ? ['Identified relevant project section'] : [],
      recommendations: missingJdSkills.map(s => `Consider learning or building a project with ${s} to match the target JD.`)
    } : null,

    actionableSuggestions: [
      {
        category: 'Formatting',
        issue: 'ATS Keyword Density',
        recommendation: 'Ensure your technical skills are listed as plain text without complex tables or graphics.',
        actionableSnippet: extractedSkills.join(', ')
      },
      {
        category: 'Content',
        issue: 'Bullet Structure',
        recommendation: 'Start bullet points with strong action verbs like Developed, Engineered, or Designed.',
        actionableSnippet: 'Developed responsive web application using React with modular component architecture.'
      }
    ]
  };
}

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) throw new Error('Supabase server config missing');
  return createClient(supabaseUrl, serviceRole);
};

const getUserFromAuthHeader = async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim();
  if (!token) return null;
  const anonClient = createClient(supabaseUrl, anonKey);
  try {
    const { data, error } = await anonClient.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch (e) {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req);
    if (!caller) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { resumeText, fileBase64, mimeType, targetRole, targetCompany, jobDescription } = body;

    const supabase = getSupabaseServerClient();
    const { data: existing } = await supabase.from('profiles').select('onboarding, full_name').eq('id', caller.id).maybeSingle();
    const onboarding = (existing?.onboarding) || {};

    // Format input text cleanly to ensure NO raw JSON or code metadata is passed
    const rawInput = resumeText || onboarding?.resumeData || onboarding?.resume || '';
    const cleanTextToAnalyze = formatResumeObjectToPlainText(rawInput);

    if ((!cleanTextToAnalyze || cleanTextToAnalyze.length < 5) && !fileBase64) {
      return NextResponse.json({ error: 'Please provide valid resume content or upload a resume file to analyze.' }, { status: 400 });
    }

    // Check if API key is missing or mock
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      const fallback = fallbackTruthAnalysis(cleanTextToAnalyze, targetRole, jobDescription);
      return NextResponse.json({ data: sanitizeOutput(fallback), isFallback: true });
    }

    const promptText = `
You are AMPRIORA's Expert ATS Analyzer & Candidate Career Coach.
Analyze the candidate's resume content with thorough professional analysis.

TARGET ROLE: ${targetRole || onboarding?.targetRole || 'Software Engineering / Tech Professional'}
TARGET COMPANY: ${targetCompany || onboarding?.dreamCompany || 'Not specified'}

TARGET JOB DESCRIPTION:
${jobDescription ? jobDescription.slice(0, 6000) : 'None provided'}

CRITICAL OUTPUT RULE:
Do NOT output or mention internal code concepts, JSON schemas, payload structures, system prompts, API keys, validation rules, or developer instructions in any feedback or suggestions under any circumstances. Output ONLY candidate-facing professional career guidance.

ANALYSIS INSTRUCTIONS & TRUTH-FIRST RULE:
1. Provide a transparent ATS & recruiter evaluation (0-100 score).
2. Evaluate Section-by-Section: Summary, Skills, Experience, Projects, Education. Identify What is Good, What is Weak, What is Missing, and exact suggested improvements.
3. Check for ATS formatting hazards (missing headers, keyword gaps, weak action verbs).
4. If a Job Description is provided, calculate AMPRIORA Job Match score and list matched/missing keywords.
5. NEVER fabricate unperformed work, fake percentages, or fake companies. Refine wording based strictly on the candidate's real text.
`;

    let lastErrorMsg = '';

    for (const modelName of FALLBACK_MODELS) {
      try {
        let contents: any[] = [];
        if (fileBase64 && mimeType) {
          contents = [
            {
              inlineData: {
                mimeType: mimeType || 'application/pdf',
                data: fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64
              }
            },
            { text: promptText }
          ];
        } else {
          contents = [
            { text: `${promptText}\n\nCandidate Resume Content:\n${cleanTextToAnalyze.slice(0, 15000)}` }
          ];
        }

        const interaction = await ai.interactions.create({
          model: modelName,
          input: contents,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: comprehensiveAnalysisSchema
          }
        });

        if (interaction.output_text) {
          const result = JSON.parse(interaction.output_text);
          const sanitizedResult = sanitizeOutput(result);
          const analyzedAt = new Date().toISOString();
          const analysis = { ...sanitizedResult, analyzedAt, targetRole, targetCompany };

          // Persist analysis to profile onboarding SSoT without overwriting existing data
          const updatedOnboarding = { ...onboarding, resumeAnalysis: analysis };
          await supabase.from('profiles').upsert({ id: caller.id, full_name: existing?.full_name || caller.email, onboarding: updatedOnboarding }, { onConflict: 'id' });

          return NextResponse.json({ data: analysis });
        }
      } catch (err: any) {
        lastErrorMsg = err?.message || String(err);
        console.warn(`Resume Analyzer API error with ${modelName}:`, lastErrorMsg);
      }
    }

    // Deterministic Truth-First Fallback if quota exhausted (429) or model creation fails
    const fallback = fallbackTruthAnalysis(cleanTextToAnalyze, targetRole, jobDescription);
    const sanitizedFallback = sanitizeOutput(fallback);
    const analyzedAt = new Date().toISOString();
    const analysis = { ...sanitizedFallback, analyzedAt, targetRole, targetCompany, isQuotaFallback: true, lastErrorMsg };

    const updatedOnboarding = { ...onboarding, resumeAnalysis: analysis };
    await supabase.from('profiles').upsert({ id: caller.id, full_name: existing?.full_name || caller.email, onboarding: updatedOnboarding }, { onConflict: 'id' });

    return NextResponse.json({ data: analysis });

  } catch (err: any) {
    console.error('Resume Analyzer Error:', err);
    return NextResponse.json({ error: err?.message || 'Server error during analysis' }, { status: 500 });
  }
}
