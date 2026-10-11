import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const extractedProfileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, description: "Full name of candidate if explicitly stated in resume" },
    email: { type: Type.STRING, description: "Email address if present in resume" },
    phone: { type: Type.STRING, description: "Phone number if present in resume" },
    college: { type: Type.STRING, description: "University or college name if present" },
    branch: { type: Type.STRING, description: "Major, degree, or branch of study if present" },
    year: { type: Type.STRING, description: "Study year or graduation year if present" },
    location: { type: Type.STRING, description: "City or location if present" },
    about: { type: Type.STRING, description: "Professional summary or bio if present" },
    targetCareer: { type: Type.STRING, description: "Target career goal or domain if present" },
    targetRole: { type: Type.STRING, description: "Target job title or role if present" },
    dreamCompany: { type: Type.STRING, description: "Target company if mentioned" },
    skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical and professional skills explicitly present" },
    education: { type: Type.STRING, description: "Degree level or education summary if present" },
    certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Certifications earned if present" },
    projects: { 
      type: Type.ARRAY, 
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.STRING },
          link: { type: Type.STRING }
        }
      },
      description: "Projects listed in resume"
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          details: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING }
        }
      },
      description: "Work experiences or internships listed in resume"
    },
    achievements: { type: Type.STRING, description: "Honors, awards, or achievements if present" },
    github: { type: Type.STRING, description: "GitHub URL or handle if present" },
    linkedin: { type: Type.STRING, description: "LinkedIn URL or handle if present" },
    portfolio: { type: Type.STRING, description: "Personal website or portfolio URL if present" }
  }
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

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

function fallbackRegexExtraction(text: string) {
  if (!text || typeof text !== 'string') text = '';
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  
  // Extract candidate name from first line if valid and non-generic
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const candidateName = lines[0] && lines[0].length < 40 && !lines[0].includes('@') && !lines[0].toLowerCase().includes('resume') ? lines[0] : '';

  // Technical skills lookup
  const commonSkills = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'C++', 'C#', '.NET', 'Java', 'SQL', 'HTML', 'CSS', 'Tailwind', 'Git', 'Machine Learning', 'Docker', 'AWS', 'PyTorch', 'Next.js', 'PostgreSQL', 'MongoDB', 'Kubernetes', 'GraphQL', 'REST API', 'Flutter', 'Go', 'Rust'];
  const extractedSkills = commonSkills.filter(s => includesKeyword(text, s));

  return {
    fullName: candidateName,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    college: '',
    branch: '',
    year: '',
    location: '',
    about: lines.slice(1, 4).join(' '),
    targetCareer: '',
    targetRole: '',
    dreamCompany: '',
    skills: extractedSkills,
    education: '',
    certifications: [],
    projects: [],
    experience: [],
    achievements: '',
    github: githubMatch ? githubMatch[0] : '',
    linkedin: linkedinMatch ? linkedinMatch[0] : '',
    portfolio: ''
  };
}

export async function POST(req: Request) {
  try {
    const caller = await getUserFromAuthHeader(req);
    
    const body = await req.json();
    const { resumeText, fileBase64, mimeType } = body;

    if ((!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 5) && !fileBase64) {
      return NextResponse.json({ error: 'Please provide a valid resume file or text.' }, { status: 400 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      const fallbackData = fallbackRegexExtraction(resumeText || '');
      return NextResponse.json({ data: fallbackData, isFallback: true });
    }

    const promptText = `
You are an expert resume parser for AMPRIORA.
Analyze the candidate's resume and extract all factual details into structured JSON format.

CRITICAL PRODUCT RULES:
1. ONLY extract information that is explicitly stated or confidently identifiable in the resume.
2. DO NOT invent, assume, or hallucinate missing information under any circumstances.
3. If a field (e.g. phone, linkedin, college, targetRole, dreamCompany) is not present in the resume, return an empty string "" or empty array [].
4. Do NOT output placeholder or sample data like "John Doe", "Tech Corp", "Software Engineer" unless it is literally in the document.
`;

    for (const modelName of FALLBACK_MODELS) {
      try {
        let contents: any[] = [];
        if (fileBase64 && mimeType) {
          contents = [
            {
              inlineData: {
                mimeType: mimeType,
                data: fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64
              }
            },
            { text: promptText }
          ];
        } else {
          contents = [
            { text: `${promptText}\n\nResume Content:\n${(resumeText || '').slice(0, 15000)}` }
          ];
        }

        const interaction = await ai.interactions.create({
          model: modelName,
          input: contents,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: extractedProfileSchema
          }
        });

        if (interaction.output_text) {
          const parsedResult = JSON.parse(interaction.output_text);
          return NextResponse.json({ data: parsedResult });
        }
      } catch (aiErr: any) {
        console.warn(`Resume Parse API error with ${modelName}:`, aiErr?.message || aiErr);
      }
    }

    // Fallback parsing if AI model attempts exhaust or fail
    const fallbackData = fallbackRegexExtraction(resumeText || '');
    return NextResponse.json({ data: fallbackData, isFallback: true });

  } catch (err: any) {
    console.error('Resume Parse API Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to process resume' }, { status: 500 });
  }
}
