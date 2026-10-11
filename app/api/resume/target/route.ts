import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const targetedMatchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchPercentage: { type: Type.INTEGER, description: "Calculated match score from 0 to 100 based on candidate's REAL profile vs JD requirements." },
    matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills present in candidate profile that match the target JD." },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required or preferred skills in JD that candidate currently lacks." },
    partiallyMatchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills with partial match or related tech." },
    relevantProjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Candidate's projects that align directly with the target role." },
    relevantExperience: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Candidate's work/internship experiences relevant to the role." },
    suggestedSummary: { type: Type.STRING, description: "Enhanced professional summary highlighting real candidate background targeted for this role." },
    optimizedBullets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          improved: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      },
      description: "Improved action-oriented bullet points based ONLY on candidate's real experience."
    },
    missingRequirementsRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Truth-first advice for gaps (e.g. recommend learning or project work)." }
  },
  required: ["matchPercentage", "matchedSkills", "missingSkills", "suggestedSummary", "optimizedBullets"]
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
    const { targetRole, targetCompany, jobDescription, resumeData } = body;

    if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
      return NextResponse.json({ error: 'Target Role is required to generate targeted recommendations.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      return NextResponse.json({ error: 'Gemini API Key is missing. Please configure GEMINI_API_KEY in .env.local.' }, { status: 500 });
    }

    const promptText = `
You are AMPRIORA's Expert Resume Optimizer & Job Matching Engine.
Analyze the candidate's REAL resume/profile data against the Target Role, Target Company, and Job Description.

TARGET ROLE: ${targetRole.trim()}
TARGET COMPANY: ${targetCompany ? targetCompany.trim() : 'Not specified'}

JOB DESCRIPTION:
${jobDescription ? jobDescription.trim().slice(0, 8000) : 'None provided (analyze for standard ' + targetRole + ' requirements)'}

CANDIDATE'S REAL RESUME / PROFILE DATA:
${JSON.stringify(resumeData || {}).slice(0, 10000)}

STRICT TRUTH-FIRST & NO FABRICATION RULES:
1. ONLY refine, clarify, and format candidate's ACTUAL stated experience and skills.
2. NEVER generate fake metrics, fake percentages (e.g. "improved speed by 40%"), fake companies, or fake tools the candidate did not explicitly use.
3. If a required skill (e.g., AWS) is absent from the candidate's profile, DO NOT claim they know it. List it in "missingSkills" and suggest a project/learning step.
4. Improve bullet point phrasing using Action Verb + Task + Tool + Result (only if real result is provided).
5. Output structured JSON matching the schema.
`;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const interaction = await ai.interactions.create({
          model: modelName,
          input: promptText,
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: targetedMatchSchema
          }
        });

        if (interaction.output_text) {
          const result = JSON.parse(interaction.output_text);
          return NextResponse.json({ data: result });
        }
      } catch (err: any) {
        console.warn(`Targeted Resume API error with ${modelName}:`, err?.message || err);
      }
    }

    return NextResponse.json({ error: 'Targeted optimization service temporarily unavailable. Please retry in a few seconds.' }, { status: 503 });

  } catch (err: any) {
    console.error('Targeted Resume API Error:', err);
    return NextResponse.json({ error: err?.message || 'Server error during targeted analysis' }, { status: 500 });
  }
}
