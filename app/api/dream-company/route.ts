import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import supabase from '@/lib/supabaseClient'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { company, role, userSkills } = await request.json()

    if (!company || !role) {
      return NextResponse.json({ error: 'Missing company or role' }, { status: 400 })
    }

    const systemInstruction = `You are an expert technical recruiter and career coach at a top tech company. 
Your task is to analyze a candidate's readiness for a specific role at a specific company.
Given the company, role, and the user's current skills, provide a JSON response with the following format exactly:
{
  "targetSkills": ["List of 8-10 core skills required for this role at this company"],
  "matched": ["Subset of targetSkills that the user already has (fuzzy match)"],
  "missing": ["Subset of targetSkills that the user is missing"],
  "priority": ["Top 3 missing skills to focus on first"],
  "readiness": 0-100 (integer representing readiness percentage),
  "roadmapItems": ["3 specific, actionable steps to prepare for this role at this company"]
}
Only output valid JSON. Do not include markdown formatting like \`\`\`json.
`

    const prompt = `
Company: ${company}
Role: ${role}
User's Current Skills: ${userSkills.join(', ') || 'None'}
`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `System Instruction: ${systemInstruction}` }] },
        { role: 'model', parts: [{ text: `Understood. I will provide the analysis in JSON format.` }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    })

    const responseText = response.text || "{}"
    let analysisData;
    try {
      analysisData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim())
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText)
      return NextResponse.json({ error: 'Failed to generate valid analysis' }, { status: 500 })
    }

    return NextResponse.json({ data: analysisData })
  } catch (error: any) {
    console.error('Dream Company API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
