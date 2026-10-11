import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'

const getUserFromAuthHeader = async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return null
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if (!token) return null
  const anonClient = createClient(supabaseUrl, anonKey)
  try {
    const { data, error } = await anonClient.auth.getUser(token)
    if (error) return null
    return data?.user || null
  } catch (e) {
    return null
  }
}

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash']

async function generateWithModelFallback(ai: GoogleGenAI, contents: any) {
  let lastError: any = null
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({ model, contents })
      if (response && response.text) {
        return response
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next fallback... Error:`, err?.message || err)
      lastError = err
    }
  }
  throw lastError || new Error('All AI models failed to generate content')
}

export async function POST(request: Request) {
  try {
    const caller = await getUserFromAuthHeader(request)
    if (!caller) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to start your mock interview.', code: 'UNAUTHENTICATED' },
        { status: 401 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Add GEMINI_API_KEY to .env.local.', code: 'MISSING_GEMINI_KEY' },
        { status: 503 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const { type, history, message, profileContext, difficulty, focusAreas, isStart } = await request.json()

    if (!type) {
      return NextResponse.json({ error: 'Missing interview type' }, { status: 400 })
    }

    const candidateName = profileContext?.full_name || caller.user_metadata?.full_name || 'Candidate'
    const targetRole = profileContext?.targetRole || 'Target Role'
    const dreamCompany = profileContext?.dreamCompany && profileContext.dreamCompany !== 'Not specified' ? profileContext.dreamCompany : ''
    const skills = Array.isArray(profileContext?.skills) ? profileContext.skills.join(', ') : (profileContext?.skills || 'Domain skills')
    const level = difficulty || 'Mid-Level'
    const topics = focusAreas || 'Core domain skills'

    const companyPhrase = dreamCompany ? `simulating a ${level} ${targetRole} interview for ${dreamCompany}` : `simulating a ${level} ${targetRole} interview`

    const systemInstruction = `You are the AMPRIORA AI Interviewer conducting a realistic, empathetic, interactive mock ${type.toUpperCase()} interview ${companyPhrase} for candidate ${candidateName}.

INTERVIEW CONTEXT:
- Candidate Name: ${candidateName}
- Mandatory Target Role: ${targetRole}
- Target Company Context: ${dreamCompany || 'Not specified'}
- Difficulty Level: ${level}
- Candidate Skills: ${skills}
- Focus Topics: ${topics}
- Track: ${type.toUpperCase()} (Technical / HR / Behavioral)

STRICT IDENTITY RULES:
1. You represent AMPRIORA. You are the AMPRIORA Interviewer.
2. NEVER claim you are an actual employee or engineer at ${dreamCompany || 'the target company'}. Frame the context as ${companyPhrase}.
3. NEVER mention Gemini, Google AI, LLM, or AI model names. The user is on the AMPRIORA platform.

EVALUATION & RESPONSE CYCLE (CRITICAL):
For every answer submitted by the candidate:
1. EVALUATE THE ACTUAL ANSWER SUBMITTED:
   - If Correct: Briefly acknowledge what was correct (e.g., "Good answer, ${candidateName}. You correctly identified..."). Then ask ONE deeper follow-up question.
   - If Partially Correct: Acknowledge what was correct, politely clarify the mistake or missing concept in simple terms, then ask ONE related follow-up question.
   - If Incorrect: Politely explain the correction without discouraging the candidate (e.g., "You're on the right track, but there's an important distinction..."). Then ask ONE simpler follow-up question.
   - If Struggling ("I don't know" / "I'm not sure"): Acknowledge calmly ("That's okay. Let's break it down step by step.") and ask ONE simpler foundational question or give a small hint.
   - If Nervous ("I'm nervous" / "I'm scared"): Respond warmly ("Take a breath and take your time, ${candidateName}. There's no need to rush. Start with the basic idea.") and ask ONE manageable question.
2. EXACTLY ONE QUESTION PER TURN: Ask ONLY ONE single focused primary question in your response.
3. NO MULTI-PART QUESTIONS: NEVER combine questions using "and", "also", "as well as", "explain X and Y", or multiple question marks.
4. SHORT & CONCISE: Keep your response between 1-3 short sentences (max 50 words per turn).
5. SESSION CONTINUITY: Reference earlier details or projects mentioned by the candidate in this conversation when appropriate.`

    if (isStart) {
      const startPrompt = `${systemInstruction}\n\nTask: Greet ${candidateName} in 1-2 short sentences as the AMPRIORA Interviewer ${companyPhrase}. Then immediately ask your FIRST SINGLE OPENING QUESTION for the ${targetRole} role. Do NOT ask multiple questions.`
      
      const response = await generateWithModelFallback(ai, [{ role: 'user', parts: [{ text: startPrompt }] }])

      const aiMessage = response.text || `Hi ${candidateName}, welcome to your AMPRIORA ${type.toUpperCase()} Mock Interview for ${targetRole}${dreamCompany ? ` (${dreamCompany})` : ''}. To begin, could you briefly introduce yourself and your background relevant to this role?`
      return NextResponse.json({ message: aiMessage })
    }

    if (!message && (!history || history.length === 0)) {
      return NextResponse.json({ error: 'Missing message or history' }, { status: 400 })
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const response = await generateWithModelFallback(ai, [
      { role: 'user', parts: [{ text: `System Instruction:\n${systemInstruction}` }] },
      { role: 'model', parts: [{ text: `Understood. I am the AMPRIORA Interviewer. I will evaluate the candidate's actual answer and ask EXACTLY ONE single focused question per turn.` }] },
      ...formattedHistory,
      { role: 'user', parts: [{ text: message || "Please proceed with the next single question." }] }
    ])

    const aiMessage = response.text || "Thank you. Let's move to the next question."

    return NextResponse.json({ message: aiMessage })
  } catch (error: any) {
    console.error('Mock Interview API Error:', error)

    const isQuotaError = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded')
    if (isQuotaError) {
      return NextResponse.json(
        { error: 'AI Interview service rate limit reached. Please wait 10-15 seconds and try again.', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate interview response' },
      { status: 500 }
    )
  }
}
